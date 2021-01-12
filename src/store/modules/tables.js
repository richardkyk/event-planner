import json from "./data.json";

export const tables = {
  namespaced: true,
  state: {
    data: [...json.tables],
  },
  getters: {
    tableGuests: (state, getters, rootState) => (id) => {
      const index = state.data.findIndex((table) => table.id == id);
      if (index != -1) {
        return state.data[index].guests.map((guestId) => {
          return rootState.guests.data.find((guest) => guest.id == guestId);
        });
      } else return [];
    },
    byId: (state) => (id) => {
      return state.data.find((table) => table.id == id);
    },
    sortedTables: (state) => {
      return Object.values(state.data).sort((a, b) => a.tableNum - b.tableNum);
    },
  },
  mutations: {
    SET_TABLE: (state, payload) => {
      state.data.push(payload);
    },
    PATCH_TABLE: (state, payload) => {
      const index = state.data.findIndex((table) => table.id == payload.id);
      if (index >= 0) {
        const table = state.data[index];
        const newTable = Object.assign({}, table, payload);
        state.data.splice(index, 1, newTable);
      }
    },
    DELETE_TABLE: (state, id) => {
      const index = state.data.findIndex((table) => table.id == id);
      if (index != -1) {
        state.data.splice(index, 1);
      }
    },
  },
  actions: {
    set: (context, payload) => {
      context.commit("SET_TABLE", payload);
    },
    patch: (context, payload) => {
      context.commit("PATCH_TABLE", payload);
    },
    delete: (context, payload) => {
      context.commit("DELETE_TABLE", payload);
    },
  },
};
