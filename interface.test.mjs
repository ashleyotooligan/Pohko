import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {verifyJournal} from './journal.mjs';

// DOM wiring and offline execution checks. This is not a browser layout engine.
async function waitUntil(check){for(let i=0;i<1000;i++){if(check())return;await new Promise(r=>setTimeout(r,2));}throw new Error('Interface state did not settle');}
async function load(){
 const nodes=new Map(),downloads=[],storage=new Map(),errors=[];
 const ctx=new Proxy({measureText:value=>({width:String(value).length*7})},{get:(o,k)=>k in o?o[k]:(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
 const element=()=>({children:[],listeners:{},dataset:{},attributes:{},value:'',disabled:false,files:[],appendChild(n){this.children.push(n);},replaceChildren(){this.children=[];},addEventListener(k,v){this.listeners[k]=v;},setAttribute(k,v){this.attributes[k]=v;},getContext:()=>ctx,showModal(){this.open=true;},close(){this.open=false;},toBlob:cb=>cb(new Blob(['png'])),click(){if(this.download)downloads.push(this.download);return this.listeners.click?.({});}});
 for(const id of ['storage-state','folio','thesis','asof','refresh','new','observe','revise','review-note','close','views','title','caption','status','png','packet','receipt','note','export','import','blank','confirm-blank','entry-dialog','entry-form','evidence-dialog','evidence-form','condition','observed-at','amend-dialog','amend-form','new-reason','note-heading','note-dialog','note-form','blank-dialog'])nodes.set(id,element());
 class Picture{constructor(){this.width=1254;this.height=1254;}set src(value){queueMicrotask(()=>this.onload());}}
 const sandbox={crypto:globalThis.crypto,TextEncoder,Blob,Image:Picture,URL:{createObjectURL:()=> 'blob:local',revokeObjectURL:()=>{}},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},document:{getElementById:id=>nodes.get(id),createElement:()=>element(),querySelectorAll:()=>[]},setTimeout:()=>{},queueMicrotask,console:{error:e=>errors.push(String(e)),log:()=>{}}};
 const context=vm.createContext(sandbox);vm.runInContext('globalThis.structuredClone=x=>JSON.parse(JSON.stringify(x))',context);
 const html=await readFile(new URL('Pohko.html',import.meta.url),'utf8');new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]).runInContext(context);
 await waitUntil(()=>context.POHKO_TEST?.state);assert.equal(errors.length,0,errors.join('\n'));return {nodes,context,downloads,storage};
}
test('offline edition boots with validated records, twelve controls and an accessible caption',async()=>{const {nodes,context}=await load();assert.equal(context.POHKO_TEST.journal.entries.length,80);assert.equal(nodes.get('views').children.length,12);assert.match(nodes.get('caption').textContent,/LILT/);assert.ok(nodes.get('folio').attributes['aria-label']);});
test('all twelve view controls render their requested compositions',async()=>{const {nodes,context}=await load();for(const b of nodes.get('views').children){await b.click();await waitUntil(()=>context.POHKO_TEST.state.view===b.dataset.view);assert.equal(b.attributes['aria-current'],'true');}});
test('owner review writes persist and preserve a valid event chain',async()=>{const {context,storage}=await load();await context.POHKO_TEST.commit('review',{note:'A real interface write from the owner'});const saved=JSON.parse(storage.get('pohko.journal.v1'));assert.equal(saved.origin,'mixed');assert.equal(saved.entries.at(-1).kind,'review');assert.equal((await verifyJournal(saved)).valid,true);});
test('five export controls create the expected artifact downloads',async()=>{const {nodes,downloads}=await load();for(const id of ['png','packet','receipt','note','export'])await nodes.get(id).click();assert.equal(downloads.length,5);assert.ok(downloads.includes('pohko-journal.json'));assert.ok(downloads.includes('pohko-review.md'));});
test('a rejected import leaves the active journal in place',async()=>{const {nodes,context}=await load();nodes.get('import').files=[{size:22,text:async()=>'{"schema":"wrong"}'}];await nodes.get('import').listeners.change();assert.equal(context.POHKO_TEST.journal.entries.length,80);assert.match(nodes.get('status').textContent,/Import rejected/);});
test('starting an empty journal clears the active copy and disables case exports',async()=>{const {nodes,context}=await load();await nodes.get('confirm-blank').click();assert.equal(context.POHKO_TEST.journal.entries.length,0);assert.equal(nodes.get('packet').disabled,true);assert.match(nodes.get('caption').textContent,/No files/);});
