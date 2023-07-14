import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore';

const  conf = {
    apiKey: "AIzaSyCiHzMe9UaEQL5mLMYMH5SPkGEd1-NpZpY",
    authDomain: "mozilla-e2c78.firebaseapp.com",
    projectId: "mozilla-e2c78",
    storageBucket: "mozilla-e2c78.appspot.com",
    messagingSenderId: "94070825060",
    appId: "1:94070825060:web:2601b09755f21bd3863f71",
    measurementId: "G-JHGYXVQSYK"

}
firebase.initializeApp(conf)
const db = firebase.firestore();

export default db