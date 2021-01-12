import Vue from "vue";
import Vuex from "vuex";
import { guests } from "./modules/guests";
import { tables } from "./modules/tables";
import { dietary } from "./modules/dietary";

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    guests,
    tables,
    dietary,
  },
});
