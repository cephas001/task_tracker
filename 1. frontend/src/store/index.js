import { createStore } from "vuex";
import router from "../router";
import axios from "axios";
import taskModule from "./modules/taskModule";
import userModule from "./modules/userModule";
import harmburgerModule from "./modules/harmburgerModule";

const store = createStore({
  state() {
    return {
      harmburger: false,
      harmburgerOpen: false,
      errorMessage: "",
      loading: false,
      popup: false,
      popupValues: {
        main_value: "",
        button_values: []
      }
    };
  },

  mutations: {
    ERROR(state, payload) {
      localStorage.setItem("error", true);
      state.errorMessage = payload;
      router.push({ name: "ErrorPage" });
    },
    SET_POPUP_VALUE(state, payload){
      state.popup = true;
      state.popupValues.main_value = payload;
    },
    SET_BUTTON_VALUES(state, payload){
      state.popupValues.button_values = payload
    }
  },

  actions: {
    logOut({ commit }) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.go();
    },
    setPopupValue({commit}, value){
      commit("SET_POPUP_VALUE", value.value)
      commit("SET_BUTTON_VALUES", value.button_values)
    }
  },

  modules: {
    task: taskModule,
    user: userModule,
    harmburgerModule,
  },
});

export default store;
