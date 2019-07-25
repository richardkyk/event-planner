const accommodations = {
  firestorePath: "accommodations",
  firestoreRefType: "collection", // or 'doc'
  moduleName: "accommodations",
  statePropName: "data",
  namespaced: true, // automatically added

  // this object is your store module (will be added as '/accommodations')
  // you can also add state/getters/mutations/actions
  state: {},
  getters: {
    accommodations: (state, getters) => {
      return Object.values(state.data).sort(
        (a, b) => a.checkInTimestamp - b.checkInTimestamp
      );
    },
    accomGuests: (state, getters, rootState) => id => {
      return state.data[id].guests.map(guest => {
        return rootState.guests.data[guest];
      });
    }
  },
  mutations: {},
  actions: {}
};

export default accommodations;
