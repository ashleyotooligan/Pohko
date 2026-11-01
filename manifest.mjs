import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('./',import.meta.url));
export async function projectFiles(){return (await readdir(root,{withFileTypes:true})).filter(e=>e.isFile()&&e.name!=='MANIFEST.sha256').map(e=>e.name).sort();}
export async function manifestText(){return (await Promise.all((await projectFiles()).map(async name=>createHash('sha256').update(await readFile(root+name)).digest('hex')+'  '+name))).join('\n')+'\n';}
if(process.argv[1]===fileURLToPath(import.meta.url)){const expected=await manifestText();if(process.argv.includes('--verify')){if(await readFile(root+'MANIFEST.sha256','utf8')!==expected)throw new Error('Package manifest mismatch');console.log('All package files match the manifest.');}else{await writeFile(root+'MANIFEST.sha256',expected);console.log('Wrote package manifest.');}}
