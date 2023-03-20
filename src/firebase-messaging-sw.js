// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/8.7.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.7.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker

firebase.initializeApp({
    apiKey: "AIzaSyDQfpn9xagR0WfdXpyYiNsSkrGmtdDh96w",
    authDomain: "noboa-1a4f3.firebaseapp.com",
    projectId: "noboa-1a4f3",
    storageBucket: "noboa-1a4f3.appspot.com",
    messagingSenderId: "260968391860",
    appId: "1:260968391860:web:fd6705f689d9339c5523e1",
    measurementId: "G-WN66TWZ1TM"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();