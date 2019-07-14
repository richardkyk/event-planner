<template>
  <div class="table">
    <v-card flat class="mx-3 mb-3">
      <!-- This is the tool bar -->
      <v-toolbar color="indigo">
        <span class="white--text font-weight-thin display-2">{{table.id}}</span>
        <v-toolbar-title class="text-xs white--text font-weight-thin">{{table.desc}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon @click.stop="openTableModal(table.desc)" color="white">edit</v-icon>
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

      <!-- The list of guests with the expansion -->
      <v-list>
        <v-list-group v-for="(guest, index) in table.guests" :key="index" no-action>
          <template v-slot:activator>
            <v-list-tile>
              <v-layout row>
                <v-flex xs2 text-xs-center>
                  <v-list-tile-title>{{index+1}}</v-list-tile-title>
                </v-flex>
                <v-flex xs10>
                  <v-list-tile-title>{{ guest.name }}</v-list-tile-title>
                </v-flex>
              </v-layout>
            </v-list-tile>
          </template>

          <!-- The expansion icons for flight, accomodation, edit and delete -->
          <v-list-tile>
            <v-layout row>
              <v-flex text-xs-center>
                <v-icon>airplanemode_active</v-icon>
              </v-flex>
              <v-flex text-xs-center>
                <v-icon>home</v-icon>
              </v-flex>
              <v-flex text-xs-center>
                <v-icon @click.stop="openModal(index, guest.name)">edit</v-icon>
              </v-flex>
              <v-flex text-xs-center>
                <v-icon @click="removeGuest(index)">delete</v-icon>
              </v-flex>
            </v-layout>
          </v-list-tile>
        </v-list-group>

        <!-- This is the popup dialog for editing the table description -->
        <v-dialog persistent v-model="tableModal" max-width="300px">
          <v-card>
            <v-text-field
              class="mx-3"
              ref="tableText"
              v-model="tableModalDesc"
              v-on:keyup.enter="editTable"
            ></v-text-field>
            <v-layout row justify-space-between>
              <v-card-actions>
                <v-btn flat color="primary" @click.stop="tableModal = false">Close</v-btn>
              </v-card-actions>
              <v-card-actions>
                <v-btn flat color="primary" @click.stop="editTable()">Submit</v-btn>
              </v-card-actions>
            </v-layout>
          </v-card>
        </v-dialog>

        <!-- This is the popup dialog for editing the guests -->
        <v-dialog persistent v-model="guestModal" max-width="300px">
          <v-card>
            <v-text-field
              class="mx-3"
              ref="guestText"
              v-model="guestModalName"
              v-on:keyup.enter="editGuest"
            ></v-text-field>
            <v-layout row justify-space-between>
              <v-card-actions>
                <v-btn flat color="primary" @click.stop="guestModal = false">Close</v-btn>
              </v-card-actions>
              <v-card-actions>
                <v-btn flat color="primary" @click.stop="editGuest()">Submit</v-btn>
              </v-card-actions>
            </v-layout>
          </v-card>
        </v-dialog>
      </v-list>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["table"],
  data() {
    return {
      name: "",
      tableModal: false,
      tabbleModalDesc: "",
      guestModal: false,
      guestModalName: "",
      guestModalIndex: null
    };
  },
  methods: {
    addGuest() {
      // console.log(this.table.id);
      let data = { id: this.table.id, name: this.name };
      let payload = { type: "addGuest", data };
      this.$emit("updateTable", payload);
      this.name = "";
    },
    removeGuest(index) {
      // console.log(this.table.id, index);
      let data = { id: this.table.id, index };
      let payload = { type: "removeGuest", data };
      this.$emit("updateTable", payload);
    },
    openModal(index, name) {
      this.guestModalIndex = index;
      this.guestModalName = name;
      this.guestModal = true;
      this.$nextTick(this.$refs.guestText.focus);
    },
    openTableModal(desc) {
      this.tableModalDesc = desc;
      this.tableModal = true;
      this.$nextTick(this.$refs.tableText.focus);
    },
    editTable() {
      let data = { id: this.table.id, desc: this.tableModalDesc };
      let payload = { type: "editTable", data };
      this.$emit("updateTable", payload);
      this.tableModal = false;
    },
    editGuest() {
      let data = {
        id: this.table.id,
        index: this.guestModalIndex,
        name: this.guestModalName
      };
      let payload = { type: "editGuest", data };
      this.$emit("updateTable", payload);
      this.guestModal = false;
    }
  }
};
</script>

<style>
.v-list__tile {
  height: 32px;
}
.v-messages {
  min-height: 0px;
}
.v-list__group__items--no-action .v-list__tile {
  padding-left: 16px;
}
</style>