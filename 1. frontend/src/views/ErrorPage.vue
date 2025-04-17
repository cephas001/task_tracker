<template>
  <div class="error-page-wrapper">
    <div class="error-page">
      <h1>Well this is embarrassing...</h1>
      <h1>{{ errorMessage }}</h1>
      <h2>Try logging out:</h2>
      <div class="btns">
        <button @click="logOut">Logout</button>
        <router-link :to="{ name: 'Home' }"
          ><button>Go back</button></router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from "vuex";
export default {
  name: "ErrorPage",
  computed: {
    ...mapState(["errorMessage"]),
    ...mapState("task", ["tasks"]),
  },
  methods: {
    ...mapActions(["logOut"]),
    ...mapActions("task", ["fetchTasks"]),
  },
  async created() {
    await this.fetchTasks();
    if (this.tasks) {
      this.$router.go(-1);
    }
  },
};
</script>
