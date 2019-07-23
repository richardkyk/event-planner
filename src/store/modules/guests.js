const guests = {
  firestorePath: "guests",
  firestoreRefType: "collection", // or 'doc'
  moduleName: "guests",
  statePropName: "data",
  namespaced: true, // automatically added

  // this object is your store module (will be added as '/guests')
  // you can also add state/getters/mutations/actions
  state: {
    data: {
      testicles: { name: "Im so lost dude", tableNum: "1", wtf: "lol" }
    }
  },
  getters: {
    getGuest(id) {
      state => {
        return state.data[id];
      };
    }
  },
  mutations: {},
  actions: {}
};

export default guests;
