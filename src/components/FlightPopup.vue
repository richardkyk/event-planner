<template>
  <v-dialog persistent v-model="dialog" max-width="600">
    <v-form ref="form">
      <v-card class="pa-3">
        <v-row>
          <v-col cols="4">
            <v-text-field
              class="mx-3"
              :rules="inputRules"
              v-model="flightNum"
              label="Flight number"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field class="mx-3" :rules="inputRules" v-model="airport" label="Airport"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-radio-group class="mx-3" row v-model="arrival">
              <v-radio color="primary" label="Arrival" :value="true"></v-radio>
              <v-radio color="primary" label="Departure" :value="false"></v-radio>
            </v-radio-group>
          </v-col>

          <v-col cols="6">
            <!-- This is the date picker -->
            <v-menu :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-text-field
                  class="mx-3"
                  readonly
                  :rules="dateRules"
                  :value="formattedDate"
                  v-on="on"
                  label="Date"
                ></v-text-field>
              </template>
              <v-date-picker v-model="flightDate"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6">
            <!-- This is the time picker -->
            <v-menu v-model="showClock" :close-on-content-click="false">
              <template v-slot:activator="{ on }">
                <v-text-field
                  class="mx-3"
                  readonly
                  :rules="dateRules"
                  :value="flightTime"
                  v-on="on"
                  label="Time"
                ></v-text-field>
              </template>
              <v-time-picker v-if="showClock" v-model="flightTime"></v-time-picker>
            </v-menu>
          </v-col>

          <v-col cols="12">
            <v-combobox
              class="mx-3"
              v-model="guests"
              :items="allFlightGuests"
              chips
              multiple
              item-text="name"
              item-value="name"
              label="Passengers"
              flat
              hide-selected
            >
              <template v-slot:selection="data">
                <v-chip small :input-value="data.selected" close @click:close="remove(data.item)">
                  <strong>{{ data.item.name }}</strong>&nbsp;
                </v-chip>
              </template>
            </v-combobox>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn color="error" @click="deleteFlight" v-if="id">Delete</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click.stop="close">Close</v-btn>
          <v-btn color="primary" @click="submit">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import moment from "moment";
import { arrayUnion, arrayRemove } from "vuex-easy-firestore";

export default {
  data() {
    return {
      dialog: false,
      id: null,
      flightNum: "",
      flightDate: null,
      flightTime: null,
      airport: "",
      arrival: true,
      showClock: false,
      initialGuests: [],
      guests: [],
      inputRules: [v => v.length >= 1 || "Please enter a flight number"],
      dateRules: [v => v != null || "Please select a date/time"]
    };
  },
  methods: {
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.$refs.form.resetValidation();
        Object.assign(this, {
          id: null,
          flightNum: "",
          flightDate: null,
          flightTime: null,
          airport: "",
          arrival: true,
          showClock: false,
          initialGuests: [],
          guests: []
        });
      }, 300);
    },
    remove(item) {
      this.guests.splice(this.guests.indexOf(item), 1);
      this.guests = [...this.guests];
    },
    open(data) {
      const {
        flightNum,
        arrival,
        flightDate,
        flightTime,
        id,
        guests,
        airport
      } = data;
      this.dialog = true;
      this.airport = airport;
      this.flightNum = flightNum;
      this.arrival = arrival;
      this.flightDate = flightDate
        ? moment(flightDate, "Do MMM YYYY").format("YYYY-MM-DD")
        : null;
      this.flightTime = flightTime
        ? moment(flightTime, "HH:mm A").format("HH:mm")
        : null;
      this.guests =
        guests.length > 0
          ? this.$store.getters["flights/flightGuests"](id)
          : [];
      this.initialGuests = guests;
      this.id = id;
    },
    submit() {
      if (this.$refs.form.validate()) {
        const guests = this.guests
          .map(guest => guest.id)
          .filter(guest => guest !== undefined);
        const removedGuests = this.initialGuests.filter(
          guestId => !guests.includes(guestId)
        );

        removedGuests.forEach(guest => {
          this.$store.dispatch("guests/patch", {
            id: guest,
            flightId: arrayRemove(this.id)
          });
        });

        const flightId = this.id
          ? this.id
          : this.$store.getters["flights/dbRef"].doc().id;
        const data = {
          id: flightId,
          airport: this.airport,
          flightNum: this.flightNum,
          flightTime: moment(this.flightTime, "HH:mm").format("h:mm A"),
          flightDate: moment(this.flightDate).format("Do MMM YYYY"),
          flightTimestamp: moment(
            this.flightDate + " " + this.flightTime,
            "YYYY/MM/DD HH:mm"
          ).unix(),
          arrival: this.arrival,
          guests
        };

        this.$store.dispatch("flights/set", data);
        guests.forEach(guestId => {
          this.$store.dispatch("guests/set", {
            id: guestId,
            flightId: arrayUnion(flightId)
          });
        });

        this.close();
      }
    },
    deleteFlight() {
      if (confirm("Are you sure you want to delete this item?")) {
        this.initialGuests.forEach(guestId => {
          this.$store.dispatch("guests/patch", {
            id: guestId,
            flightId: arrayRemove(this.id)
          });
        });
        this.$store.dispatch("flights/delete", this.id);
        this.close();
      }
    }
  },
  computed: {
    formattedDate() {
      return this.flightDate
        ? moment(this.flightDate).format("Do MMM YYYY")
        : null;
    },
    allFlightGuests() {
      return this.$store.getters["guests/allFlightGuests"];
    }
  }
};
</script>

<style>
.v-input__prepend-outer {
  margin-top: 10px;
}
.v-select.v-select--chips .v-select__selections {
  min-height: 0px !important;
}
</style>
