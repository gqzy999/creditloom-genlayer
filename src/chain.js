import {createClient, createAccount, generatePrivateKey, abi} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {sha256,toBytes,getAddress} from 'viem';
import source from '../contracts/creditloom.py?raw';
import {addressOK} from './utils.js';
export {source};
export const reader=createClient({chain:studionet});
export const digest=s=>sha256(toBytes(s)).slice(2);
export async function verify(address){if(!addressOK(address))throw Error('Enter a valid contract address.');address=getAddress(address);if(digest(await reader.getContractCode(address))!==digest(source))throw Error('Contract source does not match CreditLoom.');if(await reader.readContract({address,functionName:'get_protocol',args:[],transactionHashVariant:'latest-final'})!=='creditloom-1')throw Error('Protocol mismatch.');return address.toLowerCase();}
export function temporary(){const account=createAccount(generatePrivateKey());return {owner:account.address.toLowerCase(),client:createClient({chain:studionet,account}),temporary:true};}
export async function connect(){const provider=window.ethereum||window.okxwallet?.ethereum||window.okxwallet;if(!provider?.request)throw Error('Use a wallet browser, or a temporary zero-gas session.');const accounts=await provider.request({method:'eth_requestAccounts'});const owner=accounts[0]?.toLowerCase();if(!addressOK(owner))throw Error('No wallet account.');const w={provider,owner,client:createClient({chain:studionet,provider,account:owner})};await check(w);return w;}
export async function check(w){if(!w)throw Error('Connect a wallet first.');if(w.temporary)return;const [a,id]=await Promise.all([w.provider.request({method:'eth_accounts'}),w.provider.request({method:'eth_chainId'})]);if(a[0]?.toLowerCase()!==w.owner||Number(id)!==61999)throw Error('Reconnect your wallet on Stable Studionet (61999).');}
export async function read(address,owner,id){address=getAddress(address);if(!addressOK(owner)||!id)throw Error('Enter owner and work ID.');const raw=await reader.readContract({address,functionName:'get_work',args:[owner,id],transactionHashVariant:'latest-final'});if(!raw)throw Error('Work not found.');const r=JSON.parse(raw);if(r.protocol!=='creditloom-1'||r.owner!==owner.toLowerCase()||r.id!==id)throw Error('Unexpected record.');return r;}
export const wait=hash=>reader.waitForTransactionReceipt({hash,status:'FINALIZED',interval:3000,retries:15,fullTransaction:true});
export function bind(tx,p){if(tx.from_address?.toLowerCase()!==p.from||tx.to_address?.toLowerCase()!==p.address)throw Error('Receipt signer/target mismatch.');let b=tx.data?.calldata;b=typeof b==='string'?b:b?.base64;if(!b)throw Error('Receipt calldata unavailable.');const call=abi.calldata.decode(Uint8Array.from(atob(b),c=>c.charCodeAt(0)));if(!(call instanceof Map)||call.get('method')!==p.method||JSON.stringify(call.get('args')||[])!==JSON.stringify(p.args))throw Error('Receipt call mismatch.');}
