// MyBethelFamilyHome service worker: lets the app install to the Home Screen and show alerts.
try {
  importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js', 'https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');
  firebase.initializeApp({
    apiKey: "AIzaSyCeztnV2Kw2aImhrINlN1NbkinCdJpUS94",
    authDomain: "mybethelfamilyhome-1e19a.firebaseapp.com",
    databaseURL: "https://mybethelfamilyhome-1e19a-default-rtdb.firebaseio.com",
    projectId: "mybethelfamilyhome-1e19a",
    storageBucket: "mybethelfamilyhome-1e19a.firebasestorage.app",
    messagingSenderId: "287969705339",
    appId: "1:287969705339:web:5e7ad9ee016908892951de"
  });
  var messaging = firebase.messaging();
  messaging.onBackgroundMessage(function (p) {
    var d = p.data || {};
    return self.registration.showNotification(d.title || 'MyBethelFamilyHome', { body: d.body || '', tag: d.tag || undefined, icon: 'icon-192.png', badge: 'icon-192.png', renotify: true, vibrate: [200, 100, 200, 100, 300], data: { url: d.url || './index.html' } });
  });
} catch (e) {}
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) { if ('focus' in list[i]) return list[i].focus(); }
    return self.clients.openWindow((e.notification.data && e.notification.data.url) || './index.html');
  }));
});
