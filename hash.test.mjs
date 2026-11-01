import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {canonical,sha256} from './hash.mjs';
test('canonical encoding sorts nested keys without changing array order',()=>{assert.equal(canonical({z:2,a:{q:3,b:[2,1]}}),'{"a":{"b":[2,1],"q":3},"z":2}');});
test('SHA-256 agrees with the Node implementation on UTF-8 bytes',async()=>{const value={reason:'überprüfen',n:6};assert.equal(await sha256(value),createHash('sha256').update(canonical(value)).digest('hex'));});
test('unsupported and non-finite canonical values are rejected',()=>{for(const value of [NaN,Infinity,undefined,new Date(),{x:undefined}])assert.throws(()=>canonical(value));});
test('the digest is key-order independent and content sensitive',async()=>{assert.equal(await sha256({a:1,b:2}),await sha256({b:2,a:1}));assert.notEqual(await sha256({a:1,b:2}),await sha256({a:2,b:2}));});
