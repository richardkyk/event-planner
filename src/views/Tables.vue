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
      tables: [
        //     {
        //       id: 1,
        //       desc: "Khaw familiy",
        //       guests: [
        //         { name: "Guest 1", flight: false, accom: false },
        //         { name: "Guest 2", flight: true, accom: true },
        //         { name: "Guest 3", flight: false, accom: true },
        //         { name: "Guest 4", flight: true, accom: false }
        //       ]
        //     }
      ]
    };
  },
  methods: {
    sortTables() {
      this.tables.forEach((table, index) => {
        let newGuests = [];
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
      let { data, type } = payload;
      switch (type) {
        case "addGuest": {
          let { id, name, uid } = data;
          let guestUid = this.$uuid.v4();
          let guestData = {
            name,
            flight: false,
            accom: false,
            rsvp: ""
          };

          let batch = db.batch();
          let guestRef = db.collection("guests").doc(guestUid);
          batch.set(guestRef, { ...guestData, table: id });

          let tableRef = db.collection("tables").doc(uid);
          let guestsUid = this.tables[id - 1].guests;
          batch.update(tableRef, { guests: [...guestsUid, guestUid] });

          batch.commit();
          break;
        }

        case "removeGuest": {
          let { id, index } = data;
          this.$delete(this.tables[id - 1].guests, index);
          break;
        }

        case "editGuest": {
          let { id, index, name } = data;
          this.tables[id - 1].guests[index].name = name;
          break;
        }

        case "editTable": {
          let { desc, uid } = data;
          db.collection("tables")
            .doc(uid)
            .update({ desc });
          break;
        }

        case "flight": {
          let { id, index } = data;
          this.tables[id - 1].guests[index].flight = !this.tables[id - 1]
            .guests[index].flight;
          break;
        }
        case "accom": {
          let { id, index } = data;
          this.tables[id - 1].guests[index].accom = !this.tables[id - 1].guests[
            index
          ].accom;
          break;
        }

        default: {
          break;
        }
      }
    },
    addTable() {
      let newId = this.tables.length + 1;
      let data = { id: newId, desc: "", guests: [] };
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
            this.$set(this.tables, change.oldIndex, {
              ...change.doc.data(),
              uid: change.doc.id
            });
          }
          this.sortTables();
        });
      });

    // Listener for guest changes
    db.collection("guests").onSnapshot(res => {
      const changes = res.docChanges();
      changes.forEach(change => {
        if (change.type === "added") {
          this.guests.push({ ...change.doc.data(), uid: change.doc.id });
        } else if (change.type === "modified") {
          null;
        }
      });
      this.sortTables();
    });
  }
};
</script>
