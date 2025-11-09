importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Use the config from your firebase-config.js
// IMPORTANT: You must manually copy the values here.
const firebaseConfig = {
    apiKey: "AIza...",
    authDomain: "ikigai-app.firebaseapp.com",
    projectId: "ikigai-app",
    storageBucket: "ikigai-app.appspot.com",
    messagingSenderId: "123...",
    appId: "1:123..."
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // You should have an icon file
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
