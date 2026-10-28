import {addressOK,escape as esc} from './utils.js';
export const roles=['CONCEPT','MAKING','VALIDATION'];
export const roleTitles=['Concept & direction','Making & implementation','Review & validation'];
// Match Python json.dumps(sort_keys=True,separators=(',',':'),ensure_ascii=True).
export function pythonCanonical(value){
 if(Array.isArray(value))return '['+value.map(pythonCanonical).join(',')+']';
 if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(k=>pythonCanonical(k)+':'+pythonCanonical(value[k])).join(',')+'}';
 return JSON.stringify(value).replace(/[\u0080-\uffff]/g,c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0'));
}
export async function recordDigest(record){
 const payload=Object.fromEntries(['protocol','owner','id','title','context','members','statements','rows'].map(k=>[k,record[k]]));
 return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(pythonCanonical(payload))))].map(x=>x.toString(16).padStart(2,'0')).join('');
}
const fail=message=>{throw Error(message);};
const text=(s,min,max)=>typeof s==='string'&&[...s.trim()].length>=min&&[...s.trim()].length<=max;
export async function checkPublication(input){
 if(!input||typeof input!=='object')fail('Select a CreditLoom JSON export or publication package.');
 let record,reference;
 if(input.schema==='creditloom-publication-1'&&input.network===61999){record=input.record;reference=input.reference;}
 else if(input.kind==='CHAIN_READBACK'&&input.network===61999){record=input.record;reference=input.selection;}
 else fail('Only a chain record export or publication package is supported; authored examples cannot be published.');
 if(!record||record.protocol!=='creditloom-1'||record.state!=='PUBLISHED')fail('A published CreditLoom record is required.');
 if(!reference||!addressOK(reference.address)||!addressOK(record.owner)||reference.owner!==record.owner||reference.id!==record.id||!/^[-_a-zA-Z0-9]{1,40}$/.test(record.id))fail('Contract, owner or work ID binding is invalid.');
 if(!text(record.title,3,100)||!text(record.context,20,1400))fail('Invalid work title or context.');
 const m=record.members;
 if(!Array.isArray(m)||m.length<2||m.length>5||m.some(x=>!addressOK(x)||x!==x.toLowerCase())||new Set(m).size!==m.length||!m.includes(record.owner))fail('Invalid or duplicate member addresses.');
 if(!record.statements||Object.keys(record.statements).length!==m.length||m.some(x=>!Object.hasOwn(record.statements,x)||!text(record.statements[x],30,1800)))fail('Every member needs its own signed statement.');
 if(!Array.isArray(record.approvals)||record.approvals.length!==m.length||new Set(record.approvals).size!==m.length||record.approvals.some(x=>!m.includes(x)))fail('Publication requires every distinct member approval.');
 if(!Array.isArray(record.rows)||record.rows.length!==m.length)fail('Incomplete role matrix.');
 record.rows.forEach((row,i)=>{
  if(row.member!==m[i]||!Array.isArray(row.cells)||row.cells.length!==3)fail('Member or role ordering is invalid.');
  row.cells.forEach((c,j)=>{if(c.role!==roles[j]||!['YES','NO'].includes(c.label)||typeof c.quote!=='string'||[...c.quote].length>300||(c.quote&&!record.statements[m[i]].includes(c.quote))||(c.label==='YES'&&[...c.quote].length<5)||!text(c.reason,8,250))fail('Invalid role label, evidence quotation or explanation.');});
  if(!row.cells.some(c=>c.label==='YES'))fail('A member without a supported role cannot publish.');
 });
 if(!/^[a-f0-9]{64}$/.test(record.digest)||await recordDigest(record)!==record.digest)fail('Record digest mismatch: the signed content has changed.');
 // Never trust imported provenance or verification labels. Local checks cannot authenticate approvals.
 return {schema:'creditloom-publication-1',network:61999,reference:{address:reference.address,owner:record.owner,id:record.id},record:structuredClone(record),verification:{kind:'SNAPSHOT_ONLY'},limits:'Wallet addresses are not verified identities. Local integrity checks do not authenticate signatures or publication; verify against finalized chain state. No copyright, ownership, payment or quality determination.'};
}
export async function matchPublication(pack,chainRecord){
 const clean=await checkPublication(pack);
 await checkPublication({...clean,record:chainRecord});
 if(pythonCanonical(clean.record)!==pythonCanonical(chainRecord))fail('Imported publication differs from the finalized chain record.');
 return {...clean,verification:{kind:'FINALIZED_CHAIN_MATCH',checked_at:new Date().toISOString()}};
}
const status=p=>p.verification.kind==='FINALIZED_CHAIN_MATCH'?'Matched finalized chain state at '+p.verification.checked_at:'Snapshot integrity checked only; chain verification is still required';
const md=s=>String(s).replace(/[\\`*_{}\[\]()<>#!|~]/g,'\\$&').replace(/\r?\n/g,' ');
export function publicationMarkdown(pack){
 const r=pack.record;
 return '# '+md(r.title)+' — contribution credits\n\n'+md(r.context)+'\n\n'+r.members.map((m,i)=>'- '+m+': '+r.rows[i].cells.flatMap((c,j)=>c.label==='YES'?[roleTitles[j]]:[]).join('; ')).join('\n')+'\n\nContributor order follows the agreed record; it is not a ranking.\n\nVerification: '+status(pack)+'\n\nStable Studionet: 61999\n\nContract: '+pack.reference.address+'\n\nOwner: '+r.owner+'\n\nWork ID: '+r.id+'\n\nRecord SHA-256: '+r.digest+'\n\n'+pack.limits+'\n';
}
export function publicationHTML(pack){
 const r=pack.record;
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; base-uri \'none\'; form-action \'none\'"><title>'+esc(r.title)+' — CreditLoom credits</title><style>body{font:16px/1.6 system-ui,sans-serif;max-width:850px;margin:40px auto;padding:24px;color:#17342d}h1{line-height:1.2}article{padding:20px 0;border-top:1px solid #ccd5ca}code{overflow-wrap:anywhere}blockquote{margin:12px 0;padding:12px;background:#f2f3ed}.meta{background:#f2f3ed;padding:16px}@media print{body{margin:0;max-width:none}article{break-inside:avoid}}</style></head><body><p>CREDITLOOM / CONTRIBUTION CREDITS</p><h1>'+esc(r.title)+'</h1><p>'+esc(r.context)+'</p><p class="meta">'+esc(status(pack))+'</p>'+r.members.map((m,i)=>'<article><h2>Contributor '+(i+1)+'</h2><code>'+esc(m)+'</code><p>'+r.rows[i].cells.flatMap((c,j)=>c.label==='YES'?[esc(roleTitles[j])]:[]).join(' · ')+'</p><blockquote>'+esc(r.statements[m])+'</blockquote>'+r.rows[i].cells.filter(c=>c.label==='YES').map(c=>'<p><strong>'+esc(c.role)+'</strong>: '+esc(c.reason)+'<br><q>'+esc(c.quote)+'</q></p>').join('')+'</article>').join('')+'<p>Contributor order follows the agreed record; it is not a ranking.</p><h2>Public record reference</h2><p>Stable Studionet 61999<br>Contract: <code>'+esc(pack.reference.address)+'</code><br>Owner: <code>'+esc(r.owner)+'</code><br>Work ID: <code>'+esc(r.id)+'</code><br>SHA-256: <code>'+esc(r.digest)+'</code></p><p>'+esc(pack.limits)+'</p><p>This static page does not perform live verification. Import the JSON package into CreditLoom to recheck finalized state.</p></body></html>';
}
