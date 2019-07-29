<template>
  <div class="dietary">
    <v-container class="my-5">
      <v-layout row ml-3>
        <v-flex xs12 sm6 md4 lg3>
          <v-btn @click="addInitial()" v-if="dietary().length === 0" small flat color="grey">
            <v-icon left small>add</v-icon>
            <span>Add Dietary Options</span>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout row ml-2>
        <v-flex xs12 sm6 md4 lg3>
          <v-card flat class="mx-3 mb-3" v-if="dietary().length > 0">
            <!-- This is the tool bar -->
            <v-toolbar color="indigo">
              <v-icon color="white">restaurants</v-icon>
              <v-toolbar-title class="text-xs white--text font-weight-thin">Dietary Options</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>

            <!-- This is the textfield for the guest's name -->
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  class="mx-3"
                  label="Dietary requirements"
                  v-model="diet"
                  v-on:keyup.enter="addDietary"
                ></v-text-field>
              </v-flex>
            </v-layout>

            <!-- The expansion panel for the guests -->
            <v-list>
              <v-list-group v-for="(diet, index) in dietary()" :key="index" no-action>
                <template v-slot:activator>
                  <v-list-tile>
                    <v-layout row>
                      <v-flex xs1 text-xs-center mr-1>
                        <v-list-tile-title>{{index+1}}</v-list-tile-title>
                      </v-flex>
                      <v-flex>
                        <v-list-tile-title>{{ diet }}</v-list-tile-title>
                      </v-flex>
                    </v-layout>
                  </v-list-tile>
                </template>

                <!-- The icons for delete -->
                <v-list-tile>
                  <v-layout row>
                    <!-- Delete diet -->
                    <v-flex text-xs-center v-if="diet != ''">
                      <v-icon @click="deleteDietary(diet)">delete</v-icon>
                    </v-flex>
                  </v-layout>
                </v-list-tile>
              </v-list-group>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { arrayUnion, arrayRemove } from "vuex-easy-firestore";
export default {
  data() {
    return {
      id: null,
      diet: ""
    };
  },
  methods: {
    addInitial() {
      this.$store.dispatch("dietary/set", {
        options: [""]
      });
    },
    addDietary() {
      this.$store.dispatch("dietary/set", {
        id: this.id,
        options: arrayUnion(this.diet)
      });
      this.diet = "";
    },
    deleteDietary(diet) {
      this.$store.dispatch("dietary/patch", {
        id: this.id,
        options: arrayRemove(diet)
      });
    },
    dietary() {
      const dietary = this.$store.getters["dietary/options"];
      this.id = dietary.id ? dietary.id : null;
      return dietary.options ? dietary.options : [];
    }
  }
};
</script>
