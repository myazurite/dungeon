// Define a cache name for your assets
const cacheName = 'my-web-app-cache-v1';

// List the assets you want to cache
const assetsToCache = [
    '/',
    '/index.html',
    '/assets/css/style.css',
    '/assets/js/main.js',
    '/assets/icon/favicon.png',
    // Add more paths to the assets you want to cache
];

self.addEventListener('install', (event) => {
    // Perform installation steps
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(assetsToCache);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Cache hit - return the response from the cache
            if (response) {
                return response;
            }

            // Clone the request. A request is a stream and can only be consumed once.
            const fetchRequest = event.request.clone();

            return fetch(fetchRequest).then((response) => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone the response. A response is a stream and can only be consumed once.
                const responseToCache = response.clone();

                caches.open(cacheName).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            });
        })
    );
});
