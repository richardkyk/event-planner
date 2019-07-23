<template>
  <div class="table">
    <v-card flat class="mx-3 mb-3">
      <!-- This is the tool bar -->
      <v-toolbar color="indigo">
        <span class="white--text font-weight-thin display-2">{{table.tableNum}}</span>
        <v-toolbar-title class="text-xs white--text font-weight-thin">{{table.desc}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon @click.stop="editTable(table)" color="white">edit</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- This is the textfield for the guest's name -->
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            class="mx-3"
            label="Guest's name"
            v-model="name"
            v-on:keyup.enter="addGuest"
          ></v-text-field>
        </v-flex>
      </v-layout>

      <!-- The expansion panel for the guests -->
      <v-list>
        <v-list-group v-for="(guest, index) in tableGuests" :key="index" no-action>
          <template v-slot:activator>
            <v-list-tile>
              <v-layout row>
                <v-flex xs1 text-xs-center mr-1>
                  <v-list-tile-title>{{index+1}}</v-list-tile-title>
                </v-flex>
                <v-flex>
                  <v-list-tile-title>{{ guest.name }}</v-list-tile-title>
                </v-flex>
                <v-spacer></v-spacer>
                <v-icon v-if="guest.flight">flight</v-icon>
                <v-icon v-if="guest.accom">hotel</v-icon>
              </v-layout>
            </v-list-tile>
          </template>

          <!-- The icons for flight, accomodation, edit and delete -->
          <v-list-tile>
            <v-layout row>
              <v-flex text-xs-center>
                <v-icon @click="toggleIcon(guest.id, 'flight', !guest.flight)">airplanemode_active</v-icon>
              </v-flex>
              <v-flex text-xs-center>
                <v-icon @click="toggleIcon(guest.id, 'accom', !guest.accom)">hotel</v-icon>
              </v-flex>
              <v-flex text-xs-center>
                <v-icon @click.stop="editTable(guest)">edit</v-icon>
              </v-flex>
              <v-flex text-xs-center>
                <v-icon @click="removeGuest(guest.id)">delete</v-icon>
              </v-flex>
            </v-layout>
          </v-list-tile>
        </v-list-group>

        <EditTablePopup ref="tablePopup" />
      </v-list>
    </v-card>
  </div>
</template>

<script>
import EditTablePopup from "@/components/EditTablePopup";
import Vue from "vue";
import UUID from "vue-uuid";

Vue.use(UUID);

export default {
  components: { EditTablePopup },
  props: ["table"],
  data() {
    return {
      name: ""
    };
  },
  computed: {
    tableGuests() {
      return this.$store.getters["tables/tableGuests"](this.table.id);
    }
  },
  methods: {
    editTable(data) {
      this.$refs.tablePopup.open(data);
    },
    addGuest() {
      const id = this.$store.getters["guests/dbRef"].doc().id;
      const tableId = this.table.id;
      const guestData = {
        id,
        tableNum: this.table.tableNum,
        tableId,
        name: this.name,
        flight: false,
        accom: false,
        rsvp: "unsent",
        flightId: []
      };
      this.$store.dispatch("guests/set", guestData);

      const tableGuests = this.$store.state.tables.data[tableId].guests;
      tableGuests.push(id);

      this.$store.dispatch("tables/patch", {
        id: tableId,
        guests: tableGuests
      });
      this.name = "";
    },
    removeGuest(id) {
      const tableId = this.table.id;
      const tableGuests = this.$store.state.tables.data[tableId].guests.filter(
        guest => guest != id
      );
      this.$store.dispatch("tables/patch", {
        id: tableId,
        guests: tableGuests
      });
      this.$store.dispatch("guests/delete", id);
    },
    toggleIcon(id, type, value) {
      const data = {
        id,
        [type]: value
      };
      this.$store.dispatch("guests/patch", data);
    }
  }
};
</script>

<style>
.v-list__tile {
  height: 32px;
  padding-right: 0px;
}
.v-messages {
  min-height: 0px;
}
.v-list__group__items--no-action .v-list__tile {
  padding-left: 16px;
}

.v-list__group__header__append-icon {
  padding-left: 0px !important;
}
</style>