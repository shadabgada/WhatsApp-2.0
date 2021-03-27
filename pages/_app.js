import '../styles/globals.css'
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth, db} from '../firebase';
import Login from './Login';
import Loading from './components/Loading';
import { useEffect } from 'react';
import firebase from "firebase"

//This is the main file
//It returns all 3 conditions in our case i.e.
//1. Loading
//2. Login
//3. Sidebar
function MyApp({ Component, pageProps }) {

  
  const [user, loading] = useAuthState(auth)

  useEffect(() => {
    if(user){
      db.collection('users').doc(user.uid).set({
        email: user.email,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),

        //This is profile picture from Google account
        photoURL: user.photoURL
      }, {merge: true}
      );
    } 
  }, [user]);

  if(loading) return <Loading/>
  if(!user) return <Login/>

  return <Component {...pageProps} />
}

export default MyApp
