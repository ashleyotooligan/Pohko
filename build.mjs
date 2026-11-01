import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('./',import.meta.url),modules=['hash.mjs','journal.mjs','evaluate.mjs','packet.mjs','paint.mjs','views.mjs','app.mjs'];
let code='const __pohkoModules=Object.create(null);\n';
for(const name of modules){
 const source=await readFile(new URL(name,root),'utf8'),exports=[...source.matchAll(/\bexport\s+(?:async\s+)?(?:function|const|class)\s+(\w+)/g)].map(m=>m[1]);
 const body=source.replace(/^import \{([^}]+)\} from '([^']+)';\s*$/gm,(_,names,file)=>'const {'+names.replace(/\s+as\s+/g,':')+'}=__pohkoModules['+JSON.stringify(file.replace('./',''))+'];').replace(/\bexport (?=(?:async )?(?:function|const|class)\b)/g,'');
 code+='\n// '+name+'\n__pohkoModules['+JSON.stringify(name)+']=(()=>{\n'+body+'\nreturn {'+exports.join(',')+'};\n})();\n';
}
const art='data:image/png;base64,'+(await readFile(new URL('pohko.png',root))).toString('base64'),journal=JSON.parse(await readFile(new URL('reference-journal.json',root),'utf8')),safe=s=>s.replace(/<\/script/gi,'<\\/script');
let html=await readFile(new URL('index.html',root),'utf8');html=html.replace('<link rel="stylesheet" href="style.css">','<style>'+await readFile(new URL('style.css',root),'utf8')+'</style>').replace('href="pohko.png"','href="'+art+'"').replace('<script type="module" src="app.mjs"></script>','<script>globalThis.POHKO_EMBEDDED='+safe(JSON.stringify({art,journal}))+';\n'+safe(code)+'</script>');await writeFile(new URL('Pohko.html',root),html);console.log('Built offline journal: '+(Buffer.byteLength(html)/1048576).toFixed(2)+' MiB');
