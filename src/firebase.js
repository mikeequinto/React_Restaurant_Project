
import firebase from "firebase";
import 'firebase/storage'

const app = firebase.initializeApp({
  apiKey: "AIzaSyCWS4v2Dkqvs0OsdlQKuOnqizIKIfcP7W8",
  authDomain: "foodislife-92b0e.firebaseapp.com",
  databaseURL: "https://foodislife-92b0e.firebaseio.com",
  projectId: "foodislife-92b0e",
  storageBucket: "foodislife-92b0e.appspot.com",
  messagingSenderId: "1057738699267",
  appId: "1:1057738699267:web:54b47d27b227f3bf9b1436",
  measurementId: "G-PTH4RLS0RQ"
});

const storage = firebase.storage()

export {
   storage, app as default
}
