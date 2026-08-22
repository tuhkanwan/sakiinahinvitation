const CACHE_NAME = 'sakiinah-v6';

const STATIC_ASSETS = [
  './style.css',
  './script.js',
  './manifest.webmanifest',
  './assets/images/favicon.png',
  './assets/images/sakiinah.png'
];


/* =========================
   INSTALL
========================= */

self.addEventListener('install', event => {

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {

        for (const asset of STATIC_ASSETS) {

          try {
            await cache.add(asset);
          } catch (error) {
            console.warn(
              'Gagal cache:',
              asset,
              error
            );
          }

        }

      })
  );

  self.skipWaiting();

});


/* =========================
   ACTIVATE
========================= */

self.addEventListener('activate', event => {

  event.waitUntil(

    caches.keys()
      .then(cacheNames => {

        return Promise.all(

          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))

        );

      })

  );

  self.clients.claim();

});


/* =========================
   FETCH
========================= */

self.addEventListener('fetch', event => {

  const request = event.request;

  let url;

  try {
    url = new URL(request.url);
  } catch {
    return;
  }


  /* Abaikan chrome-extension, data, blob, dll */

  if (
    url.protocol !== 'http:' &&
    url.protocol !== 'https:'
  ) {
    return;
  }


  /* Hanya GET */

  if (request.method !== 'GET') {
    return;
  }


  /* =========================
     HALAMAN / HTML
  ========================= */

  if (request.mode === 'navigate') {

    event.respondWith(

      fetch(request)
        .catch(() => caches.match(request))

    );

    return;
  }


  /* =========================
     FILE STATIS
  ========================= */

  event.respondWith(

    caches.match(request)
      .then(cachedResponse => {

        if (cachedResponse) {
          return cachedResponse;
        }


        return fetch(request)
          .then(networkResponse => {

            if (
              !networkResponse ||
              networkResponse.status !== 200
            ) {
              return networkResponse;
            }


            /*
             * Jangan cache resource
             * dari domain lain
             */

            if (
              url.origin !== self.location.origin
            ) {
              return networkResponse;
            }


            const responseClone =
              networkResponse.clone();


            caches.open(CACHE_NAME)
              .then(cache => {

                cache.put(
                  request,
                  responseClone
                )
                .catch(error => {

                  console.warn(
                    'Cache put gagal:',
                    request.url,
                    error
                  );

                });

              });


            return networkResponse;

          });

      })

  );

});