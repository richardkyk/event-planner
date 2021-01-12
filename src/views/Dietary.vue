<template>
  <div class="dietary">
    <v-container class="my-5" fluid>
      <v-row>
        <v-col xs12 sm6 md4 lg3>
          <v-btn
            @click="addInitial()"
            v-if="options.length === 0"
            small
            text
            color="grey"
          >
            <v-icon left small>add</v-icon>
            <span>Add Dietary Options</span>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="12" md="6" lg="4" xl="3">
          <v-card elevation="5" class="mx-3 mb-3" v-if="options.length > 0">
            <!-- This is the tool bar -->
            <v-toolbar color="indigo">
              <v-icon color="white">restaurants</v-icon>
              <v-toolbar-title class="text-xs white--text font-weight-thin"
                >Dietary Options</v-toolbar-title
              >
              <v-spacer></v-spacer>
            </v-toolbar>

            <!-- This is the textfield for the dietary req -->
            <v-row no-gutters>
              <v-col cols="12">
                <v-text-field
                  class="mx-3"
                  label="Dietary requirements"
                  v-model="diet"
                  v-on:keyup.enter="addDietary"
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- The expansion panel for the guests -->
            <v-list>
              <v-list-group
                v-for="(diet, index) in options"
                :key="index"
                no-action
              >
                <template v-slot:activator>
                  <v-list-item>
                    <v-row no-gutters>
                      <v-col cols="2" class="text-left">
                        <v-list-item-title>{{ index + 1 }}</v-list-item-title>
                      </v-col>
                      <v-col cols="10">
                        <v-list-item-title>{{ diet }}</v-list-item-title>
                      </v-col>
                    </v-row>
                  </v-list-item>
                </template>

                <!-- The icons for delete -->
                <v-list-item>
                  <v-row class="text-center">
                    <!-- Delete diet -->
                    <v-col v-if="diet != ''">
                      <v-icon @click="deleteDietary(diet)">delete</v-icon>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-list-group>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { uuidv4 } from "@/utility/helpers";
export default {
  data() {
    return {
      id: null,
      diet: "",
      options: [],
    };
  },
  mounted() {
    this.options = this.$store.getters["dietary/options"];
  },
  methods: {
    addInitial() {
      this.options.push("");
      this.id = uuidv4();
      this.$store.dispatch("dietary/set", {
        id: this.id,
        options: [""],
      });
    },
    addDietary() {
      this.options.push(this.diet);
      this.$store.dispatch("dietary/patch", {
        id: this.id,
        options: [...this.options],
      });
      this.diet = "";
    },
    deleteDietary(diet) {
      const index = this.options.findIndex((d) => d == diet);
      this.options.splice(index, 1);
      this.$store.dispatch("dietary/patch", {
        id: this.id,
        options: [...this.options],
      });
    },
    dietary() {
      this.options = this.$store.getters["dietary/options"];
      this.id =
        this.$store.state.dietary.data.length == 1
          ? this.$store.state.dietary.id
          : null;
    },
  },
};
</script>

<style lang="stylus" scoped>
.v-application--is-ltr .v-list-group--no-action > .v-list-group__items > div > .v-list-item {
  padding-left: 0px !important;
}

>>> .v-text-field .v-input__control {
  height: 35px;
}
</style>
