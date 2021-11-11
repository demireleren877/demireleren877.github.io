'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "9543f24b9f6e27f33c6c59eef989ec30",
"assets/assets/icons/Bell.svg": "9bc59ab4b881ce8834756d6efb9727e4",
"assets/assets/icons/BlogPost.svg": "1591f545f50891d42ea10d582104ed1e",
"assets/assets/icons/Comments.svg": "fe5526f5e201592904e18e0222463199",
"assets/assets/icons/Dashboard.svg": "9fe5ff508d43a7ab5e9e04cb95460e82",
"assets/assets/icons/Dribbble.svg": "ada20573b623c94cc622b680ba937148",
"assets/assets/icons/Facebook.svg": "e299329132035bb7434be11c853249e2",
"assets/assets/icons/Linkedin.svg": "4f2cc8c28af3049b543d44ac3d47628e",
"assets/assets/icons/Logout.svg": "72e70359d58453211e79bb6997fe8b16",
"assets/assets/icons/Message.svg": "37140f65978e0b67dc31bd815c72af9f",
"assets/assets/icons/Pages.svg": "b6036bea7a2a60a8cd0807d1edc0abd0",
"assets/assets/icons/Post.svg": "e6d121c4a6ec5cd00e9c56e647f5fe9b",
"assets/assets/icons/Setting.svg": "93dc419a0a2ee4ff7be14c7fabe39c0d",
"assets/assets/icons/Statistics.svg": "0853d0fbb5dce77eee9d45129b8c11c4",
"assets/assets/icons/Subscribers.svg": "b41a302e79395e32514c221029b7f035",
"assets/assets/icons/Twitter.svg": "0776622b3e786189d271a58d6eaed86e",
"assets/assets/images/login.png": "ec4f02e35a33d418552b8d3ad7c944a3",
"assets/assets/images/logo.png": "df0ec1f100c140c1a02e0d17a13d8ae7",
"assets/assets/images/logowithtext.png": "954fb979bd2b0dfd1476b0758fd014cb",
"assets/assets/images/photo1.jpg": "8919c83cfb6ca5a6106c2841ae065056",
"assets/assets/images/photo2.jpg": "8b69cc14acbdd21b279403cbcfa37ac2",
"assets/assets/images/photo3.jpg": "e15fc31e4ed05eb4370c40f1e765131e",
"assets/assets/images/photo4.jpg": "28b8b952e3faf30125d56b8c5f47c532",
"assets/assets/images/photo5.jpg": "4415164461b5175e14d55b6f40470faa",
"assets/assets/images/photo6.jpg": "fcc4a2d57e985be46673cc5107ed39ef",
"assets/FontManifest.json": "5a32d4310a6f5d9a6b651e75ba0d7372",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "3df8d4f6ff829b2bbf9e6b7c09182b53",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/fluttertoast/assets/toastify.css": "a85675050054f179444bc5ad70ffc635",
"assets/packages/fluttertoast/assets/toastify.js": "e7006a0a033d834ef9414d48db3be6fc",
"assets/packages/flutter_login/assets/images/ecorp.png": "24e80e9441acf073076893cebbe60ac0",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "b37ae0f14cbc958316fac4635383b6e8",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "5178af1d278432bec8fc830d50996d6f",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "aa1ec80f1b30a51d64c72f669c1326a7",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "d738a7e1e3c768b93873208d6e1594f3",
"/": "d738a7e1e3c768b93873208d6e1594f3",
"main.dart.js": "e632ea3af8e7f4e62346c80daf47ee61",
"manifest.json": "16c0e273b297e9ed2f2c6259b45da1c1",
"version.json": "927cbb1e11f03fb903cb3c0c0aa853e2"
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
