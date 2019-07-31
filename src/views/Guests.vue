<template>
  <div class="home">
    <v-container class="my-5">
      <v-layout row class="mb-3" wrap>
        <v-btn small flat color="grey" @click="sortBy('name')">
          <v-icon left small>person</v-icon>
          <span class="caption">By name</span>
        </v-btn>
        <v-btn small flat color="grey" @click="sortBy('tableNum')">
          <v-icon left small>local_dining</v-icon>
          <span class="caption">By table</span>
        </v-btn>
        <v-btn small flat color="grey" @click="sortBy('dietary')">
          <v-icon left small>restaurant</v-icon>
          <span class="caption">Dietary Selection</span>
        </v-btn>
        <v-btn small flat color="grey" @click="sortBy('accom')">
          <v-icon left small>hotel</v-icon>
          <span class="caption">By accomodation</span>
        </v-btn>
        <v-btn small flat color="grey" @click="sortBy('flight')">
          <v-icon left small>airplanemode_active</v-icon>
          <span class="caption">By flight</span>
        </v-btn>
        <v-btn small flat color="grey" @click="sortBy('rsvp')">
          <v-icon left small>how_to_reg</v-icon>
          <span class="caption">By rsvp</span>
        </v-btn>
        <v-spacer></v-spacer>

        <v-btn small flat color="grey" @click="download">
          <v-icon left small>cloud_download</v-icon>
          <span class="caption">Export Data</span>
        </v-btn>
      </v-layout>

      <v-card color="white" flat v-for="guest in sortedGuests" :key="guest.id">
        <v-layout row wrap :class="`pa-3 guest ${guest.rsvp}`">
          <v-flex xs12 md3>
            <div class="caption grey--text">Name</div>
            <div>{{guest.name}}</div>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <div class="caption grey--text">Table</div>
            <div>{{guest.tableNum}}</div>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <div class="caption grey--text">Dietary Selection</div>
            <div>{{guest.dietary}}</div>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <div class="caption grey--text">Accommodation</div>
            <div v-if="guest.accom" :class="`${accomStatus(guest)}`">{{accomStatus(guest)}}</div>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <div class="caption grey--text">Flight</div>
            <div v-if="guest.flight" :class="`${flightStatus(guest)}`">{{flightStatus(guest)}}</div>
          </v-flex>
          <v-flex xs6 sm4 md1>
            <!-- So we can have Unsent, Sent, Accepted, Declined -->
            <div class="caption grey--text">RSVP</div>

            <v-menu>
              <!-- <v-icon slot="activator">restaurant</v-icon> -->

              <v-chip slot="activator" small>
                {{guest.rsvp}}
                <v-icon pr-3>arrow_drop_down</v-icon>
              </v-chip>
              <v-list>
                <v-list-tile
                  v-for="(item, i) in items"
                  :key="i"
                  :v-model="guest.rsvp"
                  @click="changeRSVP(guest, item)"
                >
                  <v-list-tile-title>{{ item }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>

            <!-- <v-combobox
              class="rsvp"
              v-model="guest.rsvp"
              :items="items"
              item-text="name"
              item-value="name"
              flat
              hide-selected
              solo
              small-chips
            >
              <template v-slot:selection="data">
                <v-chip small :selected="data.selected">{{ data.item }}&nbsp;</v-chip>
              </template>
            </v-combobox>-->

            <!-- <v-select
              class="rsvp"
              v-model="guest.rsvp"
              dense
              solo
              small-chips
              flat
              :items="items"
              height="20"
              item-value="rsvp"
              @change="changeRSVP(guest)"
            ></v-select>-->
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import XLSX from "xlsx";
import moment from "moment";

export default {
  data() {
    return {
      items: ["unsent", "sent", "accepted", "declined"],
      prop: "name"
    };
  },
  computed: {
    sortedGuests() {
      return this.$store.getters["guests/sortedGuests"](this.prop);
    },
    exportData() {
      const guests = this.$store.getters["guests/allGuests"]
        ? this.$store.getters["guests/allGuests"]
        : [];
      const data = [];
      guests.forEach(guest => {
        data.push({
          Name: guest.name,
          TableNumber: guest.tableNum,
          DietarySelection: guest.dietary,
          AccomStatus: guest.accom ? this.accomStatus(guest) : "",
          FlightStatus: guest.flight ? this.flightStatus(guest) : "",
          RSVP: guest.rsvp
        });
      });
      return data;
    }
  },
  methods: {
    flightStatus(guest) {
      return guest.flightId.length > 0 ? "assigned" : "unassigned";
    },
    accomStatus(guest) {
      return guest.accomId.length > 0 ? "assigned" : "unassigned";
    },
    changeRSVP(guest, item) {
      this.$store.dispatch("guests/patch", { id: guest.id, rsvp: item });
    },
    sortBy(prop) {
      this.prop = prop;
    },
    download() {
      const guestWS = XLSX.utils.json_to_sheet(this.exportData);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, guestWS);

      const date = moment().format("DD-MM-YYYY HH:mm");
      const name = `guests ${date}.xls`;
      XLSX.writeFile(wb, name);
    }
  }
};
</script>

<style>
.guest.accepted {
  border-left: 4px solid#79d279;
}

.guest.sent {
  border-left: 4px solid orange;
}

.guest.declined {
  border-left: 4px solid tomato;
}

.guest.unsent {
  border-left: 4px solid #3cd1c2;
}
.v-input__control .v-input__slot,
.v-text-field.v-text-field--solo .v-input__control {
  /* height: 0px; */
  min-height: 15px !important;
  /* padding-top: 3px !important; */
  display: flex !important;
  align-items: center !important;
}

.rsvp {
  height: 0px;
}
.rsvp .v-input__control .v-input__slot {
  padding: 0 0px !important;
  cursor: pointer;
}

.guest.accepted .v-chip {
  background: #79d279;
  color: white;
}
.guest.sent .v-chip {
  background: orange;
  color: white;
}
.guest.declined .v-chip {
  background: tomato;
  color: white;
}
.guest.unsent .v-chip {
  background: #3cd1c2;
  color: white;
}
.unassigned {
  color: orange;
}
.assigned {
  color: #79d279;
}
</style>
