/* Aumente VERSION sempre que publicar uma atualização dos arquivos. */
const VERSION='pontal-v1';
const CACHE=`${VERSION}-${self.registration.scope}`;
const CORE=['./','index.html','styles.css','products.js','data-source.js','app.js','manifest.webmanifest','assets/icon.svg','assets/icon-192.png','assets/icon-512.png','assets/icon-maskable.png','assets/store.webp',...Array.from({length:27},(_,i)=>`assets/product-${i+16}.webp`)];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('pontal-')&&k.endsWith(self.registration.scope)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  const base=new URL(self.registration.scope);
  if(url.origin!==base.origin||!url.pathname.startsWith(base.pathname))return;
  const path=url.pathname.slice(base.pathname.length);
  // Somente arquivos estáticos conhecidos: nunca armazena respostas de estoque/API.
  if(path!==''&&!CORE.includes(path))return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){const clone=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,clone)));}return response;
  }).catch(()=>caches.match(event.request,{ignoreSearch:true}).then(hit=>hit||Response.error())));
});
