import router from "../../router";
import axios from "axios";

const taskModule = {
  namespaced: true,
  state() {
    return {
      tasks: [],
      task: {},
      emptyTask: null,
      addedTask: null,
      editTask: false,
      task_is_deleted: false
    };
  },

  mutations: {
    SET_TASKS(state, payload) {
      state.tasks = payload;
      state.loading = false;
      state.taskLoading = false;
    },

    SET_TASK(state, payload) {
      state.task = payload;
    },

    UPDATE_TASKS(state, payload) {
      state.addedTask = true;
      state.tasks = state.tasks.push(payload);
    },

    TOGGLE_EDIT_FORM(state, payload){
      state.editTask = !state.editTask
    },

    DELETE_TASK(state, payload) {
      state.tasks = state.tasks.filter((task) => task._id !== payload);
      state.task_is_deleted = true
      setTimeout(() => {
        state.task_is_deleted = false  
      }, 9000)
      if (state.tasks.length < 1) {
        state.emptyTask = true;
      }
    },

    EDIT_TASK(state, payload) {
      state.tasks.unshift(payload);
    },

    EMPTY_TASK(state, payload) {
      state.emptyTask = payload;
    },
  },

  actions: {
    async fetchTasks({ commit }) {
      try {
        const response = await axios.get(`/api/tasks`);
        const data = response.data;
        localStorage.removeItem("error");
        if (data.length !== 0) {
          commit("SET_TASKS", data);
          commit("EMPTY_TASK", false);
        } else {
          commit("EMPTY_TASK", true);
        }
      } catch (err) {
        throw err;
      }
    },

    async fetchTask({ commit }, id) {
      const response = await axios.get(`/api/tasks/${id}`);
      const data = response.data;
      commit("SET_TASK", data);
    },

    async addTask({ commit }, task) {
      const response = await axios.post(`/api/tasks`, task);
      const data = response.data;
      if (data) {
        commit("UPDATE_TASKS", data);
        router.push({ name: "Home" });
      }
    },

    async deleteTaskStore({ commit }, id) {
      await axios.delete(`/api/tasks/${id}`);
      commit("DELETE_TASK", id);
    },

    async editTask({ commit }, improvedTask) {
      const response = await axios.put(
        `/api/tasks/${improvedTask.taskId}`,
        improvedTask
      );

      if (response.data) {
        console.log(response.data);
        commit("EDIT_TASK", response.data);
        router.go();
      }
    }
  },
};

export default taskModule;
