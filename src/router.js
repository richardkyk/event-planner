import Vue from "vue";
import Router from "vue-router";
import Dashboard from "./views/Dashboard.vue";
import Guests from "./views/Guests.vue";
import Tables from "./views/Tables.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: Dashboard
    },
    {
      path: "/guests",
      name: "guests",
      component: Guests
    },
    { path: "/tables", name: "tables", component: Tables }
  ]
});
