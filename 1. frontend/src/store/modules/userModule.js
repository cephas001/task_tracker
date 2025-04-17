import axios from "axios";

const userModule = {
  namespaced: true,
  state() {
    return {
      currentUser: {},
    };
  },

  mutations: {
    DEFINE_USER(state, payload) {
      state.currentUser = payload;
    },
  },

  actions: {
    async fetchUser({ commit }) {
      if (localStorage.getItem("token")) {
        const response = await axios.get("/api/user");
        const data = response.data;
        commit("DEFINE_USER", data);
      }
    },
  },
};

export default userModule;
