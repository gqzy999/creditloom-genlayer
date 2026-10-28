import unittest, types, sys, json, importlib.util
class Error(Exception): pass
class Return:
    def __init__(self,value): self.calldata=value
class Map(dict):
    @classmethod
    def __class_getitem__(cls,x): return cls
public=types.SimpleNamespace(write=lambda f:f,view=lambda f:f)
gl=types.SimpleNamespace(Contract=object,public=public,message=types.SimpleNamespace(sender_address=''),vm=types.SimpleNamespace(UserError=Error,Return=Return),nondet=types.SimpleNamespace())
mod=types.ModuleType('genlayer');mod.__all__=['gl','TreeMap'];mod.gl=gl;mod.TreeMap=Map;sys.modules['genlayer']=mod
spec=importlib.util.spec_from_file_location('creditloom','contracts/creditloom.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
A='0x'+'1'*40;B='0x'+'2'*40;C='0x'+'3'*40
class TestLoom(unittest.TestCase):
    def setUp(self):
        self.c=m.CreditLoom();self.sender(A);self.c.open_work('atlas','Atlas','A collaborative illustrated exhibition.',json.dumps([A,B]));self.sender(A)
    def sender(self,a): gl.message.sender_address=a
    def load(self): return json.loads(self.c.get_work(A,'atlas'))
    def declare(self):
        self.c.declare(A,'atlas','I designed the original concept and visitor journey.');self.sender(B);self.c.declare(A,'atlas','I produced all six illustrations for the exhibition.');self.sender(A)
    def output(self,unclear=False,empty=False):
        statements=self.load()['statements'];return {'rows':[{'member':a,'cells':[{'role':r,'label':('UNCLEAR' if unclear and i==0 and j==2 else 'YES' if j==i and not empty else 'NO'),'quote':statements[a] if j==i and not empty else '', 'reason':'This role is explicitly supported.'} for j,r in enumerate(m.ROLES)]} for i,a in enumerate([A,B])]}
    def weave(self,**kw):
        out=self.output(**kw);gl.nondet.exec_prompt=lambda *a,**k:out
        def run(lead,check):
            value=lead();self.assertTrue(check(Return(value)));self.assertFalse(check(object()));return value
        gl.vm.run_nondet_unsafe=run;self.c.weave(A,'atlas')
    def test_full_flow(self):
        self.declare();self.weave();d=self.load()['digest'];self.c.approve(A,'atlas',d);self.sender(B);self.c.approve(A,'atlas',d);self.c.publish(A,'atlas');self.assertEqual(self.load()['state'],'PUBLISHED');self.assertEqual(len(d),64)
    def test_outsider_cannot_declare(self):
        self.sender(C)
        with self.assertRaises(Error):self.c.declare(A,'atlas','I produced everything for the exhibition.')
    def test_duplicate_immutable(self):
        self.declare()
        with self.assertRaises(Error):self.c.declare(A,'atlas','A new claim that replaces my old contribution.')
    def test_missing_statement_blocks(self):
        with self.assertRaises(Error):self.c.weave(A,'atlas')
    def test_unclear_blocks_approval(self):
        self.declare();self.weave(unclear=True);self.assertEqual(self.load()['state'],'NEEDS_CLARITY')
        with self.assertRaises(Error):self.c.approve(A,'atlas',self.load()['digest'])
    def test_zero_roles_blocks(self):
        self.declare();self.weave(empty=True);self.assertEqual(self.load()['state'],'NEEDS_CLARITY')
    def test_early_publish_denied(self):
        self.declare();self.weave()
        with self.assertRaises(Error):self.c.publish(A,'atlas')
    def test_wrong_digest(self):
        self.declare();self.weave()
        with self.assertRaises(Error):self.c.approve(A,'atlas','f'*64)
    def test_outsider_approval(self):
        self.declare();self.weave();self.sender(C)
        with self.assertRaises(Error):self.c.approve(A,'atlas',self.load()['digest'])
    def test_one_approval_not_unanimity(self):
        self.declare();self.weave();self.c.approve(A,'atlas',self.load()['digest'])
        with self.assertRaises(Error):self.c.publish(A,'atlas')
    def test_repeat_approve(self):
        self.declare();self.weave();self.c.approve(A,'atlas',self.load()['digest'])
        with self.assertRaises(Error):self.c.approve(A,'atlas',self.load()['digest'])
    def test_forged_quote(self):
        self.declare();out=self.output();out['rows'][0]['cells'][0]['quote']='I built a completely unrelated object.'
        with self.assertRaises(Error):m.matrix(out,[A,B],self.load()['statements'])
    def test_member_order(self):
        self.declare();out=self.output();out['rows'].reverse()
        with self.assertRaises(Error):m.matrix(out,[A,B],self.load()['statements'])
    def test_yes_requires_quote(self):
        self.declare();out=self.output();out['rows'][0]['cells'][0]['quote']=''
        with self.assertRaises(Error):m.matrix(out,[A,B],self.load()['statements'])
    def test_validator_rejects_disagreement(self):
        self.declare();a=self.output();b=self.output(unclear=True);calls=iter([a,b]);gl.nondet.exec_prompt=lambda *x,**y:next(calls)
        def run(lead,check):
            value=lead();self.assertFalse(check(Return(value)));raise Error('DISAGREEMENT')
        gl.vm.run_nondet_unsafe=run
        with self.assertRaises(Error):self.c.weave(A,'atlas')
        self.assertEqual(self.load()['state'],'COLLECTING')
    def test_namespaces(self): self.assertEqual(self.c.get_work(B,'atlas'),'')
    def test_owner_must_be_member(self):
        with self.assertRaises(Error):self.c.open_work('other','Other','Another collective creative exhibition.',json.dumps([B,C]))
    def test_terminal_immutable(self):
        self.declare();self.weave();d=self.load()['digest'];self.c.approve(A,'atlas',d);self.sender(B);self.c.approve(A,'atlas',d);self.c.publish(A,'atlas')
        with self.assertRaises(Error):self.c.weave(A,'atlas')
        with self.assertRaises(Error):self.c.declare(A,'atlas','I now want to replace my finished declaration.')
if __name__=='__main__':unittest.main()
