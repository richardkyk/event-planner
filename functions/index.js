const functions = require("firebase-functions");

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// To deploy: firebase deploy --only functions

exports.modifyGuests = functions
  .region("asia-northeast1")
  .firestore.document("guests/{userID}")
  .onWrite((change, context) => {
    // Get an object with the current document value.
    // If the document does not exist, it has been deleted.
    const oldDocument = change.before.data();
    const document = change.after.exists ? change.after.data() : null;
    if (document) {
      // If Document exists, its either been added or modified
      if (document.tableId) {
        // Update table information

        // Get guests array from tables
        modifyGuestsArray("tables", document.tableId, document, "update");
      }
      if (document.flightId.length > 0) {
        // Update flight information

        // Get guests array from flights
        for (let flightId of document.flightId) {
          modifyGuestsArray("flights", flightId, document, "update");
        }
      }
      // I think it is easier to just handle the deletion from the front end
      // Pretty much just push the guests array as you remove guests

      //    else if (document.flight == false && oldDocument.flightId.length > 0) {
      //     for (let flightId of oldDocument.flightId) {
      //       modifyGuestsArray("flights", flightId, oldDocument, "delete");
      //     }
      //   }
    }

    // We wont worry about deleting anything for now.
    //  else {
    //   // Document doesn't exist so its been deleted
    //   // If guest gets deleted, need to remove from table, flights
    // }

    // Get an object with the previous document value (for update or delete)

    // perform desired operations ...
  });

function modifyGuestsArray(colName, docId, guestObj, type) {
  const { guestId } = guestObj;
  db.collection(colName)
    .doc(docId)
    .get()
    .then(doc => {
      const guests = doc.data().guests;
      const guestIndex = guests
        .map(guest => {
          return guest.guestId;
        })
        .indexOf(guestId);

      if (type == "update") {
        if (guestIndex < 0) {
          guests.push(guestObj);
        } else {
          guests[guestIndex] = guestObj;
        }
        db.collection(colName)
          .doc(docId)
          .update({
            guests
          });
      } else if (type == "delete") {
        if (guestIndex < 0) {
        } else {
          guests.splice(guestIndex, 1);
        }
        db.collection(colName)
          .doc(docId)
          .update({
            guests
          });
      }
    })
    .catch(err => console.log(err));
}
