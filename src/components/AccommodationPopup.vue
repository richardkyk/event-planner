<template>
  <v-dialog persistent v-model="dialog" max-width="500">
    <v-card>
      <v-form ref="form">
        <v-card-text class="px-4">
          <v-row>
            <!-- Description text field -->
            <v-col cols="12">
              <v-text-field
                :rules="inputRules"
                v-model="desc"
                label="Description"
                prepend-icon="hotel"
              ></v-text-field>
            </v-col>

            <!-- Address text field -->
            <v-col cols="12">
              <v-text-field
                :rules="inputRules"
                v-model="address"
                label="Address"
                prepend-icon="location_on"
              ></v-text-field>
            </v-col>

            <!-- Suburb and postcode text field -->
            <v-col cols="6">
              <v-text-field
                :rules="inputRules"
                v-model="suburb"
                label="Suburb"
                prepend-icon="location_city"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-spacer></v-spacer>
              <v-text-field
                :rules="inputRules"
                v-model="postCode"
                label="Postcode"
                prepend-icon="map"
              ></v-text-field>
            </v-col>

            <!-- This is the check-in date picker -->
            <v-col cols="6">
              <v-menu :close-on-content-click="false">
                <template v-slot:activator="{ on }">
                  <v-text-field
                    readonly
                    :rules="dateRules"
                    :value="formattedDate(checkInDate)"
                    v-on="on"
                    label="Check-in Date"
                    prepend-icon="date_range"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="checkInDate"></v-date-picker>
              </v-menu>
            </v-col>

            <!-- This is the checkout date picker -->
            <v-col cols="6">
              <v-menu :close-on-content-click="false">
                <template v-slot:activator="{on}">
                  <v-text-field
                    readonly
                    :rules="dateRules"
                    :value="formattedDate(checkOutDate)"
                    v-on="on"
                    label="Checkout Date"
                    prepend-icon="date_range"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="checkOutDate"></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12">
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
        </v-card-text>
        <v-card-actions>
          <v-btn class="text-none" color="error" @click="deleteAccom" v-if="id">Delete</v-btn>
          <v-spacer></v-spacer>
          <v-btn class="text-none" @click.stop="dialog = false">Close</v-btn>
          <v-btn class="text-none" color="primary" @click="submit">Submit</v-btn>
        </v-card-actions>
      </v-form>
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
    async submit() {
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
            accomId: arrayRemove(this.id)
          });
        });

        let coords = {};
        try {
          coords = await this.getCoords(
            `${this.address} ${this.suburb} ${this.postCode}`
          );
        } catch (error) {
          coords = {};
        }

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
          coords,
          checkInDate: moment(this.checkInDate).format("Do MMM YYYY"),
          checkOutDate: moment(this.checkOutDate).format("Do MMM YYYY"),
          checkInTimestamp: moment(this.checkInDate).unix()
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
    async getCoords(address) {
      const geocoder = new google.maps.Geocoder();
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          const coords = {};
          if (status == google.maps.GeocoderStatus.OK) {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            (coords.lat = lat), (coords.lng = lng);
            resolve(coords);
          } else {
            reject(new Error("Couldn't find the location " + address));
          }
        });
      });
    },

    deleteAccom() {
      if (confirm("Are you sure you want to delete this item?")) {
        this.initialGuests.forEach(guestId => {
          this.$store.dispatch("guests/patch", {
            id: guestId,
            accomId: arrayRemove(this.id)
          });
        });
        this.$store.dispatch("accommodations/delete", this.id);
        this.dialog = false;
      }
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
