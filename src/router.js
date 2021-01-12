import Vue from "vue";
import Router from "vue-router";
import Dashboard from "./views/Dashboard.vue";
import Guests from "./views/Guests.vue";
import Tables from "./views/Tables.vue";
import Dietary from "./views/Dietary.vue";
import Floorplan from "./views/Floorplan.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { path: "/", name: "dashboard", component: Dashboard },
    { path: "/guests", name: "guests", component: Guests },
    { path: "/tables", name: "tables", component: Tables },
    { path: "/floorplan", name: "floorplan", component: Floorplan },
    { path: "/dietary", name: "dietary", component: Dietary },
    { path: "*", redirect: "/" },
  ],
});

export default router;
