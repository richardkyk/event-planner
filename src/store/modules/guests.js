import json from "./data.json";

export const guests = {
  namespaced: true,
  state: {
    data: [...json.guests],
  },
  getters: {
    allGuests: (state) => {
      return Object.values(state.data);
    },
    sortedGuests: (state) => (prop) => {
      const sortOrders = {
        rsvp: { unsent: 1, sent: 2, accepted: 3, declined: 4 },
      };

      let sortedGuests = [];
      switch (prop) {
        case "rsvp":
          sortedGuests = Object.values(state.data).sort((a, b) => {
            return sortOrders[prop][a[prop]] - sortOrders[prop][b[prop]];
          });
          break;
        default:
          sortedGuests = Object.values(state.data).sort((a, b) =>
            a[prop] < b[prop] ? -1 : 1
          );
          break;
      }
      return sortedGuests;
    },
  },
  mutations: {
    SET_GUEST: (state, payload) => {
      state.data.push(payload);
    },
    PATCH_GUEST: (state, payload) => {
      const index = state.data.findIndex((guest) => guest.id == payload.id);
      if (index != -1) {
        const guest = state.data[index];
        const newGuest = Object.assign({}, guest, payload);
        state.data.splice(index, 1, newGuest);
      }
    },
    DELETE_GUEST: (state, id) => {
      const index = state.data.findIndex((guest) => guest.id == id);
      if (index != -1) {
        state.data.splice(index, 1);
      }
    },
  },
  actions: {
    set(context, payload) {
      context.commit("SET_GUEST", payload);
    },
    patch(context, payload) {
      context.commit("PATCH_GUEST", payload);
    },
    delete(context, payload) {
      context.commit("DELETE_GUEST", payload);
    },
  },
};
