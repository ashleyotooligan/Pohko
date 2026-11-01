import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('./',import.meta.url)),port=Number(process.env.PORT??4174);
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('PORT must be 1024..65535');
const types={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.md':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{try{if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;}const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname),target=path.resolve(root,'.'+(name==='/'?'/index.html':name));if(!target.startsWith(root)||name.includes('\0')){res.writeHead(403);res.end();return;}const body=await readFile(target);res.writeHead(200,{'Content-Type':types[path.extname(target)]??'application/octet-stream','Content-Length':body.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:body);}catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}}).listen(port,'127.0.0.1',()=>console.log('Pohko / http://127.0.0.1:'+port));
