export const json=x=>JSON.stringify(x,(_,v)=>typeof v==='bigint'?v.toString():v,2);
export const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const short=s=>s?s.slice(0,6)+'…'+s.slice(-4):'—';
export const addressOK=s=>/^0x[0-9a-f]{40}$/i.test(s||'')&&!/^0x0{40}$/i.test(s);
export function success(tx){let l=tx.consensus_data?.leader_receipt;l=Array.isArray(l)?l.find(r=>r.mode==='leader'):l;return [7,'FINALIZED'].includes(tx.status)&&[6,'MAJORITY_AGREE'].includes(tx.result)&&l?.execution_result==='SUCCESS';}
export function failure(tx){let l=tx.consensus_data?.leader_receipt;l=Array.isArray(l)?l.find(r=>r.mode==='leader'):l;return [6,7,8,'FINALIZED','CANCELED','UNDETERMINED'].includes(tx.status)&&([8,'CANCELED'].includes(tx.status)||[7,'MAJORITY_DISAGREE'].includes(tx.result)||l?.execution_result==='ERROR');}
export function readiness(r){return r.rows?.length===r.members.length&&r.rows.every(row=>row.cells.length===3&&row.cells.every(c=>c.label!=='UNCLEAR')&&row.cells.some(c=>c.label==='YES'));}
