const tables = {
  firestorePath: "tables",
  firestoreRefType: "collection", // or 'doc'
  moduleName: "tables",
  statePropName: "data",
  namespaced: true, // automatically added

  // this object is your store module (will be added as '/tables')
  // you can also add state/getters/mutations/actions
  state: {},
  getters: {
    tableGuests: (state, getters, rootState) => id => {
      return state.data[id].guests.map(guest => {
        return rootState.guests.data[guest];
      });
    },
    sortedTables: (state, getters) => {
      return Object.values(state.data).sort((a, b) => a.tableNum - b.tableNum);
    }
  },
  mutations: {},
  actions: {}
};

export default tables;
