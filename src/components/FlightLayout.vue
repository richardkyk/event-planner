<template>
  <div class="flight">
    <v-card outlined class="mx-3 mb-5 pa-3">
      <v-layout row>
        <v-icon size="40" v-if="flight.arrival">flight_land</v-icon>
        <v-icon size="40" v-else>flight_takeoff</v-icon>

        <v-spacer></v-spacer>
        <h1 class="font-weight-medium">{{flight.flightNum}}</h1>
      </v-layout>
      <v-layout row mb-3>
        <h1 class="font-weight-thin title">{{flight.date}}</h1>
        <v-spacer></v-spacer>
        <h1 class="font-weight-thin title">{{flight.time}}</h1>
      </v-layout>
      <v-divider></v-divider>
      <v-item-group class="mt-3">
        <v-item v-for="guest in flight.guests" :key="guest.uid">
          <v-chip small>{{guest.name}}</v-chip>
        </v-item>
      </v-item-group>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["flight"],
  data() {
    return {};
  }
};
</script>
