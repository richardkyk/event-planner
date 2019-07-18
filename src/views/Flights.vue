<template>
  <div class="flights">
    <v-container class="my-5">
      <v-layout row ml-2>
        <v-flex xs12 sm6 md4 lg3>
          <v-btn @click="addFlight()" :loading="loading" small flat color="grey">
            <v-icon left small>add</v-icon>
            <span>Add Flight</span>
          </v-btn>
        </v-flex>
      </v-layout>

      <!-- Arrival cards -->
      <!-- <h1 class="display-2 grey--text font-weight-light">Arrivals</h1> -->
      <v-layout row>
        <v-flex xs12 sm6 md4 lg3 v-for="flight in sortedArrivals" :key="flight.uid">
          <FlightLayout v-bind:flight="flight" />
        </v-flex>
      </v-layout>

      <!-- Departure cards -->
      <!-- <h1 class="display-2 grey--text font-weight-light">Departures</h1> -->
      <v-layout row>
        <v-flex xs12 sm6 md4 lg3 v-for="flight in sortedDepartures" :key="flight.uid">
          <FlightLayout v-bind:flight="flight" />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import FlightLayout from "@/components/FlightLayout";
import db from "@/fb";
import Vue from "vue";
import UUID from "vue-uuid";

Vue.use(UUID);

export default {
  components: { FlightLayout },
  data() {
    return {
      loading: false,
      guests: [
        {
          accom: false,
          flight: true,
          name: "Richard Ljaw",
          uid: "edb7a273-dafb-4f47-8ce3-a91e296eb65c",
          rsvp: "accepted",
          table: "2"
        },
        {
          accom: false,
          flight: true,
          name: "Testi",
          uid: "39636cc1-978f-43b7-9a20-4c01057e8c4a",
          rsvp: "sent",
          table: "3"
        },
        {
          accom: false,
          flight: true,
          name: "Testi",
          uid: "1",
          rsvp: "sent",
          table: "3"
        },
        {
          accom: false,
          flight: true,
          name: "Testi",
          uid: "22",
          rsvp: "sent",
          table: "3"
        },
        {
          accom: false,
          flight: true,
          name: "Testi",
          uid: "3",
          rsvp: "sent",
          table: "3"
        }
      ],
      flights: [
        {
          uid: "03f7a2b5-f39b-4943-a927-0e4a821d8082",
          flightNum: "D7 218",
          time: "7:30 PM",
          date: "18/07/2019",
          arrival: true,
          guests: [
            "edb7a273-dafb-4f47-8ce3-a91e296eb65c",
            "39636cc1-978f-43b7-9a20-4c01057e8c4a",
            "1",
            "2",
            "3"
          ]
        },
        {
          uid: "0457db8b-1d68-4ffd-b1e9-1d32b31cdfb0",
          flightNum: "D7 312",
          time: "9:30 AM",
          date: "25/07/2019",
          arrival: false,
          guests: ["edb7a273-dafb-4f47-8ce3-a91e296eb65c"]
        }
      ]
    };
  },
  methods: {
    addFlight() {
      console.log("adding flight");
      this.sortFlights();
    }
  },
  computed: {
    sortedArrivals() {
      const sortedFlights = {};
      this.guests.map(guest => {
        sortedFlights[guest.uid] = guest;
      });
      const sortedArrivals = this.flights
        .filter(flight => flight.arrival)
        .map(flight => {
          const sortedGuests = flight.guests.map(uid => {
            return { ...sortedFlights[uid] };
          });
          flight.guests = sortedGuests;
          return { ...flight };
        });
      return sortedArrivals;
    },
    sortedDepartures() {
      const sortedFlights = {};
      this.guests.map(guest => {
        sortedFlights[guest.uid] = guest;
      });
      const sortedDepartures = this.flights
        .filter(flight => !flight.arrival)
        .map(flight => {
          const sortedGuests = flight.guests.map(uid => {
            return { ...sortedFlights[uid] };
          });
          flight.guests = sortedGuests;
          return { ...flight };
        });
      return sortedDepartures;
    }
  }
};
</script>
