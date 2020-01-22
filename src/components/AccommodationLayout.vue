<template>
  <v-container name="accomLayout">
    <v-card elevation="5" class="ma-1 pa-5">
      <v-row>
        <v-col cols="3" align-self="center">
          <v-icon size="40" color="indigo">hotel</v-icon>
        </v-col>

        <!-- Description -->
        <v-col cols="7" align-self="center" class="text-right">
          <span class="headline ml-3 font-weight-light indigo--text text-truncate">{{accom.desc}}</span>
        </v-col>

        <v-col cols="2" align-self="center">
          <v-btn icon>
            <v-icon @click="editAccom(accom)" color="#3f51b5 ">edit</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <!-- Dates for check-in/checkout -->
      <v-row justify-self="space-between" class="my-n3">
        <v-col cols="5" class="font-weight-light title">{{accom.checkInDate}}</v-col>
        <!-- <v-spacer></v-spacer> -->
        <v-col cols="2" align-self="center" class="text-center">
          <v-icon size="35">arrow_right</v-icon>
        </v-col>
        <!-- <v-spacer></v-spacer> -->
        <v-col cols="5" class="font-weight-light title">{{accom.checkOutDate}}</v-col>

        <!-- <v-col ml-2 xs1></v-col> -->
      </v-row>

      <!-- Address -->
      <v-row>
        <v-col>
          <span
            class="font-weight-light subtitle"
          >{{accom.address}}, {{accom.suburb}}, {{accom.postCode}}</span>
        </v-col>
      </v-row>

      <!-- Google map -->
      <v-col>
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
            disableDefaultUi: false,
          }"
        >
          <!-- Multiple markers per map -->
          <GmapMarker
            v-for="(m, index) in markers"
            :key="index"
            :position="m"
            :clickable="true"
            @click="center=m"
          ></GmapMarker>
        </GmapMap>
      </v-col>

      <v-divider class="mt-3"></v-divider>

      <!-- Guests list for accommodation -->
      <v-item-group class="mt-3">
        <v-item v-for="guest in accomGuests" :key="guest.id">
          <v-chip color="indigo" class="white--text ma-1" small>{{guest.name}}</v-chip>
        </v-item>
      </v-item-group>
    </v-card>

    <!-- Dialog popup -->
    <AccommodationPopup ref="accommodationPopup" />
  </v-container>
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
    },
    markers() {
      return this.$store.getters["accommodations/markers"];
    }
  }
};
</script>
