import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyB3F8nLAr9Nw35PqLC6eDsKpCqBjois-2s",
  authDomain: "whatsapp-2-a6a21.firebaseapp.com",
  projectId: "whatsapp-2-a6a21",
  storageBucket: "whatsapp-2-a6a21.appspot.com",
  messagingSenderId: "182896482899",
  appId: "1:182896482899:web:03ef0ba2696dfaecd884a6"
};

const app = !firebase.apps.length 
? firebase.initializeApp(firebaseConfig)
: firebase.app()

//database
const db = app.firestore();

//auth
const auth = app.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export {db, auth, provider};