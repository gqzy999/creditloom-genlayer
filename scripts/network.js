import {createClient,createAccount,generatePrivateKey} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {reader,source,digest,verify,read} from '../src/chain.js';
import {success,json} from '../src/utils.js';
const k='creditloom-network-v1';
let c=JSON.parse(sessionStorage.getItem(k)||'null')||{keys:[generatePrivateKey(),generatePrivateKey(),generatePrivateKey()],id:'atlas-'+Date.now(),steps:{},address:''};
const accounts=c.keys.map(createAccount), clients=accounts.map(account=>createClient({chain:studionet,account})),members=accounts.map(a=>a.address.toLowerCase()),owner=members[0];
const statements=[
 'I originated the exhibition concept and designed its visitor journey. I did not produce the artwork or test the finished exhibition.',
 'I created all six illustrations and built the exhibition website. I did not originate the concept or test the completed website.',
 'I tested the completed website on mobile and desktop and checked all exhibition captions for errors. I did not originate the concept or produce the illustrations or website.'
];
function evidence(){return {protocol:'creditloom-1',network:61999,fullConsensus:true,fixture:'Synthetic exhibition; three controlled test wallets, not independent collaborators.',sourceSha256:digest(source),address:c.address,owner,id:c.id,members,steps:c.steps,record:c.record||null,error:c.error||null};}
function save(){sessionStorage.setItem(k,JSON.stringify(c));document.querySelector('#report').textContent=json(evidence());}
function status(s){document.querySelector('#status').textContent=s;save();}
function slim(tx){let ls=tx.consensus_data?.leader_receipt;ls=Array.isArray(ls)?ls:[ls];return {status:tx.status,result:tx.result,from:tx.from_address,to:tx.to_address,contract:tx.data?.contract_address,votes:tx.consensus_data?.votes,leaders:ls.filter(Boolean).map(l=>({execution_result:l.execution_result,mode:l.mode,vote:l.vote,result:l.result?.status==='rollback'?l.result:{status:l.result?.status,readable:l.result?.payload?.readable},genvm_result:l.genvm_result}))};}
async function step(name,signer,method,args,expected=true){let s=c.steps[name];if(s?.done)return;status(name+(s?.hash?' · tracking':' · sending once'));if(!s){c.steps[name]={sending:true};save();const hash=method==='deploy'?await clients[signer].deployContract({code:source,args:[],leaderOnly:false}):await clients[signer].writeContract({address:c.address,functionName:method,args,value:0n,leaderOnly:false});c.steps[name]={hash,method,args,signer:members[signer]};save();s=c.steps[name];}if(!s.hash)throw Error('Unknown send outcome. Stop and inspect.');const tx=await reader.waitForTransactionReceipt({hash:s.hash,status:'FINALIZED',interval:3000,retries:30,fullTransaction:true});s.receipt=slim(tx);save();if(expected&&!success(tx))throw Error(name+' failed agreeing execution');if(!expected&&!s.receipt.leaders.some(l=>l.mode==='leader'&&l.execution_result==='ERROR'))throw Error(name+' did not reject');if(method==='deploy'){c.address=tx.data?.contract_address||tx.contract_address||tx.to_address;await verify(c.address);}s.done=true;save();}
async function run(){document.querySelector('#run').disabled=true;c.error=null;try{
 await step('01-deploy',0,'deploy',[]);
 await step('02-open',0,'open_work',[c.id,'The Everyday Atlas','A small online exhibition: six illustrated stories about overlooked places, presented on a responsive website.',JSON.stringify(members)]);
 for(let i=0;i<3;i++)await step('0'+(3+i)+'-declare',i,'declare',[owner,c.id,statements[i]]);
 await step('06-duplicate-declaration-denied',0,'declare',[owner,c.id,'I now claim to have done everything in this exhibition.'],false);
 await step('07-weave',0,'weave',[owner,c.id]);c.record=await read(c.address,owner,c.id);save();
 const got=c.record.rows.map(r=>r.cells.map(x=>x.label));if(JSON.stringify(got)!==JSON.stringify([['YES','NO','NO'],['NO','YES','NO'],['NO','NO','YES']]))throw Error('Unexpected live role matrix; inspect before proceeding.');
 await step('08-early-publication-denied',0,'publish',[owner,c.id],false);
 await step('09-wrong-digest-denied',1,'approve',[owner,c.id,'0'.repeat(64)],false);
 for(let i=0;i<3;i++)await step((10+i)+'-approve',i,'approve',[owner,c.id,c.record.digest]);
 await step('13-publish',2,'publish',[owner,c.id]);c.record=await read(c.address,owner,c.id);save();if(c.record.state!=='PUBLISHED'||c.record.approvals.length!==3)throw Error('Final state mismatch.');status('VERIFIED — signed declarations, independent role consensus, unanimous digest approval, immutable publication.');
}catch(err){c.error=err.shortMessage||err.message||String(err);status('Paused: '+c.error);}finally{document.querySelector('#run').disabled=false;save();}}
document.querySelector('#run').onclick=run;document.querySelector('#export').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([json(evidence())],{type:'application/json'}));a.download='creditloom-studionet.json';a.click();};save();
