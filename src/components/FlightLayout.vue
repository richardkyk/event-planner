<template>
  <div class="flight">
    <v-card outlined class="mx-3 mb-5 pa-3">
      <v-layout row align-center>
        <v-icon size="40" color="indigo" v-if="flight.arrival">flight_land</v-icon>
        <v-icon size="40" color="indigo" v-else>flight_takeoff</v-icon>

        <v-spacer></v-spacer>
        <h1 class="font-weight-medium indigo--text">{{flight.flightNum}}</h1>
        <v-flex ml-2 xs1>
          <v-btn block icon @click="editFlight(flight)">
            <v-icon color="#3f51b5 ">edit</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout row mb-3 mt-1>
        <h1 class="font-weight-thin title">{{flight.date}}</h1>
        <v-spacer></v-spacer>
        <h1 class="font-weight-thin title">{{flight.time}}</h1>
        <v-flex ml-2 xs1></v-flex>
      </v-layout>

      <v-divider></v-divider>
      <v-item-group class="mt-3">
        <v-item v-for="guest in flight.sortedGuests" :key="guest.uid">
          <v-chip color="indigo" class="white--text" small>{{guest.name}}</v-chip>
        </v-item>
      </v-item-group>
    </v-card>
    <FlightPopup ref="flightPopup" />
  </div>
</template>

<script>
import FlightPopup from "@/components/FlightPopup";

export default {
  components: { FlightPopup },
  props: ["flight"],
  data() {
    return {};
  },
  methods: {
    editFlight(flight) {
      this.$refs.flightPopup.open(flight);
    }
  }
};
</script>
