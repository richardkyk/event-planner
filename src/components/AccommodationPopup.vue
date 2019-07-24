<template>
  <v-dialog persistent v-model="dialog" max-width="500">
    <v-card>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <!-- Description text field -->
          <v-layout row>
            <v-text-field
              :rules="inputRules"
              v-model="desc"
              label="Description"
              prepend-icon="hotel"
            ></v-text-field>
          </v-layout>

          <!-- Address text field -->
          <v-layout row>
            <v-text-field
              :rules="inputRules"
              v-model="address"
              label="Address"
              prepend-icon="location_on"
            ></v-text-field>
          </v-layout>

          <!-- Suburb and postcode text field -->
          <v-layout row>
            <v-text-field
              :rules="inputRules"
              v-model="suburb"
              label="Suburb"
              prepend-icon="location_city"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-text-field
              :rules="inputRules"
              v-model="postCode"
              label="Postcode"
              prepend-icon="map"
            ></v-text-field>
          </v-layout>

          <v-layout row>
            <!-- This is the check-in date picker -->
            <v-menu :close-on-content-click="false">
              <v-text-field
                readonly
                :rules="dateRules"
                :value="formattedDate(checkInDate)"
                slot="activator"
                label="Check-in Date"
                prepend-icon="date_range"
              ></v-text-field>
              <v-date-picker v-model="checkInDate"></v-date-picker>
            </v-menu>
            <v-spacer></v-spacer>

            <!-- This is the checkout date picker -->
            <v-menu :close-on-content-click="false">
              <v-text-field
                readonly
                :rules="dateRules"
                :value="formattedDate(checkOutDate)"
                slot="activator"
                label="Checkout Date"
                prepend-icon="date_range"
              ></v-text-field>
              <v-date-picker v-model="checkOutDate"></v-date-picker>
            </v-menu>
          </v-layout>

          <v-combobox
            v-model="guests"
            :items="allAccomGuests"
            chips
            multiple
            item-text="name"
            item-value="name"
            label="Guests"
            flat
            prepend-icon="people"
          >
            <template v-slot:selection="data">
              <v-chip small :selected="data.selected" close @input="remove(data.item)">
                <strong>{{ data.item.name }}</strong>&nbsp;
              </v-chip>
            </template>>
          </v-combobox>

          <v-layout row>
            <v-btn flat @click.stop="dialog = false">Close</v-btn>
            <v-btn flat @click="deleteAccom">Delete</v-btn>
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
import { arrayUnion, arrayRemove } from "vuex-easy-firestore";

export default {
  data() {
    return {
      dialog: false,
      desc: "",
      address: "",
      suburb: "",
      postCode: "",
      checkInDate: null,
      checkOutDate: null,
      guests: [],
      initialGuests: [],
      inputRules: [v => v.length >= 1 || "Please enter a value"],
      dateRules: [v => v != null || "Please select a date/time"]
    };
  },
  methods: {
    remove(item) {
      this.guests.splice(this.guests.indexOf(item), 1);
      this.guests = [...this.guests];
    },
    open(data) {
      Object.assign(this, data);
      this.checkInDate = this.checkInDate
        ? moment(this.checkInDate, "Do MMM YYYY").format("YYYY-MM-DD")
        : null;
      this.checkOutDate = this.checkOutDate
        ? moment(this.checkOutDate, "Do MMM YYYY").format("YYYY-MM-DD")
        : null;
      this.guests =
        data.guests.length > 0
          ? this.$store.getters["accommodations/accomGuests"](data.id)
          : [];
      this.initialGuests = data.guests;
      this.dialog = true;
    },
    submit() {
      if (this.$refs.form.validate()) {
        const guests = this.guests.map(guest => guest.id);
        const removedGuests = this.initialGuests.filter(
          guestId => !guests.includes(guestId)
        );

        removedGuests.forEach(guest => {
          this.$store.dispatch("guests/patch", {
            id: guest,
            accomId: arrayRemove(this.id)
          });
        });

        const accomId = this.id
          ? this.id
          : this.$store.getters["accommodations/dbRef"].doc().id;
        const data = {
          id: accomId,
          desc: this.desc,
          address: this.address,
          suburb: this.suburb,
          postCode: this.postCode,
          guests,
          checkInDate: moment(this.checkInDate).format("Do MMM YYYY"),
          checkOutDate: moment(this.checkOutDate).format("Do MMM YYYY")
        };

        this.$store.dispatch("accommodations/set", data);
        guests.forEach(guestId => {
          this.$store.dispatch("guests/set", {
            id: guestId,
            accomId: arrayUnion(accomId)
          });
        });

        this.dialog = false;
      }
    },
    deleteAccom() {
      console.log("deleted");
    },
    formattedDate(date) {
      return date ? moment(date, "YYYY-MM-DD").format("Do MMM YYYY") : null;
    }
  },
  computed: {
    allAccomGuests() {
      return this.$store.getters["guests/allAccomGuests"];
    }
  }
};
</script>
