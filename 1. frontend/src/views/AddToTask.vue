<template>
  <div class="add-task-wrapper">
    <AddToTasksForm />
  </div>
</template>

<script>
import AddToTasksForm from "@/components/AddToTasksForm.vue";
import { mapMutations } from "vuex";
export default {
  name: "AddToTask",
  components: {
    AddToTasksForm,
  },
  beforeCreate(){
    document.body.classList.add("third-bg")
  }
};
</script>
