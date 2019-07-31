import Vue from "vue";
import Vuex from "vuex";
import VuexEasyFirestore from "vuex-easy-firestore";
import { Firebase, initFirebase } from "@/firebase.js";
import guests from "./modules/guests";
import tables from "./modules/tables";
import flights from "./modules/flights";
import accommodations from "./modules/accommodations";
import dietary from "./modules/dietary";

Vue.use(Vuex);
// do the magic 🧙🏻‍♂️
const easyFirestore = VuexEasyFirestore(
  [guests, tables, flights, accommodations, dietary],
  {
    logging: true,
    FirebaseDependency: Firebase
  }
);

// include as PLUGIN in your vuex store
// please note that "myModule" should ONLY be passed via the plugin
const storeData = {
  plugins: [easyFirestore],
  state: {
    auth: !!localStorage.getItem("token")
  },
  getters: {
    authState: state => {
      return state.auth;
    }
  },
  mutations: {
    updateAuth: (state, value) => {
      state.auth = value;
    }
  },
  actions: {
    setAuth({ commit }, value) {
      commit("updateAuth", value);
    }
  }
};

// initialise Vuex
const store = new Vuex.Store(storeData);

// initFirebase
initFirebase().catch(error => {
  // take user to a page stating an error occurred
  // (might be a connection error, or the app is open in another tab)
  console.log(error);
});

// Be sure to initialise Firebase first!
Firebase.auth().onAuthStateChanged(user => {
  if (user) {
    localStorage.setItem("token", user);
    store.dispatch("setAuth", true);

    store.dispatch("guests/openDBChannel").catch(console.error);
    store.dispatch("tables/openDBChannel").catch(console.error);
    store.dispatch("flights/openDBChannel").catch(console.error);
    store.dispatch("accommodations/openDBChannel").catch(console.error);
    store.dispatch("dietary/openDBChannel").catch(console.error);
  } else {
    localStorage.removeItem("token");
    store.dispatch("setAuth", false);
    store
      .dispatch("guests/closeDBChannel", { clearModule: true })
      .catch(console.error);
    store
      .dispatch("tables/closeDBChannel", { clearModule: true })
      .catch(console.error);
    store
      .dispatch("flights/closeDBChannel", { clearModule: true })
      .catch(console.error);
    store
      .dispatch("accommodations/closeDBChannel", { clearModule: true })
      .catch(console.error);
    store
      .dispatch("dietary/closeDBChannel", { clearModule: true })
      .catch(console.error);
  }
});

export default store;
