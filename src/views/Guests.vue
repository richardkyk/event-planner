<template>
  <div class="home">
    <h1 class="subheading grey--text">Guests</h1>
    <v-container class="my-5">
      <v-card color="white" flat v-for="(guest, index) in guests" :key="guest.name">
        <v-layout row wrap :class="`pa-3 guest ${guest.rsvp}`">
          <v-flex xs12 md5>
            <div class="caption grey--text">Name</div>
            <div>{{guest.name}}</div>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <div class="caption grey--text">Table</div>
            <div>{{guest.table}}</div>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <div class="caption grey--text">Accomodation</div>
            <div>{{guest.accom}}</div>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <div class="caption grey--text">Flight</div>
            <div>{{guest.flight}}</div>
          </v-flex>
          <v-flex xs6 sm4 md1>
            <!-- So we can have Unsent, Sent, Accepted, Declined -->
            <v-select
              v-model="guests[index].rsvp"
              dense
              solo
              small-chips
              flat
              :items="items"
              height="20"
              item-value="rsvp"
              @input="changeRSVP(guest.uid)"
            ></v-select>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import db from "@/fb";

export default {
  data() {
    return {
      items: ["unsent", "sent", "accepted", "declined"],
      guests: [
        // {
        //   name: "Richard Khaw",
        //   accommodation: false,
        //   flight: false,
        //   rsvp: "accepted"
        // }
      ]
    };
  },
  methods: {
    changeRSVP(guestUid) {
      console.log(guestUid);
    }
  },
  created() {
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
    });
  }
};
</script>

<style>
.guest.accepted {
  border-left: 4px solid lightgreen;
}

.guest.sent {
  border-left: 4px solid orange;
}

.guest.declined {
  border-left: 4px solid tomato;
}
.v-input__control .v-input__slot,
.v-text-field.v-text-field--solo .v-input__control {
  min-height: 20px !important;
  padding-top: 10px !important;
  display: flex !important;
  align-items: center !important;
}

.guest.accepted .v-chip {
  background: lightgreen;
}
.guest.sent .v-chip {
  background: orange;
}
.guest.declined .v-chip {
  background: tomato;
}
</style>
