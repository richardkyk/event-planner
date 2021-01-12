<template>
  <nav>
    <v-app-bar flat app color="#fafafa">
      <v-app-bar-nav-icon
        class="grey--text"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-light">Guest</span>
        <span>App</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary app class="indigo">
      <v-col col align="center">
        <v-flex class="mt-5">
          <v-avatar size="175">
            <img src="../assets/image.jpg" />
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
          <v-list-item-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title
              class="white--text subheading font-weight-light"
              >{{ link.text }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
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
        { icon: "group", text: "Guests", route: "/guests" },
        { icon: "local_dining", text: "Tables", route: "/tables" },
        { icon: "map", text: "Floorplan", route: "/floorplan" },
        { icon: "restaurant", text: "Dietary Options", route: "/dietary" },
      ],
    };
  },
  methods: {},
};
</script>
