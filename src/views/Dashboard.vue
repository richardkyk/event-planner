<template>
  <div class="home">
    <h1 class="subheading grey--text">Dashboard</h1>
    <v-container class="my-5">
      <v-card color="white" flat v-for="guest in guests" :key="guest.name">
        <v-layout row wrap :class="`pa-3 guest ${guest.rsvp}`">
          <v-flex xs12 md6>
            <div class="caption grey--text">Name</div>
            <div>{{guest.name}}</div>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <div class="caption grey--text">Accomodation</div>
            <div>{{guest.accommodation}}</div>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <div class="caption grey--text">Flight</div>
            <div>{{guest.flight}}</div>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <!-- So we can have Unsent, Sent, Accepted, Declined -->
            <div class="caption grey--text">RSVP</div>
            <div>{{guest.rsvp}}</div>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      guests: [
        {
          name: "Richard Khaw",
          accommodation: false,
          flight: false,
          rsvp: "accepted"
        },
        {
          name: "Edwin Khaw",
          accommodation: false,
          flight: false,
          rsvp: "accepted"
        },
        {
          name: "Kathleen Khaw",
          accommodation: false,
          flight: false,
          rsvp: "declined"
        },
        {
          name: "Eileen Khaw",
          accommodation: false,
          flight: false,
          rsvp: ""
        },
        {
          name: "Suan Khaw",
          accommodation: "",
          flight: "",
          rsvp: "sent"
        }
      ]
    };
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
</style>
