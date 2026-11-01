import {readFile,readdir,stat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {projectFiles} from './manifest.mjs';
import {VIEWS} from './views.mjs';
import {verifyJournal} from './journal.mjs';
import {makeReceipt} from './packet.mjs';
const root=new URL('./',import.meta.url),files=await projectFiles(),names=new Set(files);let links=0;
for(const item of await readdir(root,{withFileTypes:true}))assert.ok(!item.isDirectory()||['.git','node_modules'].includes(item.name),'Distribution must be one flat folder');
for(const file of files.filter(n=>n.endsWith('.md'))){const source=await readFile(new URL(file,root),'utf8');for(const m of source.matchAll(/!?\[[^\]]*\]\(([^)\s]+)\)/g)){const target=m[1].split('#')[0];if(!target||/^[a-z]+:/i.test(target))continue;assert.ok(names.has(target),file+' links to missing '+target);links++;}for(const m of source.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)){assert.ok(names.has(m[1]));links++;}}
for(const [i,v] of VIEWS.entries()){const png=await readFile(new URL(String(i+1).padStart(2,'0')+'-'+v.id+'.png',root));assert.equal(png.subarray(1,4).toString(),'PNG');assert.equal(png.readUInt32BE(16),1600);assert.equal(png.readUInt32BE(20),1100);}
const cover=await readFile(new URL('pohko-cover.png',root));assert.equal(cover.readUInt32BE(16),1600);assert.equal(cover.readUInt32BE(20),800);
for(const name of files.filter(n=>n.endsWith('.mjs'))){const source=await readFile(new URL(name,root),'utf8');execFileSync(process.execPath,['--check',new URL(name,root).pathname]);for(const m of source.matchAll(/from '\.\/([^']+)'/g))assert.ok(names.has(m[1]),'Missing module '+m[1]);}
for(const name of files.filter(n=>n.endsWith('.json')))JSON.parse(await readFile(new URL(name,root),'utf8'));
const journal=JSON.parse(await readFile(new URL('reference-journal.json',root),'utf8'));await verifyJournal(journal);assert.deepEqual(JSON.parse(await readFile(new URL('reference-receipt.json',root),'utf8')),await makeReceipt(journal,'lilt',journal.entries.at(-1).at));
const html=await readFile(new URL('Pohko.html',root),'utf8');assert.ok(!/<script[^>]+src=/.test(html));assert.ok(!/<link[^>]+href="(?!data:)/.test(html));new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
const maximum=Math.max(...await Promise.all(files.map(async name=>(await stat(new URL(name,root))).size)));assert.ok(maximum<25*1048576);assert.ok(files.length+1<=100);
console.log('Checked '+(files.length+1)+' package files, '+links+' local links, twelve figures, source imports, syntax, reference receipt and offline embedding.');
