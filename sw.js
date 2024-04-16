const cacheName = "v1";
const urlsToCache = [ "/","offline.html","index.html","css/index.css","css/explore.css","css/style.css","css/custombootstrap.css","https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps.css","assets/reportImage.png","js/nav.js","css/offline.css","js/explore.js","assets/offline.jpeg","js/mobile-or-tablet.js","js/formatters.js"];  // add more resources to array to be cached

self.addEventListener('install', (event) => {
  // it is invoked when the browser installs the service worker
  // here we cache the resources that are defined in the urlsToCache[] array
  // console.log(`[SW] Event fired: ${event.type}`);
  event.waitUntil(       // waitUntil tells the browser to wait for the input promise to finish
    caches.open( cacheName )		//caches is a global object representing CacheStorage
      .then( ( cache ) => { 			// open the cache with the name cacheName*
        return cache.addAll( urlsToCache );      	// pass the array of URLs to cache**. it returns a promise
  }));
  self.skipWaiting();  // it tells browser to activate this SW and discard old one immediately (useful during development)
  // console.log(`[SW] installed`);
});

self.addEventListener('activate', (event) => {
  // it is invoked after the service worker completes its installation. 
  // It's a place for the service worker to clean up from previous SW versions
  // console.log(`[SW] Event fired: ${event.type}`);
  event.waitUntil( deleteOldCache() )    // waitUntil tells the browser to wait for the input promise to finish
  self.clients.claim(); // lets the newly activated SW takes control of all related open pages
  // console.log(`[SW] activated`);
});

// iterates over cache entries for this site and delete all except the one matching cacheName
async function deleteOldCache() {
const keyList = await caches.keys();
return Promise.all( keyList.map( ( key ) => {
  if ( key !== cacheName  ) {    // compare key with the new cache Name in SW
    return caches.delete( key );  // delete any other cache
  }
}));
}

// self.addEventListener("fetch", (event) => {
//   event.respondWith(CacheFirstThenNetworkStrategy(event.request));
// });

// async function fetchWithFallbackToOffline(request) {
//     try {
//       // Check if the request method is not POST
//       if (request.method !== 'POST') {
//         const networkResponse = await fetch(request);
//         const cache = await caches.open(cacheName);
//         cache.put(request, networkResponse.clone());
//         return networkResponse;
//       } else {
//         // If it's a POST request, simply fetch from the network without caching
//         return fetch(request);
//       }
//     } catch (error) {
//       // If the network request fails, return the offline page
//       const cacheResponse = await caches.match(offlinePage);
//       return cacheResponse;
//     }
//   }

  self.addEventListener('fetch', event => {
    // Fires whenever the app requests a resource (file or data)  normally this is where the service worker would check to see
    // if the requested resource is in the local cache before going to the server to get it. 
    // console.log(`[SW] Fetch event for ${event.request.url}`);

    //Option 1. No Strategy, forwards all requests (i.e. doesn't use Cache Storage - No offline support)
    //event.respondWith(fetch(event.request));

    //Option 2. see CACHE FIRST, THEN NETWORK below
    //event.respondWith( CacheFirstThenNetworkStrategy(event) );

    //Option 3. see NETWORK FIRST, THEN CACHE below
    event.respondWith( NetworkFirstThenCacheStrategy(event) );

});


// CACHE FIRST, THEN NETWORK STRATEGY
async function CacheFirstThenNetworkStrategy(event) {
  const cachedResponse = await caches.match( event.request.url, {ignoreVary:true} ); // ignore vary header (useful for offline match)
  return cachedResponse || fetch( event.request );  // returns cachedResponse or server fetch  if no cachedResponse
}
// NETWORK FIRST, THEN CACHE STRATEGY
async function NetworkFirstThenCacheStrategy(event) {
  try {
      return await fetch( event.request );  // returns server fetch
  } catch(error) {
      return caches.match( event.request.url , {ignoreVary:true} ); // returns cached response if server fetch fails (e.g. user is offline)
  }
}

  