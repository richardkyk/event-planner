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
              <v-date-picker v-model="date"></v-date-picker>
            </v-menu>
            <v-spacer></v-spacer>

            <!-- This is the time picker -->
            <v-menu v-model="showClock" :close-on-content-click="false">
              <v-text-field
                readonly
                :rules="dateRules"
                :value="time"
                slot="activator"
                label="Time"
                prepend-icon="access_time"
              ></v-text-field>
              <v-time-picker v-if="showClock" v-model="time"></v-time-picker>
            </v-menu>
          </v-layout>

<v-combobox
    v-model="chips"
    :items="guests"
    label="Guests for this flight"
    flat
    chips
    clearable
    prepend-icon="filter_list"
    solo
    multiple
  >
    <template v-slot:selection="data">
      <v-chip
        :selected="data.selected"
        close
        @input="remove(data.item)"
      >
        <strong>{{ data.item }}</strong>&nbsp;
        <span>(interest)</span>
      </v-chip>
    </template>
  </v-combobox>

          <v-layout row>
            <v-btn flat @click.stop="dialog = false">Close</v-btn>
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

export default {
  data() {
    return {
      dialog: false,
      flightNum: "",
      date: null,
      time: null,
      guests: [],
      arrival: true,
      uid: "",
      showClock: false,
      inputRules: [v => v.length >= 1 || "Please enter a flight number"],
      dateRules: [v => v != null || "Please select a date/time"]
    };
  },
  methods: {
    open(data) {
      const { flightNum, arrival, date, time, uid, guests } = data;
      this.dialog = true;
      this.flightNum = flightNum;
      this.arrival = arrival;
      this.date = date
        ? moment(date, "Do MMM YYYY").format("YYYY-MM-DD")
        : null;
      this.time = time ? moment(time, "HH:mm A").format("HH:mm") : null;
      this.uid = uid;
      this.guests = guests;
    },
    submit() {
      if (this.$refs.form.validate()) {
        const data = {
          flightNum: this.flightNum,
          time: moment(this.time, "HH:mm").format("h:mm A"),
          date: moment(this.date).format("Do MMM YYYY"),
          arrival: this.arrival,
          guests: this.guests
        };
        console.log(this.uid);
        console.log(data);
      }
    }
  },
  computed: {
    formattedDate() {
      return this.date ? moment(this.date).format("Do MMM YYYY") : null;
    }, guestNames() {
      
    }
  }
};
</script>

<style>
.v-input__prepend-outer {
  margin-top: 15px;
}
</style>
