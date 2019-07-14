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
        <v-flex xs12 sm6 md4 lg3 v-for="table in tables" :key="table.id">
          <TableLayout v-bind:table="table" @updateTable="updateTable($event)" />
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
      tables: [
        {
          id: 1,
          desc: "Khaw familiy",
          guests: [
            { name: "Guest 1", flight: false, accom: false },
            { name: "Guest 2", flight: true, accom: true },
            { name: "Guest 3", flight: false, accom: true },
            { name: "Guest 4", flight: true, accom: false }
          ]
        },
        {
          id: 2,
          desc: "Random peeops",
          guests: [
            { name: "Guest a", flight: false, accom: false },
            { name: "Guest b", flight: false, accom: false }
          ]
        },
        {
          id: 3,
          desc: "Highschool",
          guests: [
            { name: "Guest World", flight: false, accom: false },
            { name: "Guest Hello", flight: false, accom: false }
          ]
        },
        { id: 4, desc: "Malaysia", guests: [] },
        { id: 5, desc: "", guests: [] },
        { id: 6, desc: "", guests: [] },
        { id: 7, desc: "", guests: [] }
      ]
    };
  },
  methods: {
    updateTable(payload) {
      let { data, type } = payload;
      switch (type) {
        case "addGuest": {
          let { id, name } = data;
          this.tables[id - 1].guests.push({
            name,
            flight: false,
            accom: false
          });
          break;
        }

        case "removeGuest": {
          let { id, index } = data;
          this.$delete(this.tables[id - 1].guests, index);
          break;
        }

        case "editGuest": {
          let { id, index, name } = data;
          this.tables[id - 1].guests[index].name = name;
          break;
        }

        case "editTable": {
          let { id, desc } = data;
          this.tables[id - 1].desc = desc;
          break;
        }

        case "flight": {
          let { id, index } = data;
          this.tables[id - 1].guests[index].flight = !this.tables[id - 1]
            .guests[index].flight;
          break;
        }
        case "accom": {
          let { id, index } = data;
          this.tables[id - 1].guests[index].accom = !this.tables[id - 1].guests[
            index
          ].accom;
          break;
        }

        default: {
          break;
        }
      }
    },
    addTable() {
      let newId =
        this.tables.length > 0 ? this.tables[this.tables.length - 1].id + 1 : 1;
      this.tables.push({ id: newId, desc: "", guests: [] });
    }
  }
};
</script>
