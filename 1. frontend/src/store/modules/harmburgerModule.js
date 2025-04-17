import router from "../../router"
const harmburgerModule = {
  state() {
    return {
      doubleClickNum: 0
    }
  },
  mutations: {
    TOGGLE_MENU(state, rootState) {
      rootState.harmburger = !rootState.harmburger;
      rootState.harmburgerOpen = !rootState.harmburgerOpen;
    },

    OPEN_MENU(state, rootState) {
      if(state.doubleClickNum > 0) {
        rootState.harmburgerOpen = false
        rootState.harmburger = false
        state.doubleClickNum = 0
      } else {
        if(router.currentRoute._rawValue.name !== "AddToTask"){
          rootState.harmburger = true;
          rootState.harmburgerOpen = true;  
          state.doubleClickNum = 1
        }
      }
    },

    CLOSE_MENU(state, rootState) {
      rootState.harmburger = false;
      rootState.harmburgerOpen = false;
    },
  },
  actions: {
    toggleMenu({ commit, rootState }) {
      commit("TOGGLE_MENU", rootState);
    },
    closeMenu({ commit, rootState }) {
      commit("CLOSE_MENU", rootState);
    },
    openMenu({ commit, rootState }) {
      commit("OPEN_MENU", rootState);
    },
  },
};

export default harmburgerModule;
