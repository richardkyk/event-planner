const firebase = require("firebase/app");
require("firebase/firestore");
require("firebase/auth");

var firebaseConfig = {
  apiKey: "AIzaSyCm5mth0nqIagyN2cCVsZF1zq_ii67LbtI",
  authDomain: "wedding-34e03.firebaseapp.com",
  databaseURL: "https://wedding-34e03.firebaseio.com",
  projectId: "wedding-34e03",
  storageBucket: "wedding-34e03.appspot.com",
  messagingSenderId: "592417061580",
  appId: "1:592417061580:web:a06a737698d20650"
};

firebase.initializeApp(firebaseConfig);

async function signIn() {
  await firebase
    .auth()
    .signInWithEmailAndPassword("admin@email.com", "123456")
    .then()
    .catch(err => {
      console.log("Failed to sign in");
      process.exit(1);
    });
}

async function signOut() {
  await firebase
    .auth()
    .signOut()
    .then();
}

async function changeTableNum(id, tableNum) {
  await signIn();

  const updatePromises = [];

  updatePromises.push(
    firebase
      .firestore()
      .collection("tables")
      .doc(id)
      .set(
        {
          tableNum
        },
        { merge: true }
      )
  );

  const guests = await firebase
    .firestore()
    .collection("guests")
    .get();

  guests.forEach(doc => {
    const data = { ...doc.data() };
    if (data.tableId == id) {
      updatePromises.push(
        firebase
          .firestore()
          .collection("guests")
          .doc(data.id)
          .set(
            {
              tableNum
            },
            { merge: true }
          )
      );
    }
  });

  await Promise.all(updatePromises);

  await signOut();
}

// changeTableNum("6sVhYJ4JVQ6NDvPFAkss", 16);

async function addProperty() {
  await signIn();
  const updatePromises = [];

  const guests = await firebase
    .firestore()
    .collection("guests")
    .get();

  guests.forEach(doc => {
    const data = { ...doc.data() };
    if (data.created_by == "8JdE3gSVNhXsICvdVIZb0JGEp0K3") {
      updatePromises.push(
        firebase
          .firestore()
          .collection("guests")
          .doc(data.id)
          .set(
            {
              gift: ""
            },
            { merge: true }
          )
      );
    }
  });
  await Promise.all(updatePromises);
  await signOut();
}

addProperty();
