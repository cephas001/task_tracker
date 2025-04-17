<template>
  <div class="edit-task-wrapper text-align-left">
    <form v-if="!loading" @submit.prevent="editTaskComponentAction">
      <label for="task">New task name</label>
      <input type="text" id="task" v-model="taskname" autocomplete="off" />

      <label for="date">New date</label>
      <input type="text" id="date" v-model="date" autocomplete="off" />

      <label for="description">Summary</label>
      <textarea
        type="text"
        id="description"
        v-model="description"
        autocomplete="off"
      />

      <div class="agenda-container">
        <label class="agendas">Goals</label>
        <div
          class="agenda-input"
          v-for="(agenda, i) in notDeletedAgendaInput()"
          :key="agenda._id"
        >
          <label for="agenda" class="agenda-label" 
            >Goal <span>({{ agenda.agenda.length }}/50)</span></label
          >
          <input
            type="text"
            id="agenda"
            @input="displayWarning(agenda.agenda, i)"
            v-model="agenda.agenda"
            @change="changeValue(agenda.agenda, agenda._id)"
          />
        </div>
      </div>

      <button class="button">
        <Icon
          icon="codicon:save-as"
          class="color-white edit-task-icon move-up"
        />
      </button>
    </form>
  </div>
</template>

<script>
import Button from "@/components/Button";
import axios from "axios";
import { mapActions, mapState } from "vuex";
import { Icon } from "@iconify/vue";
import { formatDate } from "../../utils/formatDate.js"
export default {
  name: "EditTaskForm",
  data() {
    return {
      id: this.$route.params.id,
      taskname: "",
      date: "",
      description: "",
      allow: false,
    };
  },
  components: {
    Button,
    Icon,
  },
  computed: {
    ...mapState("task", ["task"]),
    ...mapState(["loading"]),
  },
  watch: {
    description: function(val) {
      if (val) {
        if (val.length > 300) {
          this.description = val.substr(0, 300);
        }
      }
    },
    taskname: function(val) {
      if (val) {
        if (val.length > 60) {
          this.taskname = val.substr(0, 60);
        }
      }
    },
    date: function(val) {
      if (val) {
        if (val.length > 40) {
          this.date = val.substr(0, 40);
        }
      }
    },
  },
  methods: {
    ...mapActions("task", ["editTask", "fetchTask"]),
    getTask() {
      this.fetchTask(this.$route.params.id);
    },
    async editTaskComponentAction() {
      if (
        this.taskname.length > 60 ||
        this.date.length > 40 ||
        this.description.length > 300
      ) {
        return;
      }

      const improvedTask = {
        task: this.taskname,
        date: this.date,
        description: this.description,
        taskId: this.id,
      };

      await this.editTask(improvedTask);
    },
    async changeValue(val, id) {
      if (val.length > 50) {
        return;
      }

      if (val.length === 0) {
        return;
      }

      const agendaToSend = {
        agenda: val,
        agendaId: id,
      };

      await axios.put(`/api/tasks/${this.task._id}`, agendaToSend);
    },
    setValues() {
      this.taskname = this.task.task;
      this.date = this.formatDate(this.task.date, false);
      this.description = this.task.description;
    },
    formatDate(date, time){
      return formatDate(date, time)
    },
    displayWarning(val, i) {
      if (val) {
        if (val.length > 50) {
          this.task.agendas[i].agenda = val.substr(0, 50);
        }
      }
    },
    notDeletedAgendaInput() {
      const agendas = this.task.agendas.filter((agenda) => {
        if (agenda.agenda !== "000999") return true;
      });
      return agendas;
    },
  },
  created() {
    this.setValues();
  },
  mounted(){
    document.body.classList.remove("second-layer")
  },  
  unmounted(){
    if(this.$route.name === "EditTask") {
      document.body.classList.add("second-layer")
    } else {
      document.body.classList.remove("second-layer")
    } 
  }
};
</script>

<style></style>
