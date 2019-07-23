const flights = {
  firestorePath: "flights",
  firestoreRefType: "collection", // or 'doc'
  moduleName: "flights",
  statePropName: "data",
  namespaced: true, // automatically added

  // this object is your store module (will be added as '/flights')
  // you can also add state/getters/mutations/actions
  state: {},
  getters: {},
  mutations: {},
  actions: {}
};

export default flights;
