<template>
  <nav>
    <v-app-bar flat app>
      <v-app-bar-nav-icon
        class="grey--text"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-light">Guest</span>
        <span>App</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="signOut" text color="grey">
        <span>Sign Out</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary app class="indigo">
      <v-col col align="center">
        <v-flex class="mt-5">
          <v-avatar size="175">
            <img src="/katanddan2.jpg" />
          </v-avatar>
        </v-flex>
      </v-col>
      <v-list nav dense class="mt-4 mx-4">
        <v-list-item
          v-for="link in links"
          :key="link.text"
          router
          :to="link.route"
        >
          <v-layout row>
            <v-list-item-action>
              <v-icon class="white--text">{{ link.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title
                class="white--text subheading font-weight-light"
                >{{ link.text }}</v-list-item-title
              >
            </v-list-item-content>
          </v-layout>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { Firebase } from "@/firebase";

export default {
  data() {
    return {
      drawer: false,
      links: [
        { icon: "dashboard", text: "Dashboard", route: "/" },
        { icon: "group", text: "Guests", route: "/guests" },
        { icon: "local_dining", text: "Tables", route: "/tables" },
        { icon: "map", text: "Floorplan", route: "/floorplan" },
        { icon: "airplanemode_active", text: "Flights", route: "/flights" },
        { icon: "hotel", text: "Accomodation", route: "/accommodation" },
        { icon: "restaurant", text: "Dietary Options", route: "/dietary" }
      ]
    };
  },
  methods: {
    signOut() {
      localStorage.removeItem("token");
      this.$store.dispatch("setAuth", false);
      Firebase.auth()
        .signOut()
        .then(() => {
          this.$router.push("/login");
        })
        .catch(() => {
          this.$router.push("/login");
        });
    }
  }
};
</script>
