<template>
  <div class="tables">
    <v-container class="my-5">
      <v-layout row ml-2>
        <v-flex xs12 sm6 md4 lg3>
          <v-btn @click="addTable()" small flat color="grey">
            <v-icon left small>add</v-icon>
            <span>Add Table</span>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg3 v-for="table in tables" :key="table.id">
          <TableLayout v-bind:table="table" @updateTable="updateTable($event)" />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import TableLayout from "@/components/TableLayout";
import db from "@/fb";
import Vue from "vue";
import UUID from "vue-uuid";

Vue.use(UUID);

export default {
  components: { TableLayout },
  data() {
    return {
      guests: [],
      tables: []
    };
  },
  methods: {
    sortTables() {
      this.tables.forEach((table, index) => {
        const newGuests = [];
        table.guests.forEach(uid => {
          let data = this.guests.filter(guest => {
            return guest.uid === uid;
          });
          if (data[0]) {
            newGuests.push(data[0]);
          }
        });
        this.$set(this.tables[index], "orderedGuests", newGuests);
      });
    },
    updateTable(payload) {
      const { data, type } = payload;
      switch (type) {
        case "addGuest": {
          const { tableId, tableUid, name } = data;

          // Creating uid so I can update the table array as well as the guest db
          const guestUid = this.$uuid.v4();
          const guestData = {
            table: tableId,
            name,
            flight: false,
            accom: false,
            rsvp: "unsent"
          };

          // Creating the guest object in db
          const batch = db.batch();
          const guestRef = db.collection("guests").doc(guestUid);
          batch.set(guestRef, guestData);

          // Adding the guest uid reference to tables guest array
          const tableRef = db.collection("tables").doc(tableUid);
          const guestsUid = this.tables[tableId - 1].guests;
          batch.update(tableRef, { guests: [...guestsUid, guestUid] });

          batch.commit();
          break;
        }

        case "removeGuest": {
          const { tableId, tableUid, guestUid } = data;
          // Deleting the guest reference
          const batch = db.batch();
          const guestRef = db.collection("guests").doc(guestUid);
          batch.delete(guestRef);

          // Copying the guests array, filtering out the deleted guest, and updating the table
          const tableRef = db.collection("tables").doc(tableUid);
          const newGuests = this.tables[tableId - 1].guests.filter(
            uid => uid != guestUid
          );
          batch.update(tableRef, { guests: newGuests });

          batch.commit();
          break;
        }

        case "editGuest": {
          const { guestUid, propName, value } = data;

          db.collection("guests")
            .doc(guestUid)
            .update({ [propName]: value });
          break;
        }

        case "editTableDesc": {
          const { desc, uid } = data;
          db.collection("tables")
            .doc(uid)
            .update({ desc });
          break;
        }

        default: {
          break;
        }
      }
    },
    addTable() {
      const newId = this.tables.length + 1;
      const data = { id: newId, desc: "", guests: [] };
      db.collection("tables").add(data);
    }
  },

  created() {
    // Listener for table changes
    db.collection("tables")
      .orderBy("id")
      .onSnapshot(res => {
        const changes = res.docChanges();
        changes.forEach(change => {
          if (change.type === "added") {
            this.tables.push({ ...change.doc.data(), uid: change.doc.id });
          } else if (change.type === "modified") {
            const index = this.tables
              .map(table => table.uid)
              .indexOf(change.doc.id);
            this.$set(this.tables, index, {
              ...change.doc.data(),
              uid: change.doc.id
            });
          }
        });
        this.sortTables();
      });

    // Listener for guest changes
    db.collection("guests").onSnapshot(res => {
      const changes = res.docChanges();
      changes.forEach(change => {
        const uid = change.doc.id;
        if (change.type === "added") {
          this.guests.push({ ...change.doc.data(), uid });
        } else if (change.type === "modified") {
          const index = this.guests.map(guest => guest.uid).indexOf(uid);
          this.$set(this.guests, index, {
            ...change.doc.data(),
            uid
          });
        } else if (change.type === "removed") {
          const index = this.guests.map(guest => guest.uid).indexOf(uid);
          this.$delete(this.guests, index);
        }
      });
      this.sortTables();
    });
  }
};
</script>
