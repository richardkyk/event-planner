<template>
  <div class="table">
    <v-card flat class="mx-3 mb-3">
      <!-- This is the tool bar -->
      <v-toolbar color="indigo">
        <span class="white--text font-weight-thin display-2">{{table.id}}</span>
        <v-toolbar-title class="text-xs white--text font-weight-thin">{{table.desc}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon color="white">edit</v-icon>
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
                <v-icon>edit</v-icon>
              </v-flex>
              <v-flex text-xs-center>
                <v-icon @click="removeGuest(index)">delete</v-icon>
              </v-flex>
            </v-layout>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["table"],
  data() {
    return { name: "" };
  },
  methods: {
    addGuest() {
      // console.log(this.table.id);
      let payload = { type: "add", id: this.table.id, value: this.name };
      this.$emit("updateGuest", payload);
      this.name = "";
    },
    removeGuest(index) {
      // console.log(this.table.id, index);
      let payload = { type: "remove", id: this.table.id, value: index };
      this.$emit("updateGuest", payload);
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