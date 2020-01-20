<template>
  <v-container>
    <svg
      width="1750"
      height="900"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      style="outline: 1px solid #630;"
    >
      <g v-for="table in tables" :key="table.id">
        <FloorplanTable v-bind:table="table" />
      </g>
    </svg>
  </v-container>
</template>

<script>
import FloorplanTable from "@/components/FloorplanTable";

export default {
  components: { FloorplanTable },
  data() {
    return {};
  },
  computed: {
    tables() {
      return this.$store.getters["tables/sortedTables"];
    }
  }
};
</script>


<style>
</style>