<template>
  <div>
    <div class="flex flex1">
      <TopNav v-if="!popup"/>

      <Sidebar v-if="!popup"/>
      
      <router-view 
        :class="[loading ? 'dim' : '']" 
        @dblclick="openMenu"
        @click="closeMenu"
      />
      <i
        class="fa fa-plus-circle add-task-btn"
        @click="changeRoute"
        v-if="checkRoute() && !popup"
        title="Add a task"
      ></i>
    </div>
    <div>
      <Loader v-if="loading && !popup"/>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import TopNav from "@/components/TopNav.vue";
import Loader from "@/components/Loader.vue";
import { mapActions, mapState } from "vuex";

export default {
  name: "LoggedInLayout",
  components: {
    Sidebar,
    TopNav,
    Loader
  },
  computed: {
    ...mapState(["loading", "popup"]),
  },
  methods: {
    ...mapActions(["openMenu", "closeMenu"]),
    watchScroll() {
      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 100) {
          this.$store.state.harmburger = false;
          this.$store.state.harmburgerOpen = false;
        }
      });
    },
    changeRoute() {
      this.$router.push({ name: "AddToTask" });
    },
    checkRoute() {
      if (
        this.$route.fullPath === "/addtask" ||
        this.$route.name === "EditTask" || this.$route.name === "Contact"
      ) {
        return false;
      }
      return true;
    }
  },
  updated() {
    this.$store.state.harmburger = false;
    this.$store.state.harmburgerOpen = false;
  },
  created(){    
    this.watchScroll();
  }
};
</script>
