<template>
  <div class="table">
    <v-card flat elevation="5">
      <!-- This is the tool bar -->
      <v-toolbar color="indigo">
        <v-row no-gutters justify="space-between">
          <v-col cols="2" align-self="center" class="text-center mr-1">
            <span class="display-1 white--text font-weight-thin">{{
              table.tableNum
            }}</span>
          </v-col>
          <v-col cols="8" align-self="center">
            <v-toolbar-title class="subheading white--text font-weight-thin">{{
              table.desc
            }}</v-toolbar-title>
          </v-col>
          <v-col cols="1" align-self="center">
            <!-- <v-btn icon> -->
            <v-icon @click.stop="editTable(table)" color="white">edit</v-icon>
            <!-- </v-btn> -->
          </v-col>
        </v-row>
      </v-toolbar>

      <!-- This is the textfield for the guest's name -->
      <v-row no-gutters>
        <v-col cols="12">
          <v-text-field
            class="mx-5"
            label="Guest's name"
            v-model="name"
            v-on:keyup.enter="addGuest"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- The expansion panel for the guests -->
      <v-list two-line>
        <draggable
          v-model="tableGuests"
          v-bind="{ group: 'people' }"
          style="min-height: 200px"
        >
          <v-list-group
            v-for="(guest, index) in tableGuests"
            :key="index"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-row no-gutters>
                  <v-col cols="1" class="text-center mr-2">
                    <v-list-item-title>{{ index + 1 }}</v-list-item-title>
                  </v-col>
                  <v-col cols="8">
                    <v-list-item-title class="text-truncate">{{
                      guest.name
                    }}</v-list-item-title>

                    <v-list-item-subtitle>{{
                      guest.dietary
                    }}</v-list-item-subtitle>
                  </v-col>
                </v-row>
              </v-list-item-content>
            </template>
            <!-- The icons for diet, edit and delete -->
            <v-list-item>
              <v-row no-gutters>
                <!-- Dietary options -->
                <v-col text-xs-center>
                  <v-menu>
                    <template v-slot:activator="{ on: menu }">
                      <v-icon v-on="menu">restaurant</v-icon>
                    </template>

                    <v-list v-if="dietary.length > 0">
                      <v-list-item
                        v-for="(item, i) in dietary"
                        :key="i"
                        :v-model="guest.dietary"
                        @click="selectDietary(guest, item)"
                      >
                        <v-list-item-title>{{ item }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                    <v-list v-else>
                      <v-list-item>Please add some dietary options</v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>
                <!-- Edit guest name -->
                <v-col text-xs-center>
                  <v-icon @click.stop="editGuest(guest)">edit</v-icon>
                </v-col>
                <!-- Delete guest -->
                <v-col text-xs-center>
                  <v-icon @click="removeGuest(guest)">delete</v-icon>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list-group>
        </draggable>
      </v-list>
    </v-card>
    <TablePopup ref="tablePopup" />
    <GuestPopup ref="guestPopup" />
  </div>
</template>

<script>
import draggable from "vuedraggable";
import TablePopup from "@/components/TablePopup";
import GuestPopup from "@/components/GuestPopup";
import { uuidv4 } from "@/utility/helpers";

export default {
  components: { TablePopup, draggable, GuestPopup },
  props: ["table"],
  data() {
    return {
      name: "",
    };
  },
  computed: {
    tableGuests: {
      get() {
        return this.$store.getters["tables/tableGuests"](this.table.id);
      },
      set(value) {
        const guestIdChange = value
          .filter((guest) => guest.tableId != this.table.id)
          .map((guest) => guest.id);

        guestIdChange.map((id) => {
          const payload = {
            id,
            tableNum: this.table.tableNum,
            tableId: this.table.id,
          };
          this.$store.dispatch("guests/patch", payload);
        });

        const tablePayload = {
          id: this.table.id,
          guests: value.map((guest) => guest.id),
        };
        this.$store.dispatch("tables/patch", tablePayload);
      },
    },
    dietary() {
      return this.$store.getters["dietary/options"];
    },
  },
  methods: {
    editTable(data) {
      this.$refs.tablePopup.open(data);
    },
    editGuest(data) {
      this.$refs.guestPopup.open(data);
    },

    addGuest() {
      const id = uuidv4();
      const tableId = this.table.id;
      const table = this.$store.getters["tables/byId"](tableId);
      const guestData = {
        checkin: false,
        dietary: "",
        gift: "",
        id,
        name: this.name.trim(),
        rsvp: "unsent",
        tableId,
        tableNum: this.table.tableNum,
        time: "",
      };
      this.$store.dispatch("guests/set", guestData);
      this.$store.dispatch("tables/patch", {
        id: tableId,
        guests: [...table.guests, guestData.id],
      });
      this.name = "";
    },
    removeGuest(guest) {
      const tableId = this.table.id;
      const table = this.$store.getters["tables/byId"](tableId);
      const guestIndex = table.guests.findIndex(
        (guestId) => guestId == guest.id
      );
      if (guestIndex != -1) {
        table.guests.splice(guestIndex, 1);
      }
      this.$store.dispatch("tables/patch", {
        id: tableId,
        guests: [...table.guests],
      });

      this.$store.dispatch("guests/delete", guest.id);
    },
    toggleIcon(guest, type, value) {
      const data = {
        id: guest.id,
        [type]: value,
      };
      this.$store.dispatch("guests/patch", data);
    },
    selectDietary(guest, item) {
      this.$store.dispatch("guests/patch", { id: guest.id, dietary: item });
    },
  },
};
</script>
<style lang="stylus" scoped>
>>> .v-list--two-line .v-list-item {
  height: 50px;
  min-height: 50px !important;
}

>>> .v-text-field .v-input__control {
  height: 35px;
}

>>> .v-list-group {
  .v-list-group__header, .v-list-item__icon.v-list-group__header__append-icon {
    min-width: 0;
  }
}
</style>

<style>
.v-application--is-ltr .v-list-item__action:last-of-type:not(:only-child),
.v-application--is-ltr .v-list-item__avatar:last-of-type:not(:only-child),
.v-application--is-ltr .v-list-item__icon:last-of-type:not(:only-child) {
  margin-left: 0px !important;
}
</style>
