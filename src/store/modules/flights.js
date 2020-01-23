const flights = {
  firestorePath: "flights",
  firestoreRefType: "collection", // or 'doc'
  moduleName: "flights",
  statePropName: "data",
  namespaced: true, // automatically added
  sync: {
    where: [["created_by", "==", "{userId}"]]
  },

  // this object is your store module (will be added as '/flights')
  // you can also add state/getters/mutations/actions
  state: {},
  getters: {
    all: state => {
      return Object.values(state.data);
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
