import axios from "axios";
import router from "./router";
import store from "./store";

const token = localStorage.getItem("token");

axios.interceptors.request.use(
  function(config) {
    config.headers.Authorization = token;
    if(config.method !== 'put' && config.url !== "/api/deleted_task" && !store.state.harmburger) {
      store.state.loading = true;  
    }
    return config;
  },
  function(error) {
    // Do something with request error
    store.state.loading = false;
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function(response) {
    store.state.loading = false;
    return response;
  },
  async function(err) {
    store.state.loading = false;
    if (401 === err.response.status) {
      localStorage.clear();
      router.push({ name: "Login" });
    } else if (400 === err.response.status) {
      localStorage.clear();
      router.push({ name: "SignUp" });
    } else if (500 === err.response.status) {
      store.state.errorMessage = "Sorry, our server is down at the moment";
      router.push({ name: "ErrorPage" });
    } else if (404 === err.response.status) {
      router.push({ name: "Home" });
    } else {
      return Promise.reject(error);
    }
  }
);
