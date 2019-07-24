<template>
  <div class="flights">
    <v-container class="my-5">
      <v-layout row ml-2>
        <v-flex xs12 sm6 md4 lg3>
          <v-btn @click="addFlight()" small flat color="grey">
            <v-icon left small>add</v-icon>
            <span>Add Flight</span>
            <FlightPopup ref="flightPopup" />
          </v-btn>
        </v-flex>
      </v-layout>

      <!-- Arrival cards -->
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg3 v-for="flight in arrivals" :key="flight.uid">
          <FlightLayout v-bind:flight="flight" />
        </v-flex>
      </v-layout>

      <!-- Departure cards -->
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg3 v-for="flight in departures" :key="flight.uid">
          <FlightLayout v-bind:flight="flight" />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import FlightLayout from "@/components/FlightLayout";
import FlightPopup from "@/components/FlightPopup";

export default {
  components: { FlightLayout, FlightPopup },
  data() {
    return {};
  },
  methods: {
    addFlight() {
      const data = {
        flightNum: "",
        flightTime: null,
        flightDate: null,
        guests: [],
        arrival: true
      };
      this.$refs.flightPopup.open(data);
    }
  },
  computed: {
    ...mapGetters({
      arrivals: "flights/arrivals",
      departures: "flights/departures"
    })
  }
};
</script>
