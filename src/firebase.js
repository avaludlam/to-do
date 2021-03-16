import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyCV6HiCWXHUJ-VK-P78r_l-5D981zWq-0A",
  authDomain: "helloworld-d9d07.firebaseapp.com",
  databaseURL: "https://helloworld-d9d07-default-rtdb.firebaseio.com",
  projectId: "helloworld-d9d07",
  storageBucket: "helloworld-d9d07.appspot.com",
  messagingSenderId: "388203091030",
  appId: "1:388203091030:web:10c50dff9c685f786897f7"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();
