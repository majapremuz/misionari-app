importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyBchkKcWdtxspCeRVYHknfxOyTJPmAqlvc",
  authDomain: "misionari-e382f.firebaseapp.com",
  projectId: "misionari-e382f",
  storageBucket: "misionari-e382f.appspot.com",
  messagingSenderId: "468378513588",
  appId: "1:468378513588:web:c1a9b7fda5c08c7c4a27e1",
  measurementId: "G-SF0WXN0MT9"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/icons/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});


