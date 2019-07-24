const flights = {
  firestorePath: "flights",
  firestoreRefType: "collection", // or 'doc'
  moduleName: "flights",
  statePropName: "data",
  namespaced: true, // automatically added

  // this object is your store module (will be added as '/flights')
  // you can also add state/getters/mutations/actions
  state: {},
  getters: {
    arrivals: (state, getters) => {
      return Object.values(state.data)
        .filter(flight => flight.arrival == true)
        .sort((a, b) => a.flightTimestamp - b.flightTimestamp);
    },
    departures: (state, getters) => {
      return Object.values(state.data)
        .filter(flight => flight.arrival == false)
        .sort((a, b) => a.flightTimestamp - b.flightTimestamp);
    },
    flightGuests: (state, getters, rootState) => id => {
      return state.data[id].guests.map(guest => {
        return rootState.guests.data[guest];
      });
    }
  },
  mutations: {},
  actions: {}
};

export default flights;
