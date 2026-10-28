import {test} from 'node:test';import assert from 'node:assert/strict';import {success,failure,readiness,escape,addressOK} from '../src/utils.js';
const tx={status:7,result:6,consensus_data:{leader_receipt:[{mode:'leader',execution_result:'SUCCESS'}]}};
test('finalization requires successful leader and agreeing outcome',()=>{assert.ok(success(tx));assert.ok(!success({...tx,status:5}));assert.ok(!success({...tx,result:7}));assert.ok(!success({...tx,consensus_data:{leader_receipt:[{mode:'leader',execution_result:'ERROR'}]}}));});
test('terminal error distinguished from pending',()=>{assert.ok(failure({...tx,result:7}));assert.ok(!failure({...tx,status:5,result:null}));});
test('every person needs a supported role and no uncertainty',()=>{const members=['a','b'];const row={cells:[{label:'YES'},{label:'NO'},{label:'NO'}]};assert.ok(readiness({members,rows:[row,row]}));assert.ok(!readiness({members,rows:[row]}));assert.ok(!readiness({members,rows:[row,{cells:[{label:'NO'},{label:'NO'},{label:'NO'}]}]}));assert.ok(!readiness({members,rows:[row,{cells:[{label:'YES'},{label:'UNCLEAR'},{label:'NO'}]}]}));});
test('untrusted contributor text stays escaped',()=>assert.equal(escape('<img src=x onerror="x">'),'&lt;img src=x onerror=&quot;x&quot;&gt;'));
test('nonzero wallet addresses only',()=>{assert.ok(addressOK('0x'+'a'.repeat(40)));assert.ok(!addressOK('0x'+'0'.repeat(40)));});
