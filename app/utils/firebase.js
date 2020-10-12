import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDQHJF9UxsnsXJNXO7y3ogrK1IQ1qC2yFk",
    authDomain: "cubiertos-923c7.firebaseapp.com",
    databaseURL: "https://cubiertos-923c7.firebaseio.com",
    projectId: "cubiertos-923c7",
    storageBucket: "cubiertos-923c7.appspot.com",
    messagingSenderId: "736919077190",
    appId: "1:736919077190:web:ea6ed4ccd19be2fbf86547"
};
// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);