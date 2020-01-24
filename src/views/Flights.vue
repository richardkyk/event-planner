<template>
  <v-container class="my-10">
    <v-data-table
      :headers="headers"
      :search="search"
      :items="flights"
      :custom-filter="customFilter"
      sort-by="flightTimestamp"
      class="elevation-4"
      ref="dataTable"
    >
      <template v-slot:item.flightTimestamp="{ item }">{{ formattedDate(item.flightTimestamp) }}</template>
      <template v-slot:item.passengers="{ item }">{{ flightGuests(item.id) }}</template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
      </template>

      <!-- <template v-slot:item.type="{ item }">{{ flightType(item.arrival) }}</template> -->

      <template v-slot:item.type="{ item }">
        <v-chip :color="getColor(item.arrival)" dark>{{ flightType(item.arrival) }}</v-chip>
      </template>

      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-row no-gutters>
            <v-col cols="12" md="4" lg="3">
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="8" lg="9" :style="{ 'text-align': 'end', 'padding-top': '5px' }">
              <v-btn class="btn-fix" small text color="primary" @click="download">
                <v-icon left small>cloud_download</v-icon>
                <span class="caption">Export Data</span>
              </v-btn>
              <v-btn small text color="primary" @click="addFlight">
                <v-icon left small>add</v-icon>
                <span class="caption">Add flight</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-toolbar>
      </template>
    </v-data-table>
    <FlightPopup ref="flightPopup" />
  </v-container>
</template>

<script>
import FlightPopup from "@/components/FlightPopup";
import moment from "moment";
import XLSX from "xlsx";

export default {
  components: { FlightPopup },
  data() {
    return {
      search: "",
      headers: [
        { text: "Date", value: "flightTimestamp" },
        { text: "Time", value: "flightTime", sortable: false },
        { text: "Type", value: "type" },
        { text: "Flight Number", value: "flightNum" },
        { text: "Airport", value: "airport" },
        { text: "Passengers", value: "passengers", sortable: false },
        { text: "Actions", value: "action", sortable: false }
      ]
    };
  },
  methods: {
    customFilter(value, search, item) {
      // value is the property that is being iterated
      // search is the search term
      // item is the object
      const searchLC = search.toLowerCase();
      if (value == null || search == null) {
        return false;
      }
      const searchObject = (({
        flightTimestamp,
        flightTime: time,
        arrival,
        flightNum
      }) => ({
        date: this.formattedDate(flightTimestamp),
        time,
        type: this.flightType(arrival),
        flightNum,
        passengers: this.flightGuests(item.id)
      }))(item);
      if (search.includes("|")) {
        // This will search for either of the items
        const searchItems = searchLC.split("|").filter(el => el != "");
        return searchItems.some(val => {
          return this.filterValue(val, searchObject);
        });
      } else if (search.includes("&")) {
        // This will search for both of the items
        const searchItems = searchLC.split("&").filter(el => el != "");
        return searchItems.every(val => {
          return this.filterValue(val, searchObject);
        });
      } else {
        return this.filterValue(searchLC, searchObject);
      }
    },
    filterValue(val, searchObject) {
      // Essentially this is checking for a :
      // If it exists, then it will include the keys in the search string
      // This is to avoid typing in the property name and getting every entry returned
      // Since they all have the property
      if (val.includes(":")) {
        return Object.keys(searchObject)
          .map(
            k =>
              `${k.toString().toLowerCase()}:${searchObject[k]
                .toString()
                .toLowerCase()}`
          )
          .join(";")
          .includes(val.toLowerCase());
      } else {
        return Object.keys(searchObject)
          .map(k => `${searchObject[k].toString().toLowerCase()}`)
          .join(";")
          .includes(val.toLowerCase());
      }
    },
    getColor(arrival) {
      switch (arrival) {
        case true:
          return "blue";
        case false:
          return "green";
      }
    },
    flightType(arrival) {
      return arrival ? "Arrival" : "Departure";
    },
    editItem(item) {
      this.$refs.flightPopup.open(item);
    },
    addFlight() {
      const data = {
        flightNum: "",
        flightTime: null,
        flightDate: null,
        guests: [],
        arrival: true,
        airport: ""
      };
      this.$refs.flightPopup.open(data);
    },
    formattedDate(unix) {
      return moment.unix(unix).format("DD MMM YYYY");
    },
    download() {
      const flightWS = XLSX.utils.json_to_sheet(this.exportData);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, flightWS);

      const date = moment().format("DD-MM-YYYY HH_mm");
      const name = `Flights ${date}.xlsx`;
      XLSX.writeFile(wb, name);
    },
    flightGuests(id) {
      return this.$store.getters["flights/flightGuests"](id)
        .map(guest => guest.name)
        .join(", ");
    }
  },
  computed: {
    flights() {
      return this.$store.getters["flights/all"];
    },
    exportData() {
      const flights = this.$store.getters["flights/all"]
        ? this.$store.getters["flights/all"]
        : [];
      const data = [];
      flights.forEach(flight => {
        data.push({
          Date: this.formattedDate(flight.flightTimestamp),
          Time: flight.flightTime,
          Type: this.flightType(flight.arrival),
          "Flight Number": flight.flightNum,
          Aiport: flight.aiport,
          Passengers: this.flightGuests(flight.id)
        });
      });
      return data;
    }
  }
};
</script>
