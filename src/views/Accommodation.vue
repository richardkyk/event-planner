<template>
  <div class="accommodations">
    <v-container class="my-5">
      <v-layout row ml-2>
        <v-flex xs12 sm6 md4 lg3>
          <v-btn @click="addAccommodation()" small flat color="grey">
            <v-icon left small>add</v-icon>
            <span>Add Accommodation</span>
            <AccommodationPopup ref="accommodationPopup" />
          </v-btn>
        </v-flex>
      </v-layout>

      <!-- Arrival cards -->
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg3 v-for="accom in accommodations" :key="accom.id">
          <AccommodationLayout v-bind:accom="accom" />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import AccommodationLayout from "@/components/AccommodationLayout";
import AccommodationPopup from "@/components/AccommodationPopup";
import { mapGetters } from "vuex";
export default {
  components: { AccommodationLayout, AccommodationPopup },
  data() {
    return {};
  },
  methods: {
    addAccommodation() {
      const data = {
        desc: "",
        address: "",
        suburb: "",
        postCode: "",
        checkInDate: null,
        checkOutDate: null,
        guests: []
      };
      this.$refs.accommodationPopup.open(data);
    }
  },
  computed: {
    ...mapGetters({
      accommodations: "accommodations/accommodations"
    })
  }
};
</script>
