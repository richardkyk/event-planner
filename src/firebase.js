import * as Firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyCm5mth0nqIagyN2cCVsZF1zq_ii67LbtI",
  authDomain: "wedding-34e03.firebaseapp.com",
  databaseURL: "https://wedding-34e03.firebaseio.com",
  projectId: "wedding-34e03",
  storageBucket: "wedding-34e03.appspot.com",
  messagingSenderId: "592417061580",
  appId: "1:592417061580:web:a06a737698d20650"
};

Firebase.initializeApp(firebaseConfig);
function initFirebase() {
  return new Promise((resolve, reject) => {
    Firebase.firestore()
      .enablePersistence()
      .then(resolve)
      .catch(err => {
        if (err.code === "failed-precondition") {
          reject(err);
          // Multiple tabs open, persistence can only be
          // enabled in one tab at a a time.
        } else if (err.code === "unimplemented") {
          reject(err);
          // The current browser does not support all of
          // the features required to enable persistence
        }
      });
  });
}

export { Firebase, initFirebase };
