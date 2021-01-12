<template>
  <v-container class="my-10" fluid>
    <v-data-table
      :headers="headers"
      :search="search"
      :items="sortedGuests"
      :custom-filter="customFilter"
      multi-sort
      sort-by="name"
      class="elevation-4"
      ref="dataTable"
    >
      <template v-slot:[`item.seatNum`]="{ item }">
        {{ getSeatNumber(item) }}
      </template>
      <template v-slot:[`item.desc`]="{ item }">
        {{ tableDesc(item.tableId) }}
      </template>

      <template v-slot:[`item.gift`]="props">
        <v-edit-dialog
          :return-value.sync="props.item.gift"
          @save="save(props.item)"
        >
          {{ props.item.gift }}
          <template v-slot:input>
            <v-text-field
              v-model="props.item.gift"
              label="Edit"
              single-line
              counter
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <template v-slot:[`item.rsvp`]="{ item }">
        <v-chip @click="rsvp(item)" :color="getColor(item.rsvp)" dark>
          {{ toTitleCase(item.rsvp) }}
        </v-chip>
      </template>
      <template v-slot:[`item.checkin`]="{ item }">
        <v-chip v-if="item.checkin" @click="checkin(item)" color="green" dark
          >Checked In</v-chip
        >
        <v-chip v-else @click="checkin(item)" color="orange" dark
          >Check In</v-chip
        >
      </template>

      <template v-slot:[`item.time`]="{ item }">
        {{ displayTime(item.time) }}
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
            <v-col
              cols="12"
              md="8"
              lg="9"
              :style="{ 'text-align': 'end', 'padding-top': '5px' }"
            >
              <v-btn
                class="btn-fix"
                small
                text
                color="primary"
                @click="download"
              >
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
        { text: "Seat", value: "seatNum" },
        { text: "Description", value: "desc" },
        { text: "Dietary", value: "dietary" },
        { text: "RSVP", value: "rsvp" },
        { text: "Gift", value: "gift" },
        { text: "Time", value: "time" },
        { text: "Check in", value: "checkin" },
      ],
    };
  },
  computed: {
    sortedGuests() {
      return this.$store.getters["guests/sortedGuests"](this.prop).map(
        (guest) => {
          return {
            ...guest,
            seatNum: this.getSeatNumber(guest),
            desc: this.tableDesc(guest.tableId),
          };
        }
      );
    },
    exportData() {
      const guests = this.$store.getters["guests/allGuests"]
        ? this.$store.getters["guests/allGuests"]
        : [];

      const data = [];
      guests.forEach((guest) => {
        data.push({
          "Full Name": guest.name,
          "First Name": this.getName(guest.name)[0],
          Surname: this.getName(guest.name)[1],
          Table: guest.tableNum,
          Seat: this.getSeatNumber(guest),
          Description: this.tableDesc(guest.tableId),
          "Dietary Selection": guest.dietary,
          RSVP: this.toTitleCase(guest.rsvp),
          Gift: guest.gift,
          Time: this.displayTime(guest.time),
          "Checked In": guest.checkin,
        });
      });
      return data;
    },
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
        name,
        tableNum,
        dietary,
        rsvp,
        gift,
        tableId,
        checkin,
      }) => ({
        name,
        table: tableNum,
        desc: this.tableDesc(tableId),
        dietary,
        rsvp,
        gift,
        checkin: checkin || false,
      }))(item);
      if (search.includes("|")) {
        // This will search for either of the items
        const searchItems = searchLC.split("|").filter((el) => el != "");
        return searchItems.some((val) => {
          return this.filterValue(val, searchObject);
        });
      } else if (search.includes("&")) {
        // This will search for both of the items
        const searchItems = searchLC.split("&").filter((el) => el != "");
        return searchItems.every((val) => {
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
            (k) =>
              `${k.toString().toLowerCase()}:${searchObject[k]
                .toString()
                .toLowerCase()}`
          )
          .join(";")
          .includes(val.toLowerCase());
      } else {
        return Object.keys(searchObject)
          .map((k) => `${searchObject[k].toString().toLowerCase()}`)
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

    displayTime(unix) {
      return unix == "" ? "" : moment.unix(unix).format("h:mm A");
    },
    rsvp(guest) {
      const oldRsvpIndex = this.rsvpValues.indexOf(guest.rsvp);
      const newRsvpIndex = (oldRsvpIndex + 1) % this.rsvpValues.length;
      const newRsvp = this.rsvpValues[newRsvpIndex];
      const payload = { id: guest.id, rsvp: newRsvp };
      this.$store.dispatch("guests/patch", payload);
    },
    checkin(guest) {
      const checkin = guest.checkin || false;
      const payload = { id: guest.id, checkin: !checkin, time: "" };
      if (!checkin) {
        payload.time = moment().unix();
      }
      this.$store.dispatch("guests/patch", payload);
    },
    tableDesc(tableId) {
      const tables = this.$store.getters["tables/sortedTables"];

      return tables
        .filter((table) => table.id == tableId)
        .map((table) => table.desc)[0];
    },
    getSeatNumber(guest) {
      const seatNum =
        this.$store.getters["tables/tableGuests"](guest.tableId)
          .map((guest) => guest.id)
          .indexOf(guest.id) + 1;
      return seatNum;
    },

    save(guest) {
      const payload = { id: guest.id, gift: guest.gift };
      this.$store.dispatch("guests/patch", payload);
    },

    getName(name) {
      const nameArr = name.split(" ");
      const surname = nameArr.pop();
      const firstName = nameArr.join(" ");
      return [firstName, surname];
    },

    download() {
      const guestWS = XLSX.utils.json_to_sheet(this.exportData);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, guestWS);

      const date = moment().format("DD-MM-YYYY HH_mm");
      const name = `Guests ${date}.xlsx`;
      XLSX.writeFile(wb, name);
    },
  },
};
</script>
