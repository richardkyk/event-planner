import json from "./data.json";

export const dietary = {
  namespaced: true,
  state: {
    data: [...json.dietary],
  },
  getters: {
    options: (state) => {
      return state.data.length > 0 ? state.data[0].options : [];
      // return Object.values(state.data)[0] ? Object.values(state.data)[0] : {};
    },
  },
  mutations: {
    SET_DIETARY: (state, payload) => {
      state.data.push(payload);
    },
    PATCH_DIETARY: (state, payload) => {
      const index = state.data.findIndex((dietary) => dietary.id == payload.id);
      if (index >= 0) {
        const dietary = state.data[index];
        const newDietary = Object.assign({}, dietary, payload);
        state.data.splice(index, 1, newDietary);
      }
    },
    DELETE_DIETARY: (state, id) => {
      const index = state.data.findIndex((dietary) => dietary.id == id);
      if (index != -1) {
        state.data.splice(index, 1);
      }
    },
  },
  actions: {
    set: (context, payload) => {
      console.log(payload);
      context.commit("SET_DIETARY", payload);
    },
    patch: (context, payload) => {
      context.commit("PATCH_DIETARY", payload);
    },
    delete: (context, payload) => {
      context.commit("DELETE_DIETARY", payload);
    },
  },
};
