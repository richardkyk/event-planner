<template>
  <div class="tables">
    <v-container class="my-5">
      <v-layout row ml-2>
        <v-flex xs12 sm6 md4 lg3>
          <v-btn @click="addTable()" small flat color="grey">
            <v-icon left small>add</v-icon>
            <span>Add Table</span>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg3 v-for="table in sortedTables" :key="table.id">
          <TableLayout v-bind:table="table" />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import TableLayout from "@/components/TableLayout";

export default {
  components: { TableLayout },
  data() {
    return {
      tables: [],
      guests: {}
    };
  },
  computed: {
    sortedTables() {
      return this.$store.getters["tables/sortedTables"];
    }
  },
  methods: {
    addTable() {
      const newId = Object.keys(this.$store.state.tables.data).length + 1;
      const data = {
        tableNum: newId,
        desc: "",
        guests: [],
        coords: { x: 75, y: 75 }
      };
      this.$store.dispatch("tables/set", data);
    }
  }
};
</script>
