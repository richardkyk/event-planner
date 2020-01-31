<template>
  <div class="dashboard">
    <v-container class="my-5">
      <v-layout row wrap>
        <v-flex xs12 md6 lg3>
          <DashboardLayout>
            <div slot="title">Guests</div>
            <GChart slot="chart" type="PieChart" :data="rsvp.data" :options="rsvp.options" />
            <div slot="text">
              <div>Total guests: {{rsvp.count}}</div>
              <div>Total tables: {{tables.count}}</div>
            </div>
          </DashboardLayout>
        </v-flex>
        <v-flex xs12 md6 lg3>
          <DashboardLayout>
            <div slot="title">Accommodation</div>
            <GChart slot="chart" type="PieChart" :data="accom.data" :options="accom.options" />
            <div slot="text">
              <div>Guests: {{accom.count}}</div>
              <div>Booked accommodations: {{accoms.count}}</div>
            </div>
          </DashboardLayout>
        </v-flex>
        <v-flex xs12 md6 lg3>
          <DashboardLayout>
            <div slot="title">Flights</div>
            <GChart slot="chart" type="PieChart" :data="flight.data" :options="flight.options" />
            <div slot="text" class="font-weight-light">
              <div class="font-weight-light">Passengers: {{flight.count}}</div>
              <div>Scheduled flights: {{flights.count}}</div>
              <div>- Arrivals: {{flights.arrivals}}</div>
              <div>- Departures: {{flights.departures}}</div>
            </div>
          </DashboardLayout>
        </v-flex>
        <v-flex xs12 md6 lg3>
          <DashboardLayout>
            <div slot="title">Dietary Options</div>
            <GChart slot="chart" type="PieChart" :data="dietary.data" :options="dietary.options" />
            <div slot="text">Selections: {{dietaryOptions.count}}</div>
          </DashboardLayout>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { GChart } from "vue-google-charts";
import DashboardLayout from "@/components/DashboardLayout";
export default {
  components: { GChart, DashboardLayout },
  data() {
    return {
      colors: {
        accepted: "#79d279",
        assigned: "#79d279",
        unsent: "#3cd1c2",
        declined: "#ff6347",
        unassigned: "#ffa500",
        sent: "#ffa500"
      },
      chartOptions: {
        chartArea: { width: "100%", height: "80%" },
        tooltip: { trigger: "selection" },
        legend: { position: "labeled" },
        pieHole: 0.5,
        pieSliceText: "value",
        pieSliceTextStyle: {
          color: "black",
          fontSize: 15
        }
      }
    };
  },
  computed: {
    rsvp() {
      const guests = this.guests;
      const rsvp = { unsent: 0, sent: 0, accepted: 0, declined: 0 };
      let count = 0;
      guests.forEach(guest => {
        rsvp[guest.rsvp] += 1;
        count += 1;
      });
      const { data, options } = this.createTableData(rsvp);
      return { data, options, ...rsvp, count };
    },
    accom() {
      const guests = this.guests;
      const accom = { unassigned: 0, assigned: 0 };
      let count = 0;
      guests
        .filter(guest => guest.accom)
        .forEach(guest => {
          count += 1;
          guest.accomId.length > 0
            ? (accom.assigned += 1)
            : (accom.unassigned += 1);
        });
      const { data, options } = this.createTableData(accom);
      return { data, options, ...accom, count };
    },
    flight() {
      const guests = this.guests;
      const flight = { unassigned: 0, assigned: 0 };
      let count = 0;
      guests
        .filter(guest => guest.flight)
        .forEach(guest => {
          count += 1;
          guest.flightId.length > 0
            ? (flight.assigned += 1)
            : (flight.unassigned += 1);
        });
      const { data, options } = this.createTableData(flight);
      return { data, options, ...flight, count };
    },
    dietary() {
      const guests = this.guests;
      const dietary = {};
      guests.forEach(guest => {
        guest.dietary in dietary
          ? (dietary[guest.dietary] += 1)
          : (dietary[guest.dietary] = 1);
      });
      const { data, options } = this.createTableData(dietary);
      options.colors = [
        "#79d279",
        "#3cd1c2",
        "#ff6347",
        "#ffa500",
        "#e067b4",
        "#8169dc",
        "#5182ce",
        "#cbe447"
      ];
      return { data, options, ...dietary };
    },
    guests() {
      const guests = this.$store.getters["guests/allGuests"]
        ? this.$store.getters["guests/allGuests"]
        : [];

      return guests;
    },

    tables() {
      const tables = this.$store.getters["tables/sortedTables"];
      return { count: tables.length };
    },
    flights() {
      const arrivals = this.$store.getters["flights/all"]
        ? this.$store.getters["flights/all"].filter(
            flight => flight.arrival == true
          )
        : [];
      const departures = this.$store.getters["flights/all"]
        ? this.$store.getters["flights/all"].filter(
            flight => flight.arrival == false
          )
        : [];
      return {
        count: arrivals.length + departures.length,
        arrivals: arrivals.length,
        departures: departures.length
      };
    },
    accoms() {
      const accoms = this.$store.getters["accommodations/accommodations"]
        ? this.$store.getters["accommodations/accommodations"]
        : [];
      return { count: accoms.length };
    },
    dietaryOptions() {
      const dietaryOptions = this.$store.getters["dietary/options"].options
        ? this.$store.getters["dietary/options"].options
        : [];
      return { count: dietaryOptions.length };
    }
  },
  methods: {
    createTableData(jsonData) {
      const data = [["Status", "Count"]];
      const options = { ...this.chartOptions, colors: [] };
      Object.keys(jsonData).forEach(status => {
        let titleCase = status.slice(0, 1).toUpperCase() + status.slice(1);
        data.push([titleCase, jsonData[status]]);
        options.colors.push(this.colors[status]);
      });
      return { data, options };
    }
  }
};
</script>
