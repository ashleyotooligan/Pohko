import {writeFile} from 'node:fs/promises';
import {appendEvent,verifyJournal} from './journal.mjs';
import {makePacket,makeReceipt,noteFor} from './packet.mjs';
const root=new URL('./',import.meta.url),at=h=>'2026-11-01T'+String(h).padStart(2,'0')+':00:00.000Z';
const claims=(depth=140,participants=600,share=.46)=>[
  {id:'depth',label:'Depth survives the attention cycle',metric:'quoteReserveSOL',op:'>=',threshold:depth,unit:'SOL',weight:3,critical:true,maxAgeHours:2},
  {id:'participation',label:'Participation continues to broaden',metric:'activeAccountCount',op:'>=',threshold:participants,unit:'accounts',weight:2,critical:false,maxAgeHours:2},
  {id:'concentration',label:'The supplied cohort stays distributed',metric:'topTenCohortShare',op:'<=',threshold:share,unit:'fraction',weight:2,critical:true,maxAgeHours:2}
];
const specs=[
  ['lilt','LILT','Attention needs a floor','The community is reaching more accounts while enough SOL remains in the quoted pool. I want depth and distribution to hold as attention grows.',6,claims()],
  ['mallow','MALLOW','Quiet participation','A slower community is attracting repeat participation. The position depends on maintained depth, sufficient activity and a bounded cohort share.',4,claims(120,400,.50)],
  ['vela','VELA','Verify the source disagreement','The community has broadened, but reserve observations must agree before the depth condition can be treated as supported.',3,claims()],
  ['crumb','CRUMB','A reason needs current evidence','The entry depends on three observations remaining fresh. I will revisit the thesis when the evidence window expires.',2,claims()],
  ['daze','DAZE','Distribution before expansion','The first reason focused on participation. A later revision must explain why the position remains open under a more specific condition set.',5,claims()],
  ['spindle','SPINDLE','A completed research file','This position was tracked through a declared review window and then closed by the owner. Its history stays available.',2,claims()]
];
const input=[];
for(const [id,symbol,title,reason,sizeSOL,conditions] of specs)input.push({thesisId:id,kind:'open',at:at(8),body:{symbol,title,reason,sizeSOL,claims:conditions}});
const arrays={lilt:[[184,179,165,136,124],[612,640,670,690,705],[.42,.41,.40,.39,.39],[100,106,109,115,113]],mallow:[[210,214,222,226,229],[620,633,640,648,661],[.39,.38,.38,.37,.37],[100,101,99,104,105]],vela:[[173,170,162,155,148],[625,642,660,672,691],[.43,.42,.42,.41,.41],[100,103,105,102,108]]};
for(const [id,rows] of Object.entries(arrays))for(let i=0;i<5;i++){
  const hour=8+i;
  for(const [j,claimId] of ['depth','participation','concentration'].entries())input.push({thesisId:id,kind:'evidence',at:at(hour),body:{claimId,value:rows[j][i],sourceId:'reference:'+id+':'+claimId+':A',origin:'example',observedAt:at(hour),note:'Authored reference observation '+(i+1)+'. Account and cohort counts are supplied measurements, not independent-person counts.'}});
  input.push({thesisId:id,kind:'market',at:at(hour),body:{priceIndex:rows[3][i],sourceId:'reference:'+id+':price'}});
}
for(const id of ['crumb','daze','spindle'])for(const [claimId,value] of [['depth',178],['participation',632],['concentration',.40]])input.push({thesisId:id,kind:'evidence',at:at(8),body:{claimId,value,sourceId:'reference:'+id+':'+claimId,origin:'example',observedAt:at(8),note:'Opening reference observation. No later observation is implied.'}});
input.push({thesisId:'vela',kind:'evidence',at:at(12),body:{claimId:'depth',value:132,sourceId:'reference:vela:depth:B',origin:'example',observedAt:at(12),note:'Second reference source disagrees with A on the same condition.'}});
const daze=specs.find(s=>s[0]==='daze');
input.push({thesisId:'daze',kind:'amend',at:at(11),body:{reason:'The earlier participation-led reason was too broad. I am replacing it with an explicit depth floor and fresh evidence requirements.',thesis:{symbol:'DAZE',title:'A narrower reason to stay',reason:'Maintain the position only while the quote reserve stays above the declared floor, participation is evidenced and the cohort share remains bounded. The revision needs fresh observations.',sizeSOL:5,claims:claims(160,650,.44)}}});
input.push({thesisId:'daze',kind:'evidence',at:at(12),body:{claimId:'depth',value:172,sourceId:'reference:daze:depth',origin:'example',observedAt:at(12),note:'The first post-revision reference observation supports depth. Other conditions remain unobserved.'}});
input.push({thesisId:'lilt',kind:'review',at:at(12),body:{note:'The price index is above entry while the depth floor is broken. Preserve the original reason and review the failed condition.'}});
input.push({thesisId:'spindle',kind:'close',at:at(11),body:{note:'Owner closed this research file at the end of its review window. No execution receipt is attached.'}});
input.sort((a,b)=>a.at.localeCompare(b.at));
let journal={schema:'pohko/journal/1',name:'The November folio',origin:'example',entries:[]};
for(const e of input)journal=await appendEvent(journal,e);
const packet=await makePacket(journal,'lilt',at(12)),receipt=await makeReceipt(journal,'lilt',at(12));
for(const [name,value] of [['reference-journal.json',journal],['reference-review.json',packet],['reference-receipt.json',receipt],['reference-head.json',await verifyJournal(journal)]])await writeFile(new URL(name,root),JSON.stringify(value,null,2)+'\n');
await writeFile(new URL('reference-note.md',root),noteFor(packet));
console.log('Wrote reference journal, review, receipt, head and note: '+journal.entries.length+' events / six research files.');
