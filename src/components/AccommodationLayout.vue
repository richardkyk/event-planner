<template>
  <div class="accommodation">
    <v-card outlined class="mx-3 mb-5 pa-3">
      <v-layout row align-center>
        <v-icon size="40" color="indigo">hotel</v-icon>

        <v-spacer></v-spacer>
        <h1 class="font-weight-medium indigo--text">{{accom.desc}}</h1>
        <v-flex ml-2 xs1>
          <v-btn block icon @click="editAccom(accom)">
            <v-icon color="#3f51b5 ">edit</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout row mb-3 mt-1>
        <span class="font-weight-light title">{{accom.checkInDate}}</span>
        <v-spacer></v-spacer>
        <v-icon>arrow_forward</v-icon>
        <v-spacer></v-spacer>
        <span class="font-weight-light title">{{accom.checkOutDate}}</span>

        <v-flex ml-2 xs1></v-flex>
      </v-layout>

      <v-layout row mb-3 mt-1>
        <span
          class="font-weight-light subtitle"
        >{{accom.address}}, {{accom.suburb}}, {{accom.postCode}}</span>
        <v-flex ml-2 xs1></v-flex>
      </v-layout>
      <v-flex mb-4>
        <GmapMap
          :center="accom.coords"
          :zoom="15"
          map-type-id="terrain"
          style="width: auto; height: 200px"
          :options="{
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true,
            disableDefaultUi: false
          }"
        >
          <GmapMarker :position="accom.coords" :clickable="true" @click="center=accom.coords" />
        </GmapMap>
      </v-flex>

      <v-divider></v-divider>
      <v-item-group class="mt-3">
        <v-item v-for="guest in accomGuests" :key="guest.id">
          <v-chip color="indigo" class="white--text" small>{{guest.name}}</v-chip>
        </v-item>
      </v-item-group>
    </v-card>
    <AccommodationPopup ref="accommodationPopup" />
  </div>
</template>

<script>
import AccommodationPopup from "@/components/AccommodationPopup";
export default {
  components: { AccommodationPopup },
  props: ["accom"],
  methods: {
    editAccom(accom) {
      this.$refs.accommodationPopup.open(accom);
    }
  },
  computed: {
    accomGuests() {
      return this.$store.getters["accommodations/accomGuests"](this.accom.id);
    }
  }
};
</script>
