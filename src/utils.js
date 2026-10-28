export const json=x=>JSON.stringify(x,(_,v)=>typeof v==='bigint'?v.toString():v,2);
export const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const short=s=>s?s.slice(0,6)+'…'+s.slice(-4):'—';
export const addressOK=s=>/^0x[0-9a-f]{40}$/i.test(s||'')&&!/^0x0{40}$/i.test(s);
export function success(tx){let l=tx.consensus_data?.leader_receipt;l=Array.isArray(l)?l.find(r=>r.mode==='leader'):l;return [7,'FINALIZED'].includes(tx.status)&&[6,'MAJORITY_AGREE'].includes(tx.result)&&l?.execution_result==='SUCCESS';}
export function failure(tx){let l=tx.consensus_data?.leader_receipt;l=Array.isArray(l)?l.find(r=>r.mode==='leader'):l;return [6,7,8,'FINALIZED','CANCELED','UNDETERMINED'].includes(tx.status)&&([8,'CANCELED'].includes(tx.status)||[7,'MAJORITY_DISAGREE'].includes(tx.result)||l?.execution_result==='ERROR');}
export function readiness(r){return r.rows?.length===r.members.length&&r.rows.every(row=>row.cells.length===3&&row.cells.every(c=>c.label!=='UNCLEAR')&&row.cells.some(c=>c.label==='YES'));}

export function matchesReadback(record, intent) {
  if (!record || record.protocol !== 'creditloom-1' || record.owner !== intent.owner?.toLowerCase() || record.id !== intent.id) return false;
  const args = intent.args || [];
  if (intent.method === 'open_work') {
    try {
      const members = JSON.parse(args[3]).map(member => member.toLowerCase());
      return record.owner === intent.from && record.id === args[0] && record.title === args[1].trim() && record.context === args[2].trim() && JSON.stringify(record.members) === JSON.stringify(members) && ['COLLECTING', 'AWAITING_APPROVAL', 'NEEDS_CLARITY', 'PUBLISHED'].includes(record.state);
    } catch { return false; }
  }
  if (intent.method === 'declare') return record.statements?.[intent.from] === args[2];
  if (intent.method === 'weave') return record.rows?.length === record.members?.length && ['AWAITING_APPROVAL', 'NEEDS_CLARITY', 'PUBLISHED'].includes(record.state);
  if (intent.method === 'approve') return record.approvals?.includes(intent.from) && record.digest === args[2];
  if (intent.method === 'publish') return record.state === 'PUBLISHED';
  return false;
}
