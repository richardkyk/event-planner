<template>
  <v-app class="grey lighten-4">
    <Navbar />
    <v-content class="mx-4 mb-4">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";

export default {
  name: "App",
  components: { Navbar },
  data() {
    return {
      //
    };
  },
  created() {
    // Listener for table changes
    this.$store.dispatch("guests/openDBChannel").catch(console.error);
    this.$store.dispatch("tables/openDBChannel").catch(console.error);
    this.$store.dispatch("flights/openDBChannel").catch(console.error);
    this.$store.dispatch("accommodations/openDBChannel").catch(console.error);
  }
};
</script>
