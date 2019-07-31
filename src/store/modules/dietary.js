const dietary = {
  firestorePath: "dietary",
  firestoreRefType: "collection", // or 'doc'
  moduleName: "dietary",
  statePropName: "data",
  namespaced: true, // automatically added
  sync: {
    where: [["created_by", "==", "{userId}"]]
  },

  // this object is your store module (will be added as '/dietary')
  // you can also add state/getters/mutations/actions
  state: {},
  getters: {
    options: state => {
      return Object.values(state.data)[0] ? Object.values(state.data)[0] : {};
    }
  },
  mutations: {},
  actions: {}
};

export default dietary;
