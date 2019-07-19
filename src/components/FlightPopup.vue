<template>
  <v-dialog persistent v-model="dialog" max-width="500">
    <v-card>
      <v-card-text>
        <v-form class="px-3">
          <v-text-field v-model="flightNum" label="Flight number" prepend-icon="local_airport"></v-text-field>

          <v-layout row>
            <!-- This is the date picker -->
            <v-menu>
              <v-text-field
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
              <v-text-field :value="time" slot="activator" label="Time" prepend-icon="access_time"></v-text-field>
              <v-time-picker v-if="showClock" v-model="time"></v-time-picker>
            </v-menu>
          </v-layout>
        </v-form>
        <v-btn flat @click.stop="dialog = false">Close</v-btn>
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
      showClock: false
    };
  },
  methods: {
    open(data) {
      this.dialog = true;
      this.flightNum = data.flightNum;
      this.date = data.date
        ? moment(data.date, "Do MMM YYYY").format("YYYY-MM-DD")
        : null;
      this.time = data.time
        ? moment(data.time, "HH:mm A").format("HH:mm")
        : null;
    }
  },
  computed: {
    formattedDate() {
      return this.date ? moment(this.date).format("Do MMM YYYY") : null;
    }
  }
};
</script>

<style>
.v-input__prepend-outer {
  margin-top: 15px;
}
</style>
