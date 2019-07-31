import Vue from "vue";
import Router from "vue-router";
import Dashboard from "./views/Dashboard.vue";
import Guests from "./views/Guests.vue";
import Tables from "./views/Tables.vue";
import Flights from "./views/Flights.vue";
import Accommodation from "./views/Accommodation.vue";
import Dietary from "./views/Dietary.vue";
import Login from "./views/Login.vue";
import store from "./store";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { path: "/", name: "dashboard", component: Dashboard },
    { path: "/guests", name: "guests", component: Guests },
    { path: "/tables", name: "tables", component: Tables },
    { path: "/flights", name: "flights", component: Flights },
    { path: "/accommodation", name: "accommodation", component: Accommodation },
    { path: "/dietary", name: "dietary", component: Dietary },
    { path: "/login", name: "login", component: Login },
    { path: "*", redirect: "/login" }
  ]
});

router.beforeEach((to, from, next) => {
  if (store.getters["authState"] && to.name === "login") {
    next("/");
  }

  if (!store.getters["authState"]) {
    if (to.fullPath !== "/login") {
      next("/login");
    }
  } else {
    next(false);
  }

  next();
});

export default router;
