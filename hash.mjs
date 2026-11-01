export function canonical(value){
  if(value===null||typeof value==='boolean'||typeof value==='string')return JSON.stringify(value);
  if(typeof value==='number'){if(!Number.isFinite(value))throw new Error('Non-finite number');return JSON.stringify(value);}
  if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
  if(value&&Object.getPrototypeOf(value)===Object.prototype)return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';
  throw new Error('Unsupported canonical value');
}
export async function sha256(value){
  if(!globalThis.crypto?.subtle)throw new Error('Web Crypto is required. Use a current browser or the localhost server.');
  const bytes=new TextEncoder().encode(typeof value==='string'?value:canonical(value));
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');
}
