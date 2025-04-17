<template>
  <div class="add-task-wrapper">
    <div class="flex flex1">
      <form @submit.prevent="addTaskCredentials">
        <label for="task">Task</label>
        <input
          type="text"
          id="task"
          name="task"
          v-model="task"
          required
          placeholder="Enter your task's title here"
        />
        <h3>
          Task title can't be longer than 60 characters long ->
          <span>({{ task.length }}/60)</span>
        </h3>

        <label for="date">Date</label>
        <input
          :type="[textDate ? 'text' : 'date']"
          id="date"
          name="date"
          v-model="date"
          required
          placeholder="Enter the date range for task to be completed"
          @dblclick="textDate = !textDate"
        />
        <h3>
          Date can't be longer than 40 characters long -> <span>({{ date.length }}/40)</span> 
          <br> <span class="you-can">You can double click to input via {{ !textDate ? 'text instead' : 'a date-picker instead'}}.</span>
        </h3>

        <label for="description">Summary</label>
        <textarea
          type="description"
          id="description"
          v-model="description"
          placeholder="Enter a summary of what you plan to achieved with the task (optional)"
        />
        <h3>
          Description can't be longer than 300 characters ->
          <span>({{ description.length }}/300)</span>
        </h3>

        <div class="agenda-container">
          <div class="flex justify-content">
            <h3 class="agendas">Goals</h3>
            <div class="flex">
              <i
                class="fa fa-plus"
                title="Click to add more goals"
                @click.prevent="increaseAgendaNumber"
              ></i>

              <i
                class="fa fa-minus"
                title="Click to remove goals"
                @click.prevent="decreaseAgendaNumber"
                v-if="agendaNumber.length > 1"
              ></i>
            </div>
          </div>
          <h3 class="agenda-instruction">
            Your goal can only be 65 characters and under.<br> At least one goal is required.
          </h3>

          <div
            class="agenda-input"
            v-for="(number, i) in agendaNumber"
            :key="i"
          >
            <input
              type="text"
              id="agenda"
              required
              @input="displayWarning(agendas[i].agenda, i)"
              :placeholder="placeholder(i)"
              v-model="agendas[i].agenda"
              :class="[
                agendas[i].agenda.length > 65 ? 'errorLength' : '',
                'agenda',
              ]"
            />
          </div>
        </div>

        <button class="button">
          <Icon icon="cil:save" class="color-white edit-task-icon move-up" />
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Button from "@/components/Button.vue";
import { Icon } from "@iconify/vue";
import moment from "moment";
export default {
  name: "AddToTasksForm",
  data() {
    return {
      task: "",
      date: "",
      description: "",
      agendas: [{ agenda: "" }],
      agendaNumber: ["1"],
      errorMessages: [],
      textDate: false
    };
  },
  components: {
    Button,
    Icon,
  },
  watch: {
    description: function(val) {
      if (val) {
        if (val.length > 300) {
          this.description = val.substr(0, 300);
        }
      }
    },
    task: function(val) {
      if (val) {
        if (val.length > 60) {
          this.task = val.substr(0, 60);
        }
      }
    },
    date: function(val) {
      if (val) {
        if (val.length > 40) {
          this.date = val.substr(0, 40);
        }
      }
    }
  },
  methods: {
    ...mapActions("task", ["addTask"]),
    async addTaskCredentials() {
      const agendas = this.agendas.filter((agenda) => {
        if (agenda.agenda !== "") return true;
      });

      const taskToAdd = {
        task: this.task,
        date: this.date,
        description: this.description,
        agendas: agendas,
      };

      if (
        this.task.length > 60 ||
        this.date.length > 40 ||
        this.description.length > 300
      ) {
        return;
      }

      if (this.task.length <= 0 || this.date.length <= 0) {
        return;
      }

      await this.addTask(taskToAdd);
    },

    increaseAgendaNumber() {
      this.agendaNumber.push(this.agendaNumber[0]++);
      this.agendas.push({ agenda: "" });
    },

    decreaseAgendaNumber() {
      this.agendaNumber.pop(this.agendaNumber[0]++);
      this.agendas.pop({ agenda: "" });
    },

    placeholder(i) {
      let options = [
        "first",
        "second",
        "third",
        "fourth",
        "fifth",
        "sixth",
        "seventh",
        "eighth",
        "ninth",
        "tenth",
      ];
      if (!options[i]) {
        const placeholderGotten = "Enter your next goal here";
        return placeholderGotten;
      }
      const placeholderGotten = `Enter your ${options[i]} goal here`;
      return placeholderGotten;
    },
    displayWarning(val, i) {
      if (val) {
        if (val.length > 65) {
          this.agendas[i].agenda = val.substr(0, 65);
        }
      }
    },
  }
};
</script>
