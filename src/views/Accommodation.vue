<template>
  <div class="accommodations">
    <v-container fluid>
      <v-row>
        <v-col sm="12" md="6" lg="4" xl="3">
          <v-btn @click="addAccommodation()" small text color="grey">
            <v-icon left small>add</v-icon>
            <span>Add Accommodation</span>
            <AccommodationPopup ref="accommodationPopup" />
          </v-btn>
        </v-col>
      </v-row>

      <v-row wrap>
        <v-col sm="12" md="6" lg="4" xl="3" v-for="accom in accommodations" :key="accom.id">
          <AccommodationLayout v-bind:accom="accom" />
        </v-col>
      </v-row>
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
