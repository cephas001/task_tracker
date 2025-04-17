<template>
  <div class="sidebar-wrapper">
    <div :class="[harmburger ? 'harmburger-show' : 'no-display', 'harmburger']">
      <router-link :to="{ name: 'Profile' }"
        ><h1>{{formattedName}}
        <i class="far fa-user-circle"></i></h1>
      </router-link>
      <router-link :to="{ name: 'Home' }" title="View tasks">
        <button class="sidebar-btn margin">Tasks</button>
      </router-link>
      <router-link :to="{ name: 'Contact' }" title="Get in touch">
        <button class="sidebar-btn">Contact the developer</button>
      </router-link>
      <button @click="logOut" class="sidebar-btn margin" title="Logout">
        Log Out
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "Sidebar",
  data() {
    return {
      show: false,
      formattedName: ''
    };
  },
  methods: {
    ...mapActions(["logOut"]),
    ...mapActions("user", ["fetchUser"]),
    formatName() {
      const firstCharacter = this.currentUser.username.match(/^[a-z]{1}/i);
      const formattedNameGotten = this.currentUser.username.replace(/^[a-z]{1}/i, firstCharacter[0].toUpperCase())
      this.formattedName = formattedNameGotten
    }
  },
  watch: {
    harmburger: {
      async handler(value){
        if(value == true && this.$route.fullPath !== "/question"){
          await this.fetchUser();
          this.formatName()
        }  
      }
    }
  },
  computed: {
    ...mapState(["harmburger", "beginUserSearch"]),
    ...mapState("user", ["currentUser"]),
  }
};
</script>

<style></style>
