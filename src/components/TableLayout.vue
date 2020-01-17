<template>
  <div class="table">
    <v-card flat class="mx-3 mb-3">
      <!-- This is the tool bar -->
      <v-toolbar color="indigo">
        <span class="white--text font-weight-thin display-2">{{
          table.tableNum
        }}</span>
        <v-toolbar-title class="text-xs white--text font-weight-thin">{{
          table.desc
        }}</v-toolbar-title>
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
      <v-list two-line>
        <draggable
          v-model="tableGuests"
          v-bind="{ group: 'people' }"
          style="min-height: 150px"
        >
          <v-list-group
            v-for="(guest, index) in tableGuests"
            :key="index"
            no-action
          >
            <template v-slot:activator>
              <v-list-tile>
                <v-layout row>
                  <v-flex xs1 text-xs-center mr-1>
                    <v-list-tile-title>{{ index + 1 }}</v-list-tile-title>
                  </v-flex>
                  <v-flex>
                    <v-list-tile-title>{{ guest.name }}</v-list-tile-title>

                    <v-list-tile-sub-title>{{
                      guest.dietary
                    }}</v-list-tile-sub-title>
                  </v-flex>
                  <v-spacer></v-spacer>
                  <v-icon v-if="guest.flight">flight</v-icon>
                  <v-icon v-if="guest.accom">hotel</v-icon>
                </v-layout>
              </v-list-tile>
            </template>
            <!-- </draggable> -->
            <!-- The icons for flight, accomodation, edit and delete -->
            <v-list-tile>
              <v-layout row>
                <!-- Toggle flight -->
                <v-flex text-xs-center>
                  <v-icon @click="toggleIcon(guest, 'flight', !guest.flight)"
                    >airplanemode_active</v-icon
                  >
                </v-flex>
                <!-- Toggle accommodation -->
                <v-flex text-xs-center>
                  <v-icon @click="toggleIcon(guest, 'accom', !guest.accom)"
                    >hotel</v-icon
                  >
                </v-flex>

                <!-- Dietary options -->
                <v-flex text-xs-center>
                  <v-menu>
                    <v-icon slot="activator">restaurant</v-icon>

                    <v-list v-if="dietary.length > 0">
                      <v-list-tile
                        v-for="(item, i) in dietary"
                        :key="i"
                        :v-model="guest.dietary"
                        @click="selectDietary(guest, item)"
                      >
                        <v-list-tile-title>{{ item }}</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                    <v-list v-else>
                      <v-list-tile>Please add some dietary options</v-list-tile>
                    </v-list>
                  </v-menu>
                </v-flex>
                <!-- Edit guest name -->
                <v-flex text-xs-center>
                  <v-icon @click.stop="editTable(guest)">edit</v-icon>
                </v-flex>
                <!-- Delete guest -->
                <v-flex text-xs-center>
                  <v-icon @click="removeGuest(guest)">delete</v-icon>
                </v-flex>
              </v-layout>
            </v-list-tile>
          </v-list-group>
          <TablePopup ref="tablePopup" />
        </draggable>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import TablePopup from "@/components/TablePopup";
import { arrayUnion, arrayRemove } from "vuex-easy-firestore";

export default {
  components: { TablePopup, draggable },
  props: ["table"],
  data() {
    return {
      name: ""
    };
  },
  computed: {
    tableGuests: {
      get() {
        return this.$store.getters["tables/tableGuests"](this.table.id);
      },
      set(value) {
        const guestIdChange = value
          .filter(guest => guest.tableId != this.table.id)
          .map(guest => guest.id);

        guestIdChange.map(id => {
          const payload = {
            id,
            tableNum: this.table.tableNum,
            tableId: this.table.id
          };
          this.$store.dispatch("guests/patch", payload);
        });

        const tablePayload = {
          id: this.table.id,
          guests: value.map(guest => guest.id)
        };
        this.$store.dispatch("tables/patch", tablePayload);
      }
    },
    dietary() {
      return this.$store.getters["dietary/options"].options
        ? this.$store.getters["dietary/options"].options
        : [];
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
        flightId: [],
        accomId: [],
        dietary: ""
      };
      this.$store.dispatch("guests/set", guestData);
      this.$store.dispatch("tables/patch", {
        id: tableId,
        guests: arrayUnion(id)
      });
      this.name = "";
    },
    removeGuest(guest) {
      const tableId = this.table.id;
      this.$store.dispatch("tables/patch", {
        id: tableId,
        guests: arrayRemove(guest.id)
      });

      if (guest.accomId) {
        guest.accomId.forEach(accomId =>
          this.$store.dispatch("accommodations/patch", {
            id: accomId,
            guests: arrayRemove(guest.id)
          })
        );
      }

      if (guest.flightId) {
        guest.flightId.forEach(flightId =>
          this.$store.dispatch("flights/patch", {
            id: flightId,
            guests: arrayRemove(guest.id)
          })
        );
      }

      this.$store.dispatch("guests/delete", guest.id);
    },
    toggleIcon(guest, type, value) {
      const data = {
        id: guest.id,
        [type]: value
      };
      this.$store.dispatch("guests/patch", data);
      if (type == "flight" && value == false) {
        guest.flightId.forEach(id => {
          this.$store.dispatch("flights/patch", {
            id,
            guests: arrayRemove(guest.id)
          });
        });
        this.$store.dispatch("guests/patch", { id: guest.id, flightId: [] });
      }

      if (type == "accom" && value == false) {
        guest.accomId.forEach(id => {
          this.$store.dispatch("accommodations/patch", {
            id,
            guests: arrayRemove(guest.id)
          });
        });
        this.$store.dispatch("guests/patch", {
          id: guest.id,
          accomId: []
        });
      }
    },
    selectDietary(guest, item) {
      this.$store.dispatch("guests/patch", { id: guest.id, dietary: item });
    }
  }
};
</script>

<style>
.v-list--two-line .v-list__tile {
  height: 50px;
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
