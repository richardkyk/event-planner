<template>
  <nav>
    <v-toolbar flat app>
      <v-toolbar-side-icon class="grey--text" @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-light">Guest</span>
        <span>App</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat color="grey">
        <span>Sign Out</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" temporary app class="indigo">
      <v-layout column align-center>
        <v-flex class="mt-5">
          <v-avatar size="175">
            <img src="/katanddan2.jpg" />
          </v-avatar>
        </v-flex>
      </v-layout>
      <v-list class="mt-4">
        <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
          <v-layout row>
            <v-list-tile-action>
              <v-icon class="white--text">{{link.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="white--text subheading font-weight-light">{{link.text}}</v-list-tile-title>
            </v-list-tile-content>
          </v-layout>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>


<script>
export default {
  data() {
    return {
      drawer: false,
      links: [
        { icon: "dashboard", text: "Dashboard", route: "/" },
        { icon: "person", text: "Guests", route: "/guests" },
        { icon: "local_dining", text: "Tables", route: "/tables" }
      ]
    };
  }
};
</script>
