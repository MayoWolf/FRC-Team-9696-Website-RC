import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import './build.mjs';
const root = resolve('dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.xml':'application/xml','.txt':'text/plain'};
http.createServer(async (req,res) => {
  let path;
  try { path = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  const target = resolve(root, '.' + path + (path.endsWith('/') ? 'index.html' : ''));
  if (target !== root && !target.startsWith(root + sep)) { res.writeHead(403).end(); return; }
  try { res.writeHead(200,{'Content-Type':types[extname(target)] || 'application/octet-stream'}); res.end(await readFile(target)); }
  catch { res.writeHead(404,{'Content-Type':'text/html'}); res.end(await readFile(resolve(root,'404.html'))); }
}).listen(9696,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:9696'));
