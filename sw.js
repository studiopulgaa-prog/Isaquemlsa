// Service worker: abre o painel na hora (arquivos em cache) e nunca guarda dados da API
const VERSAO = 'sp-v7';
const ARQUIVOS = ['/', '/admin', '/app.js?v=7', '/app.css?v=7', '/manifest.webmanifest', '/icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/')) return;
  // Páginas: rede primeiro (sempre a versão nova), cache se estiver sem internet
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(VERSAO).then(x => x.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('/'))));
    return;
  }
  // CSS/JS/ícones: cache primeiro, atualiza por trás
  e.respondWith(caches.match(e.request).then(hit => {
    const rede = fetch(e.request).then(r => { if (r.ok) { const c = r.clone(); caches.open(VERSAO).then(x => x.put(e.request, c)); } return r; }).catch(() => hit);
    return hit || rede;
  }));
});
