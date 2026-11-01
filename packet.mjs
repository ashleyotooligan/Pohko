import {getCase} from './evaluate.mjs';
import {verifyJournal} from './journal.mjs';
import {sha256} from './hash.mjs';
export async function makePacket(journal,id,asOf){
  const integrity=await verifyJournal(journal),c=getCase(journal,id,asOf);
  const packet={schema:'pohko/review/1',version:'0.1.0',origin:journal.origin,asOf,thesisId:id,original:c.original,current:c.thesis,versionNumber:c.version,status:c.status,conditions:c.claims.map(({id,label,metric,op,threshold,unit,weight,critical,state,ageHours,fresh,observed})=>({id,label,metric,op,threshold,unit,weight,critical,state,ageHours,sourceEventIds:observed.map(e=>e.id),freshEventIds:fresh.map(e=>e.id)})),sourceEvents:c.events,journalHead:integrity.head,caseHead:c.events.at(-1)?.digest??null,operator:{product:'Grok Bot',instructions:'GROKBOT-OPERATOR.md',transport:'user-managed file handoff',state:'prepared'},execution:{wallet:'not connected',marketFeed:'not connected',orders:'none'}};
  return packet;
}
export async function makeReceipt(journal,id,asOf){const packet=await makePacket(journal,id,asOf);return {schema:'pohko/receipt/1',encoding:'sorted-key JSON / UTF-8 / no trailing newline',algorithm:'SHA-256',digest:await sha256(packet),attestation:'Local consistency record; unsigned; not a chain anchor',packet};}
export function noteFor(packet){
  return '# Pohko review / '+packet.current.symbol+'\n\nOrigin: '+packet.origin+'. Review cutoff: '+packet.asOf+'.\n\n## Original reason\n\n'+packet.original.reason+'\n\n## Current state\n\n'+packet.status+' / thesis version '+packet.versionNumber+'.\n\n'+packet.conditions.map(c=>'- '+c.label+': '+c.state+'; condition '+c.op+' '+c.threshold+' '+c.unit+'; sources '+(c.sourceEventIds.join(', ')||'none')+'.').join('\n')+'\n\nThis note is generated from local rules. Interpretation by a configured Grok Bot is a separate file handoff.\n';
}
