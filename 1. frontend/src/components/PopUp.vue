<template>
<div class="popup-wrapper">
  <div class="popup">
  <div class="value"><h2 v-html="popupValues.main_value"></h2></div>
  <div class="btns">
    <button @click="yesOrNo(button)" v-for="(button, i) in popupValues.button_values">{{ button }}</button>  
  </div>
</div>
  
</div>
</template>

<script>
import { Icon } from "@iconify/vue";
import { mapActions, mapState } from "vuex";
export default {
  name: 'PopUp',
  computed: {
    ...mapState(["value", "popupValues"]),
    ...mapState("task", ["tasks"])
  },
  methods: {
    ...mapActions("task", ["deleteTaskStore"]),
    yesOrNo(button){
      this.$emit('yesOrNo', button)
    },
  },
  components: {
    Icon
  },
  mounted(){
    window.document.body.scrollTop = 0;
    window.document.documentElement.scrollTop = 0;
  }
}
</script>
