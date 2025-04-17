<template>
  <div>
    <div>
      <div class="nav-wrapper">
        <h3>
          <router-link class="router-link" :to="{name: 'Entry'}">Task Tracker</router-link>
        </h3>  
      </div>
      <router-view :class="[loading ? 'dim' : '']" />
    </div>
    <div>
      <Loader v-if="loading" />
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";
import { mapState } from "vuex";
export default {
  name: "EntryLayout",
  components: {
    Loader,
  },
  computed: {
    ...mapState(["loading"]),
  },
};
</script>
