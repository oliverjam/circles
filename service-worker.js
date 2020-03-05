const CACHE_NAME = "circles-cache-v1";
const urlsToCache = ["/"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", event => {
  console.log("Finally active. Ready to serve!");
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        )
      )
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log("Serving response from the cache");
        return response;
      }
      return fetch(event.request)
        .then(response => caches.open(CACHE_NAME))
        .then(cache => {
          cache.put(event.request, response.clone());
          return response;
        })
        .catch(response => {
          console.log("Fetch failed, sorry.");
        });
    })
  );
});
