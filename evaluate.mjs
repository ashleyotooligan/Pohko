import {timestamp,invariant} from './journal.mjs';
export function compare(value,op,threshold){return op==='>='?value>=threshold:op==='<='?value<=threshold:op==='>'?value>threshold:value<threshold;}
export function evaluate(journal,asOf){
  const cutoff=timestamp(asOf),groups=new Map();
  for(const event of journal.entries){if(timestamp(event.at)>cutoff)continue;if(!groups.has(event.thesisId))groups.set(event.thesisId,[]);groups.get(event.thesisId).push(event);}
  return [...groups.entries()].map(([id,events])=>{
    const opened=events.find(e=>e.kind==='open');invariant(opened,'Missing original entry');let current=opened,version=1;
    for(const e of events)if(e.kind==='amend'){current=e;version++;}
    const thesis=current.kind==='open'?current.body:current.body.thesis,claims=thesis.claims.map(claim=>{
      const bySource=new Map();
      for(const e of events){if(e.seq<=current.seq||e.kind!=='evidence'||e.body.claimId!==claim.id)continue;const prior=bySource.get(e.body.sourceId);if(!prior||timestamp(e.body.observedAt)>timestamp(prior.body.observedAt)||e.body.observedAt===prior.body.observedAt&&e.seq>prior.seq)bySource.set(e.body.sourceId,e);}
      const observed=[...bySource.values()],fresh=observed.filter(e=>cutoff-timestamp(e.body.observedAt)<=claim.maxAgeHours*3600000),states=fresh.map(e=>compare(e.body.value,claim.op,claim.threshold));
      const state=!observed.length?'unobserved':!fresh.length?'stale':states.every(Boolean)?'supported':states.every(v=>!v)?'broken':'contested';
      return {...claim,state,observed,fresh,ageHours:observed.length?Math.min(...observed.map(e=>(cutoff-timestamp(e.body.observedAt))/3600000)):null};
    });
    const closed=events.find(e=>e.kind==='close'),status=closed?'closed':claims.some(c=>c.critical&&c.state==='broken')?'broken':claims.every(c=>c.state==='supported')?'intact':'review';
    const totalWeight=claims.reduce((s,c)=>s+c.weight,0),supportedWeight=claims.filter(c=>c.state==='supported').reduce((s,c)=>s+c.weight,0),freshWeight=claims.filter(c=>['supported','broken','contested'].includes(c.state)).reduce((s,c)=>s+c.weight,0);
    const markets=events.filter(e=>e.kind==='market');
    return {id,original:opened.body,thesis,version,events,claims,status,asOf,totalWeight,supportedWeight,freshWeight,supportFraction:supportedWeight/totalWeight,coverage:freshWeight/totalWeight,marketIndex:markets.at(-1)?.body.priceIndex??null,markets,closed,amendedAt:current.at,lastReview:events.filter(e=>e.kind==='review').at(-1)??null};
  });
}
export function getCase(journal,id,asOf){const result=evaluate(journal,asOf).find(t=>t.id===id);invariant(result,'No thesis at this cutoff');return result;}
export function history(journal,id,asOf){return [...new Set(journal.entries.filter(e=>e.thesisId===id&&e.at<=asOf).map(e=>e.at))].map(at=>{const c=getCase(journal,id,at);return {at,supportFraction:c.supportFraction,coverage:c.coverage,marketIndex:c.marketIndex,status:c.status};});}
export function reviewQueue(cases){const priority={broken:0,review:1,intact:2,closed:3};return [...cases].sort((a,b)=>priority[a.status]-priority[b.status]||a.id.localeCompare(b.id));}
