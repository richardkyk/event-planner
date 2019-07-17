<template>
  <div class="home">
    <v-container class="my-5">
      <v-layout row class="mb-3">
        <v-btn small flat color="grey" @click="sortBy('name')">
          <v-icon left small>person</v-icon>
          <span class="caption">By name</span>
        </v-btn>
        <v-btn small flat color="grey" @click="sortBy('table')">
          <v-icon left small>local_dining</v-icon>
          <span class="caption">By table</span>
        </v-btn>
        <v-btn small flat color="grey" @click="sortBy('accom')">
          <v-icon left small>hotel</v-icon>
          <span class="caption">By accomodation</span>
        </v-btn>
        <v-btn small flat color="grey" @click="sortBy('flight')">
          <v-icon left small>airplanemode_active</v-icon>
          <span class="caption">By flight</span>
        </v-btn>
        <v-btn small flat color="grey" @click="sortBy('rsvp')">
          <v-icon left small>how_to_reg</v-icon>
          <span class="caption">By rsvp</span>
        </v-btn>
      </v-layout>

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
              @change="changeRSVP(guest.uid)"
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
      guests: []
    };
  },
  methods: {
    changeRSVP(guestUid) {
      const index = this.guests.map(guest => guest.uid).indexOf(guestUid);

      db.collection("guests")
        .doc(guestUid)
        .update({ rsvp: this.guests[index].rsvp });
    },
    sortBy(prop) {
      this.guests.sort((a, b) => (a[prop] < b[prop] ? -1 : 1));
      this.$forceUpdate();
    }
  },
  created() {
    db.collection("guests")
      .orderBy("name")
      .onSnapshot(res => {
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
  border-left: 4px solid#79d279;
}

.guest.sent {
  border-left: 4px solid orange;
}

.guest.declined {
  border-left: 4px solid tomato;
}

.guest.unsent {
  border-left: 4px solid #3cd1c2;
}
.v-input__control .v-input__slot,
.v-text-field.v-text-field--solo .v-input__control {
  min-height: 20px !important;
  padding-top: 10px !important;
  display: flex !important;
  align-items: center !important;
}

.guest.accepted .v-chip {
  background: #79d279;
  color: white;
}
.guest.sent .v-chip {
  background: orange;
  color: white;
}
.guest.declined .v-chip {
  background: tomato;
  color: white;
}
.guest.unsent .v-chip {
  background: #3cd1c2;
  color: white;
}
</style>
