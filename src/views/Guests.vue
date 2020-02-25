<template>
  <v-container class="my-10" fluid>
    <v-data-table
      :headers="headers"
      :search="search"
      :items="sortedGuests"
      :custom-filter="customFilter"
      sort-by="name"
      class="elevation-4"
      ref="dataTable"
    >
      <template v-slot:item.accom="{ item }">{{ accomStatus(item) }}</template>
      <template v-slot:item.flight="{ item }">
        {{
        flightStatus(item)
        }}
      </template>
      <template v-slot:item.desc="{ item }">
        {{
        tableDesc(item.tableId)
        }}
      </template>
      <template v-slot:item.rsvp="{ item }">
        <v-chip @click="rsvp(item)" :color="getColor(item.rsvp)" dark>
          {{
          toTitleCase(item.rsvp)
          }}
        </v-chip>
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
            </v-col>
          </v-row>
        </v-toolbar>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import XLSX from "xlsx";
import moment from "moment";

export default {
  data() {
    return {
      rsvpValues: ["unsent", "sent", "accepted", "declined"],
      search: "",
      headers: [
        { text: "Name", value: "name" },
        { text: "Table", value: "tableNum" },
        { text: "Description", value: "desc", sortable: false },
        { text: "Dietary", value: "dietary" },
        { text: "Flight", value: "flight" },
        { text: "Accommodation", value: "accom" },
        { text: "RSVP", value: "rsvp" }
      ]
    };
  },
  computed: {
    sortedGuests() {
      return this.$store.getters["guests/sortedGuests"](this.prop);
    },
    exportData() {
      const guests = this.$store.getters["guests/allGuests"]
        ? this.$store.getters["guests/allGuests"]
        : [];

      const data = [];
      guests.forEach(guest => {
        data.push({
          Name: guest.name,
          "Table Number": guest.tableNum,
          Description: this.tableDesc(guest.tableId),
          "Dietary Selection": guest.dietary,
          "Accommodation Status": guest.accom ? this.accomStatus(guest) : "",
          "Flight Status": guest.flight ? this.flightStatus(guest) : "",
          RSVP: this.toTitleCase(guest.rsvp)
        });
      });
      return data;
    }
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
      const searchObject = (({ name, tableNum, dietary, rsvp, tableId }) => ({
        name,
        table: tableNum,
        desc: this.tableDesc(tableId),
        dietary,
        flight: this.flightStatus(item),
        accom: this.accomStatus(item),
        rsvp
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
    getColor(rsvp) {
      switch (rsvp) {
        case "unsent":
          return "orange";
        case "sent":
          return "blue";
        case "accepted":
          return "green";
        case "declined":
          return "red";
      }
    },
    toTitleCase(val) {
      return val.charAt(0).toUpperCase() + val.slice(1);
    },
    flightStatus(guest) {
      return guest.flight
        ? guest.flightId.length > 0
          ? "Assigned"
          : "Unassigned"
        : "";
    },
    accomStatus(guest) {
      return guest.accom
        ? guest.accomId.length > 0
          ? "Assigned"
          : "Unassigned"
        : "";
    },
    rsvp(guest) {
      const oldRsvpIndex = this.rsvpValues.indexOf(guest.rsvp);
      const newRsvpIndex = (oldRsvpIndex + 1) % this.rsvpValues.length;
      const newRsvp = this.rsvpValues[newRsvpIndex];
      const payload = { id: guest.id, rsvp: newRsvp };
      this.$store.dispatch("guests/patch", payload);
    },
    tableDesc(tableId) {
      const tables = this.$store.getters["tables/sortedTables"];
      // console.log(
      //   tables.filter(table => table.id == tableId).map(table => table.desc)[0]
      // );

      return (
        tables
          .filter(table => table.id == tableId)
          .map(table => table.desc)[0] || ""
      );
    },

    download() {
      const guestWS = XLSX.utils.json_to_sheet(this.exportData);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, guestWS);

      const date = moment().format("DD-MM-YYYY HH_mm");
      const name = `Guests ${date}.xlsx`;
      XLSX.writeFile(wb, name);
    }
  }
};
</script>
