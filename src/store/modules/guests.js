const guests = {
  firestorePath: "guests",
  firestoreRefType: "collection", // or 'doc'
  moduleName: "guests",
  statePropName: "data",
  namespaced: true, // automatically added
  sync: {
    where: [["created_by", "==", "{userId}"]]
  },

  // this object is your store module (will be added as '/guests')
  // you can also add state/getters/mutations/actions
  state: {},
  getters: {
    allGuests: state => {
      return Object.values(state.data);
    },
    sortedGuests: state => prop => {
      const sortOrders = {
        flight: { true: 1, false: 2 },
        rsvp: { unsent: 1, sent: 2, accepted: 3, declined: 4 },
        accom: { true: 1, false: 2 }
      };

      let sortedGuests = [];
      switch (prop) {
        case "flight":
        case "accom":
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
    allFlightGuests: state => {
      return Object.values(state.data).filter(guest => guest.flight == true);
    },
    allAccomGuests: state => {
      return Object.values(state.data).filter(guest => guest.accom == true);
    }
  },
  mutations: {},
  actions: {}
};

export default guests;
