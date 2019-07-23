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
            label="Guests for this flight"
            flat
            prepend-icon="people"
          >
            <template v-slot:selection="data">
              <v-chip small :selected="data.selected" close @input="remove(data.item)">
                <strong>{{ data.item.name }}</strong>&nbsp;
              </v-chip>
            </template>>
          </v-combobox>
          <!-- <v-combobox
            v-model="guests"
            :items="flightGuests"
            label="Guests for this flight"
            flat
            chips
            clearable
            prepend-icon="filter_list"
            solo
            multiple
          >
            <template v-slot:selection="data">
              <v-chip :selected="data.selected" close @input="remove(data.item)">
          <strong>{{ data.item.name }}</strong>&nbsp;-->
          <!-- <template slot="item" slot-scope="data">{{ data.item.name }}</template> -->
          <!-- </v-chip>
            </template>
          </v-combobox>-->

          <v-layout row>
            <v-btn flat @click.stop="dialog = false">Close</v-btn>
            <v-btn flat @click="deleteFlight" danger>Delete</v-btn>
            <v-spacer></v-spacer>
            <v-btn flat @click="submit">Submit</v-btn>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment";
import { arrayUnion } from "vuex-easy-firestore";

export default {
  data() {
    return {
      dialog: false,
      flightNum: "",
      flightDate: null,
      flightTime: null,
      guests: [],
      arrival: true,
      showClock: false,
      inputRules: [v => v.length >= 1 || "Please enter a flight number"],
      dateRules: [v => v != null || "Please select a date/time"]
    };
  },
  methods: {
    remove(item) {
      this.guests.splice(this.guests.indexOf(item), 1);
      this.guests = [...this.guests];
      if (this.id) {
        const newFlightId = item.flightId.filter(
          flightId => flightId != this.id
        );
        this.$store.dispatch("guests/set", {
          id: item.id,
          flightId: newFlightId
        });
      }
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
      this.id = id;
    },
    submit() {
      if (this.$refs.form.validate()) {
        const guests = this.guests.map(guest => guest.id);
        const flightId = this.id
          ? this.id
          : this.$store.getters["flights/dbRef"].doc().id;
        const data = {
          id: flightId,
          flightNum: this.flightNum,
          flightTime: moment(this.flightTime, "HH:mm").format("h:mm A"),
          flightDate: moment(this.flightDate).format("Do MMM YYYY"),
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
      const allFlightGuests = this.$store.getters["guests/allFlightGuests"];
      return allFlightGuests;
    }
  }
};
</script>

<style>
.v-input__prepend-outer {
  margin-top: 15px;
}
.v-select.v-select--chips .v-select__selections {
  min-height: 0px !important;
}
</style>
