import firebase from "firebase/app";
import "firebase/firestore";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCm5mth0nqIagyN2cCVsZF1zq_ii67LbtI",
  authDomain: "wedding-34e03.firebaseapp.com",
  databaseURL: "https://wedding-34e03.firebaseio.com",
  projectId: "wedding-34e03",
  storageBucket: "wedding-34e03.appspot.com",
  messagingSenderId: "592417061580",
  appId: "1:592417061580:web:a06a737698d20650"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export default db;
