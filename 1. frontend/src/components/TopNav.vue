<template>
  <div class="nav-wrapper">
    <div class="flex flex1">
      <div class="flex welcome-name topnav">
        <h1>
          <router-link class="router-link" to="/homepage" title="Go back home"
            >Task Tracker</router-link
          >
        </h1>
        <i
          class="fa fa-bars harmburger-icon"
          @click="toggleMenu"
          :class="[harmburgerOpen ? 'rotate' : '']"
          :title="[harmburgerOpen ? 'Close Menu' : 'Open Menu']"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "TopNav",
  data() {
    return {};
  },
  computed: {
    ...mapState(["harmburgerOpen"]),
  },
  methods: {
    ...mapActions(["toggleMenu"]),
  },
};
</script>
