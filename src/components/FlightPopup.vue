<template>
  <v-dialog persistent v-model="dialog" max-width="500">
    <v-card>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-layout row>
            <v-text-field
              :rules="inputRules"
              v-model="flightNum"
              label="Flight number"
              prepend-icon="local_airport"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-flex xs3>
              <v-radio-group row v-model="arrival">
                <v-radio color="primary" label="Arrival" :value="true"></v-radio>
                <v-radio color="primary" label="Departure" :value="false"></v-radio>
              </v-radio-group>
            </v-flex>
          </v-layout>

          <v-layout row>
            <!-- This is the date picker -->
            <v-menu :close-on-content-click="false">
              <v-text-field
                readonly
                :rules="dateRules"
                :value="formattedDate"
                slot="activator"
                label="Date"
                prepend-icon="date_range"
              ></v-text-field>
              <v-date-picker v-model="flightDate"></v-date-picker>
            </v-menu>
            <v-spacer></v-spacer>

            <!-- This is the time picker -->
            <v-menu v-model="showClock" :close-on-content-click="false">
              <v-text-field
                readonly
                :rules="dateRules"
                :value="flightTime"
                slot="activator"
                label="Time"
                prepend-icon="access_time"
              ></v-text-field>
              <v-time-picker v-if="showClock" v-model="flightTime"></v-time-picker>
            </v-menu>
          </v-layout>

          <v-combobox
            v-model="guests"
            :items="allFlightGuests"
            chips
            multiple
            item-text="name"
            item-value="name"
            label="Passengers"
            flat
            prepend-icon="people"
            hide-selected
          >
            <template v-slot:selection="data">
              <v-chip small :selected="data.selected" close @input="remove(data.item)">
                <strong>{{ data.item.name }}</strong>&nbsp;
              </v-chip>
            </template>
          </v-combobox>

          <v-layout row>
            <v-btn class="text-none" flat @click.stop="dialog = false">Close</v-btn>
            <v-btn class="text-none" color="error" flat @click="deleteFlight" v-if="id">Delete</v-btn>
            <v-spacer></v-spacer>
            <v-btn class="text-none" color="primary" flat @click="submit">Submit</v-btn>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
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
      arrival: true,
      showClock: false,
      initialGuests: [],
      guests: [],
      inputRules: [v => v.length >= 1 || "Please enter a flight number"],
      dateRules: [v => v != null || "Please select a date/time"]
    };
  },
  methods: {
    remove(item) {
      this.guests.splice(this.guests.indexOf(item), 1);
      this.guests = [...this.guests];
    },
    open(data) {
      const { flightNum, arrival, flightDate, flightTime, id, guests } = data;
      this.dialog = true;
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

        this.dialog = false;
      }
    },
    deleteFlight() {
      this.initialGuests.forEach(guestId => {
        this.$store.dispatch("guests/patch", {
          id: guestId,
          flightId: arrayRemove(this.id)
        });
      });
      this.$store.dispatch("flights/delete", this.id);
      this.dialog = false;
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
