<template>
  <div
    :class="[!editTask ? 'format' : '', 'edit-task-wrapper']"
    v-if="!loading"
  >
    <div class="task-body" v-if="!editTask && !loading">
      <h1>Title: {{ task.task }}</h1>
      <h2>Date: {{ formatDate(task.date, false) }}</h2>
      <p class="description-word" v-if="task.description !== ''">
        Description:
      </p>
      <p
        class="description"
        v-html="formatDescription(task.description)"
        v-if="task.description !== ''"
      ></p>
      <h3 class="status">
        Status: {{ task.isCompleted ? "Completed" : "Not completed" }}
      </h3>
      <p class="error-agenda" v-if="error !== ''">{{error}}</p>
      <details class="agenda-container" open>
        <summary>
          <h2 title="List of agendas">Goals:</h2>
        </summary>
        <ul>
          <li v-for="agenda in task.agendas" :key="agenda._id" :class="[agenda.agenda == '000999' ? 'display-none' : '']">
            <div v-if="agenda.agenda !== '000999'" class="agenda-text">{{ agenda.agenda }}</div>
            <div class="flex completed-agenda" v-if="agenda.agenda !== '000999'">
              <i class="fa fa-times" @click="deleteAgenda(agenda)"></i>
              <input
                type="checkbox"
                @click="isComplete(agenda)"
                @change="changeTaskCompletedState(task)"
                id="complete"
                v-model="agenda.agendaIsCompleted"
                title="Mark task as completed"
                class="checkbox"
              />
            </div>
          </li>
        </ul>
      </details>
    </div>
    <div title="Click to edit task">
      <Icon
        icon="mdi:pencil-circle"
        @click="TOGGLE_EDIT_FORM"
        :class="[!editTask ? 'edit-task-icon' : 'format-btn', 'color-white']"
      />
    </div>
    <div title="Close editor">
      <Icon
        icon="ant-design:close-circle-filled"
        @click="TOGGLE_EDIT_FORM"
        :class="[editTask ? 'edit-task-icon cancel-icon' : 'format-btn', 'color-white']"
        title="Close editor"
      />
    </div>
    <div>

    </div>
    
    <div>
      <EditTaskForm v-if="editTask" class="form" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import EditTaskForm from "@/components/EditTaskForm";
import axios from "axios";
import { Icon } from "@iconify/vue";
import { formatDate } from "../../utils/formatDate.js"
export default {
  name: "EditTask",
  data() {
    return {
      error: "",
    };
  },
  components: {
    EditTaskForm,    
    Icon,
  },
  computed: {
    ...mapState("task", ["task", "editTask"]),
    ...mapState(["loading"]),
  },
  methods: {
    ...mapActions("task", ["fetchTask", "deleteTaskStore"]),
    ...mapMutations("task",  ["TOGGLE_EDIT_FORM"]),
    getTask() {
      this.fetchTask(this.$route.params.id);
    },
    formatDescription(description) {
      const regex = /\n/g;
      if (description && description !== "") {
        const descriptionFormatted = description.replace(regex, "<br/>");
        return descriptionFormatted;
      }
    },
    formatDate(date, time){
      return formatDate(date, time)
    },
    async isComplete(agenda) {
      const agendaToChange = {
        ...agenda,
        agendaId: agenda._id,
        agendaIsCompleted: !agenda.agendaIsCompleted,
      };

      const response = await axios.put(`/api/tasks/${this.task._id}`, agendaToChange);
      const remainingAgendas = this.task.agendas.filter((A) => A._id !== agenda._id);

      if(response.data.modifiedCount === 1) {
        this.task.agendas = [{...agenda, agendaIsCompleted: agenda.agendaIsCompleted }, ...remainingAgendas]
      }
    },
    async deleteAgenda(agenda) {
      if (
        this.task.agendas.filter((agendaTwo) => agendaTwo.deleted !== "000999").length <
        2
      ) {
        this.error = "You must have at least one goal.";
        window.setTimeout(() => {
          this.error = "" 
        }, 4000)
        return;
      }

      const value = "000999";
      const agendaToSend = {
        agenda: value,
        agendaId: agenda._id,
      };
      const response = await axios.put(
        `/api/tasks/${this.task._id}`,
        agendaToSend
      );
      if (response) {
        this.task.agendas = this.task.agendas.filter(
          (agendaTwo) => agendaTwo._id !== agenda._id
        );
      }
    },
    async changeTaskCompletedState(task) {
      const truthValues = task.agendas.filter(
        (agenda) => agenda.agendaIsCompleted == true
      );

      if (truthValues.length == task.agendas.length) {
        const newTask = {
          ...task,
          isCompleted: true,
        };
        await axios.put(`/api/tasks/${task._id}`, newTask);
        this.task.isCompleted = true
      } else {
        const newTask = {
          ...task,
          isCompleted: false,
        };
        await axios.put(`/api/tasks/${task._id}`, newTask);
        this.task.isCompleted = false
      }
    },
  },
  mounted() {
    this.getTask();
  },
  beforeRouteEnter(){
    document.body.classList.add("second-layer")
  },
  beforeRouteLeave(){
    document.body.classList.remove("second-layer")
  }
};
</script>
