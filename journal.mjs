import {sha256,canonical} from './hash.mjs';
export const GENESIS='0'.repeat(64);
export const KINDS=['open','evidence','amend','review','close','market'];
export function invariant(condition,message){if(!condition)throw new Error(message);}
export function timestamp(value){invariant(typeof value==='string'&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value)&&new Date(value).toISOString()===value,'Expected an ISO UTC timestamp with milliseconds');return Date.parse(value);}
function text(value,label,max=2000){invariant(typeof value==='string'&&value.trim().length>0&&value.length<=max,'Invalid '+label);}
export function validateThesis(t){
  invariant(t&&typeof t==='object','Thesis required');text(t.symbol,'symbol',24);text(t.title,'title',160);text(t.reason,'entry reason');
  invariant(Number.isFinite(t.sizeSOL)&&t.sizeSOL>0&&t.sizeSOL<=1000000,'Invalid SOL allocation');
  invariant(Array.isArray(t.claims)&&t.claims.length>0&&t.claims.length<=3,'Use 1..3 conditions');const ids=new Set();
  for(const c of t.claims){text(c.id,'condition ID',80);invariant(!ids.has(c.id),'Duplicate condition');ids.add(c.id);text(c.label,'condition label',160);text(c.metric,'metric',80);text(c.unit,'unit',40);invariant(['>=','<=','>','<'].includes(c.op),'Unsupported comparator');invariant(Number.isFinite(c.threshold),'Invalid threshold');invariant(Number.isFinite(c.maxAgeHours)&&c.maxAgeHours>0&&c.maxAgeHours<=8760,'Invalid age budget');invariant(Number.isFinite(c.weight)&&c.weight>0&&c.weight<=100,'Invalid condition weight');invariant(typeof c.critical==='boolean','Critical flag required');}
}
export function validatePayload(event,known){
  text(event.thesisId,'thesis ID',80);invariant(KINDS.includes(event.kind),'Unknown event kind');timestamp(event.at);const b=event.body;invariant(b&&Object.getPrototypeOf(b)===Object.prototype,'Event body required');
  const prior=known.get(event.thesisId);
  if(event.kind==='open'){invariant(!prior,'Thesis already exists');validateThesis(b);known.set(event.thesisId,{thesis:b,closed:false});return;}
  invariant(prior,'Unknown thesis');invariant(!prior.closed,'Thesis is closed');
  if(event.kind==='amend'){text(b.reason,'amendment explanation');validateThesis(b.thesis);invariant(b.thesis.symbol===prior.thesis.symbol,'Amendments cannot change asset identity');prior.thesis=b.thesis;}
  if(event.kind==='evidence'){const claim=prior.thesis.claims.find(c=>c.id===b.claimId);invariant(claim,'Unknown condition');invariant(Number.isFinite(b.value),'Evidence needs a finite value');text(b.sourceId,'source ID',160);text(b.note,'evidence note');invariant(['example','user','external'].includes(b.origin),'Evidence origin required');invariant(timestamp(b.observedAt)<=timestamp(event.at),'Observation cannot be from the future');}
  if(event.kind==='market'){invariant(Number.isFinite(b.priceIndex)&&b.priceIndex>0,'Invalid price index');text(b.sourceId,'price source',160);}
  if(event.kind==='review'||event.kind==='close')text(b.note,'review note');
  if(event.kind==='close')prior.closed=true;
}
export function emptyJournal(){return {schema:'pohko/journal/1',name:'My Pohko journal',origin:'user',entries:[]};}
export async function verifyJournal(journal,expectedHead){
  invariant(journal?.schema==='pohko/journal/1','Unsupported journal');text(journal.name,'journal name',160);invariant(['example','user','mixed'].includes(journal.origin),'Journal origin required');
  invariant(Array.isArray(journal.entries)&&journal.entries.length<=10000,'Journal supports at most 10000 entries');
  let prev=GENESIS,last=-Infinity;const known=new Map();
  for(const [index,event] of journal.entries.entries()){
    invariant(event.seq===index+1&&event.id==='e'+String(index+1).padStart(5,'0'),'Event sequence mismatch');invariant(event.prev===prev,'Broken previous digest');
    const {digest,...payload}=event;invariant(/^[a-f0-9]{64}$/.test(digest??''),'Invalid digest');invariant(await sha256(payload)===digest,'Event digest mismatch at '+event.id);
    const at=timestamp(event.at);invariant(at>=last,'Journal time moved backwards');validatePayload(event,known);last=at;prev=digest;
  }
  if(expectedHead!==undefined)invariant(expectedHead===prev,'Pinned head mismatch');return {valid:true,count:journal.entries.length,head:prev};
}
export async function appendEvent(journal,event){
  await verifyJournal(journal);invariant(event&&Object.keys(event).sort().join(',')==='at,body,kind,thesisId','Event requires only at, body, kind and thesisId');
  const entries=journal.entries.map(e=>structuredClone(e)),seq=entries.length+1;
  const payload={seq,id:'e'+String(seq).padStart(5,'0'),kind:event.kind,thesisId:event.thesisId,at:event.at,body:structuredClone(event.body),prev:entries.at(-1)?.digest??GENESIS};
  entries.push({...payload,digest:await sha256(payload)});const next={...journal,entries};await verifyJournal(next);return next;
}
export function journalBytes(journal){return canonical(journal)+'\n';}
