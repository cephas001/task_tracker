<template>
  <div>
    <div class="home-wrapper" v-if="!popup">
      <div class="flex search-wrapper">
        <input
          type="search"
          class="search-bar"
          placeholder="search tasks..."
          v-model="searchValue"
          @input="search($event, searchValue)"
        />
        <i class="fa fa-search"></i>
      </div>
      <div class="undo-delete" v-if="task_is_deleted">
        <button @click="checkDeletedTask">Undo delete</button>
      </div>
      <div class="card no-task" v-if="emptyTask">
        <h1>
          You currently don't have any tasks
        </h1>
      </div>
      <div class="card no-task" v-if="wrongSearch">
        <h1>
          No task with the title provided
        </h1>
      </div>
      <div v-if="!emptyTask && !wrongSearch">
        <div
          class="card"
          v-for="task in tasks"
          :key="task._id"
          :class="[task.isCompleted ? 'completed-task' : '', 'card']"
          :task="task"
          title="View task"
        >
            <h1
              @click.prevent="$router.push({name: 'EditTask', params: {id: task._id}})"
              :class="[task.isCompleted ? 'completed-task' : '', 'task-title']"
            >
              Title -> {{
                task.task.length < 40
                  ? task.task
                  : task.task.substr(0, 40) + "..."
              }}
            </h1>
          <div class="flex justify-space">
            <h2 @click.prevent="$router.push({name: 'EditTask', params: {id: task._id}})" class="task-date">Date -> {{ formatDate(task.date, false) }}</h2>
            <i
              class="fa fa-times"
              @click="displayPopUp(task._id)"
              title="Delete task"
            ></i>
          </div>
          <p
            @click.prevent="$router.push({name: 'EditTask', params: {id: task._id}})"
            class="task-description"
            v-if="task.description !== ''"
            v-html="formatDescription(task.description)"
          ></p>
          <div>
            <p @click.prevent="$router.push({name: 'EditTask', params: {id: task._id}})" class="created-on">Created on the {{ formatDate(task.createdAt, true) }}</p>
          </div>
        </div>
      </div>
    </div>

    <PopUp v-if="popup" @yesOrNo="yesOrNo"/>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from "vuex";
import Button from "@/components/Button.vue";
import Sidebar from "@/components/Sidebar.vue";
import TopNav from "@/components/TopNav.vue";
import PopUp from "@/components/PopUp.vue";
import EditTaskForm from "@/components/EditTaskForm.vue";
import axios from "axios";
import moment from "moment";
import { formatDate } from "../../utils/formatDate.js"
import { Icon } from "@iconify/vue";
export default {
  name: "Home",
  data() {
    return {
      complete: false,
      searchValue: "",
      wrongSearch: false,
      task_to_be_deleted_id: ""
    };
  },
  computed: {
    ...mapState(["popup"]),
    ...mapState("task", ["tasks", "emptyTask", "task_is_deleted"]),
    ...mapState("user", ["currentUser"]),
  },
  components: {
    Button,
    Sidebar,
    TopNav,
    Icon,
    PopUp,
    EditTaskForm
  },
  methods: {
    ...mapActions("task", ["fetchTasks", "deleteTaskStore"]),
    ...mapActions(["closeMenu", "setPopupValue"]),
    ...mapMutations("task", ["SET_TASKS", "TOGGLE_EDIT_FORM"]),
    displayPopUp(id) {
      const value = {
        value: "Are you sure you want to delete this task?",
        button_values: ["Yes", "No"]
      }
      this.task_to_be_deleted_id = id
      this.setPopupValue(value) 
    },
    formatDate(date, time){
      return formatDate(date, time)
    },
    deleteTask(id){
      if(this.deleteTaskStore(id)){
        this.tasks = this.tasks.filter((task) => task.id !== id)
        this.$store.state.popup = false
      }
    },
    yesOrNo(button) {
      if(button.toLowerCase() === "yes"){
        this.deleteTask(this.task_to_be_deleted_id)
      }else {
        this.$store.state.popup = false
      }
    },
    formatDescription(description) {
      const regex = /\n/g;
      if (description && description !== "") {
        let descriptionFormatted = description.replace(regex, "<br/>");
        if (descriptionFormatted.length >= 45) {
          return (descriptionFormatted = `Summary : ${descriptionFormatted.substr(
            0, 
            45
          )}...`);
        }
        return descriptionFormatted;
      }
    },
    search(e, val) {
      let tasksGotten = [];
      if (val === "") {
        this.fetchTasks();
        this.wrongSearch = false;
      }

      if (e.data == null) {
        return e.preventDefault(); // Don't do anything to the input value
      }

      let regex = new RegExp(`^${val}`, "gi");
      const filteredTasks = this.tasks.filter((task) => {
        return task.task.match(regex);
      });
      if (filteredTasks.length > 0) {
        this.SET_TASKS(filteredTasks);
      } else {
        this.wrongSearch = true;
      }
    },
    async checkDeletedTask(){
      const response = await axios.get("/api/deleted_task")
      if(response.data.resaved){
        this.$router.go()
      }
    }
  },
  async created() {
    await this.fetchTasks();
  }
};
</script>
