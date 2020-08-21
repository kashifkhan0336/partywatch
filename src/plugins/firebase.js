import { firebase } from "@firebase/app";
import "@firebase/firestore";

const firebaseApp = firebase.initializeApp({
	apiKey: "AIzaSyC9gj0EziVxPCdSNhoQwpf7hI0yC1Hyan0",
    authDomain: "partywatch-cloudstore.firebaseapp.com",
    databaseURL: "https://partywatch-cloudstore.firebaseio.com",
    projectId: "partywatch-cloudstore",
    storageBucket: "partywatch-cloudstore.appspot.com",
    messagingSenderId: "710244302033",
    appId: "1:710244302033:web:e693123c642a44115f59f0"
})

export const db = firebaseApp.firestore();