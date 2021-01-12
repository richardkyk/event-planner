<template>
  <div class="tables">
    <v-container fluid>
      <v-row ml-2>
        <v-col cols="12" sm="6" md="4" lg="3" xl="2">
          <v-btn @click="addTable()" small text color="grey">
            <v-icon left small>add</v-icon>
            <span>Add Table</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row wrap>
        <v-col
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="xl5-custom"
          v-for="table in sortedTables"
          :key="table.id"
        >
          <TableLayout v-bind:table="table" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TableLayout from "@/components/TableLayout";
import { uuidv4 } from "@/utility/helpers";

export default {
  components: { TableLayout },
  data() {
    return {
      tables: [],
      guests: {},
    };
  },
  computed: {
    sortedTables() {
      return this.$store.getters["tables/sortedTables"];
    },
  },
  methods: {
    addTable() {
      const newId = Object.keys(this.$store.state.tables.data).length + 1;
      const data = {
        id: uuidv4(),
        tableNum: newId,
        desc: "",
        guests: [],
        coords: { x: 85, y: 85 },
        isBridalTable: false,
      };
      this.$store.dispatch("tables/set", data);
    },
  },
};
</script>

<style lang="stylus" scoped>
@media (min-width: 1904px) {
  .xl5-custom {
    width: 20%;
    max-width: 20%;
    flex-basis: 20%;
  }
}
</style>
