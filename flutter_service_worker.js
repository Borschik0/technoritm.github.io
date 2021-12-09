'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "69542a9eebe0dbf0985afb0e06037611",
"assets/assets/icon/IconPack1.ttf": "8ef15283d917b92650d531e441979b19",
"assets/assets/icon/MyFlutterApp.ttf": "7d866d9b61acca34a9175fcb1d94b0ae",
"assets/assets/images/1845134_result-removebg-preview.png": "17e1f72be9ee0c77deec5cd298fd7118",
"assets/assets/images/198881058375926-removebg-preview.png": "bc0b2f51681fc3490670eb839d956bea",
"assets/assets/images/Ads.png": "4d578d2c40a73b609f5561631a318b4a",
"assets/assets/images/Ads1.jpg": "bb10ef0ddbfb32827c4d304759d6da63",
"assets/assets/images/Ads2.jpg": "fb12efccc870295257ae71dd6f127033",
"assets/assets/images/Ads3.jpg": "226c074e7d73257394d68d86547400cd",
"assets/assets/images/Ads4.jpg": "4a3250ea41924c5ccedb57f20bd213f0",
"assets/assets/images/Computer_Product.png": "2e2ef7541d68b69757ae0ceeb585c0a7",
"assets/assets/images/facebook.png": "61a96c78b48018b48fbb6254a93b93f8",
"assets/assets/images/hi.png": "162cdc0b39f489b32a7538e5329f0b45",
"assets/assets/images/instagram.png": "4a8c23476a7c20c5bee2a752a6f96e9e",
"assets/assets/images/iphone-13-midnight-select-2021.534x728_m_4-removebg-preview.png": "28adab0b3a954892930b3116e969c7f0",
"assets/assets/images/Logo.png": "e89af9e5200fed8816e08c88dde05f7a",
"assets/assets/images/makita_hp1640k-removebg-preview.png": "3b71dddd37fff9f3a15ea983faf7ed33",
"assets/assets/images/samsung_galaxy_tab_a7_10.4_wifi_sm-t500nzaasek_grey_1_2-removebg-preview.png": "abd35406a1e6aa727190ea0ee3da94d4",
"assets/assets/images/t1-w-03_result-removebg-preview.png": "0ab3bf8a0663faf5b269475b0f0a273b",
"assets/assets/images/telegram.png": "5261fd64187c96fdab1e6677a925966c",
"assets/assets/images/toshiba_1-removebg-preview.png": "bca9e86198922bbd6260063b0c93a7c5",
"assets/assets/images/u0394422_big_1__1-removebg-preview.png": "8bdb85228998d6aa3de7180935aa6d8e",
"assets/assets/images/viber.png": "28fc275490f78f602f84dc0f079dc990",
"assets/assets/images/youtube.png": "8f8bc2286e823d24d028e4c2b7ce754d",
"assets/FontManifest.json": "ee526ab7e6ef22643302827c42b2ffdd",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "84a40c606f6e8279a6e0f23b35adc31c",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "62b9906717d7215a6ff4cc24efbd1b5c",
"canvaskit/canvaskit.wasm": "b179ba02b7a9f61ebc108f82c5a1ecdb",
"canvaskit/profiling/canvaskit.js": "3783918f48ef691e230156c251169480",
"canvaskit/profiling/canvaskit.wasm": "6d1b0fc1ec88c3110db88caa3393c580",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "755c3d73ae95937deda3b357a229e028",
"/": "755c3d73ae95937deda3b357a229e028",
"main.dart.js": "faf5c2244fbbf1ebe8ef8fb045ae4c03",
"manifest.json": "aac717ec129e9a04dddf6a2fad411b83",
"version.json": "6fbecceb94d3479b22ebe3efa59beaf6"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
