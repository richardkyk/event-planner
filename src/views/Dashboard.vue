<template>
  <div class="about">
    <h1 class="subheading grey--text">Dashboard</h1>
    <v-btn @click="test()">{{count}}</v-btn>
  </div>
</template>

<script>
// import store from "@/store";
import store from "@/store";
import guests from "@/store/modules/guests";

export default {
  data() {
    return {
      count: 0
    };
  },
  methods: {
    test() {
      console.log(this.$store.state.tables.data);
      console.log(this.$store.state.guests.data);
      this.count += 1;
      const id = "LsQXLrhuESZ2c9i6xvPE";
      store.dispatch("guests/set", {
        id,
        name: `This is testing${this.count}`
      });
      // return store.state.data.testicles.name;
      // return store.data.testicles.name;
      // return guests.state.data.testicles.name;
    }
  }
};
</script>
