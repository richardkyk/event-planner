<template>
  <div class="tables">
    <v-container>
      <v-row ml-2>
        <v-col sm="12" md="6" lg="4" xl="3">
          <v-btn @click="addTable()" small text color="grey">
            <v-icon left small>add</v-icon>
            <span>Add Table</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row wrap>
        <v-col sm="12" md="6" lg="4" xl="3" v-for="table in sortedTables" :key="table.id">
          <TableLayout v-bind:table="table" />
        </v-col>
      </v-row>
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
        coords: { x: 85, y: 85 }
      };
      this.$store.dispatch("tables/set", data);
    }
  }
};
</script>
