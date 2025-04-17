<template>
  <div id="app">
    <div class="container">
      <router-view class="selection-none"/>
    </div>
  </div>
</template>

<script>
import { mapState} from "vuex";
export default {
  name: "App",
  data() {
    return {};
  },
  computed: {
    ...mapState("task", ["addedTask"])
  },
  watch:{
    '$route' (to, from){
      if(from.fullPath === "/addtask" && to.fullPath === "/homepage" && this.addedTask) {
        this.$router.go()
      }
      if(from.fullPath === "/login" && to.fullPath === "/homepage") {
        this.$router.go()
      }
      if(from.name === "OTP" && to.fullPath === "/homepage") {
        this.$router.go()
      }
      if(to.meta.notRequiresLogin){
        document.body.classList.add("second-bg")
      }
    }
  }
};
</script>
