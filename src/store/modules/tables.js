const tables = {
  firestorePath: "tables",
  firestoreRefType: "collection", // or 'doc'
  moduleName: "tables",
  statePropName: "data",
  namespaced: true, // automatically added
  sync: {
    where: [["created_by", "==", "{userId}"]]
  },

  // this object is your store module (will be added as '/tables')
  // you can also add state/getters/mutations/actions
  state: {},
  getters: {
    tableGuests: (state, getters, rootState) => id => {
      if (state.data[id]) {
        return state.data[id].guests.map(guest => {
          return rootState.guests.data[guest];
        });
      } else return [];
    },
    sortedTables: state => {
      return Object.values(state.data).sort((a, b) => a.tableNum - b.tableNum);
    }
  },
  mutations: {},
  actions: {}
};

export default tables;
