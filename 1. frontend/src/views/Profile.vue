<template>
<div>
  <div :class="[changePassword ? 'no-margin' : '', 'profile-wrapper']" v-if="!popup">
    <Icon icon="healthicons:ui-user-profile-outline" class="icon"/>
    <h1>@{{ name }} || {{ currentUser.email }}</h1>

    <div class="links-container"> 
      <p class="error-profile" v-if="error.message && error.message.includes('Username')">{{error.message}}</p>
      <a href="javascript:void(0)" @click="toggleChangeUsername" title="Change username">Change username?</a>
      <input type="text" required class="change-input username-input" v-model="currentUser.username" v-if="changeUsername" @keypress.enter="changeUsernameMethod(currentUser.username)">
      <a href="javascript:void(0)" title="Change password" @click="toggleChangePassword"> Change password?</a>
      <p class="error-profile" v-if="error.message && error.message.includes('password')">{{error.message}}</p>
      <form class="change-password-wrapper" v-if="changePassword" @submit.prevent="changePasswordMethod">
        <div class="flex-profile">
          <input 
            class="change-input"
            required 
            placeholder="enter current password" 
            v-model="password"
            :type="[showPassword ? 'text' : 'password']"
          />
          <i
            :class="[showPassword ? 'fa fa-eye-slash' : 'fa fa-eye']"
            @click="showPassword = !showPassword"
          ></i>
        </div>
        <div class="flex-profile">  
          <input 
            class="change-input" 
            placeholder="enter new password" 
            v-model="new_password"
            required
            :type="[showPassword2 ? 'text' : 'password']"
          />
          <i
            :class="[showPassword2 ? 'fa fa-eye-slash' : 'fa fa-eye']"
            @click="showPassword2 = !showPassword2"
          ></i>
        </div>
        <div class="flex-profile">
          <input 
            class="change-input"
            required
            placeholder="confirm new password" 
            v-model="confirm_new_password"
            :type="[showPassword3 ? 'text' : 'password']"
          />
          <i
            :class="[showPassword3 ? 'fa fa-eye-slash' : 'fa fa-eye']"
            @click="showPassword3 = !showPassword3"
          ></i>
        </div>
        <input type="submit" value="submit" class="change-password-submit">
      </form>
      <router-link :to="{ name: 'Contact'} " class="report">
        <h3>Report an issue</h3>
      </router-link>
    </div>
    
    <h3>Number of tasks created - {{ tasks.length }}</h3>

  </div>
  <PopUp v-if="popup" @yesOrNo="$store.state.popup = false"/>
</div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Button from "@/components/Button.vue";
import { Icon } from "@iconify/vue";
import { usernameValidator, emailValidator, passwordValidator } from "../../utils/validatorService.js"
import axios from "axios";
import PopUp from "@/components/PopUp.vue"

export default {
  name: "Profile",
  data(){
    return {
      name: "",
      changePassword: false,
      changeUsername: false, 
      password: '', 
      new_password: '',
      confirm_new_password: '',
      error: {},
      showPassword: false, 
      showPassword2: false, 
      showPassword3: false,
    }
  },
  computed: {
    ...mapState("user", ["currentUser"]),
    ...mapState("task", ["tasks"]),
    ...mapState(["popup"])
  },
  components: {
    Button,
    Icon,
    PopUp
  },
  methods: {
    ...mapActions("user", ["fetchUser"]),
    ...mapActions("task", ["fetchTasks"]),
    ...mapActions(["setPopupValue"]),
    toggleEditUsername(){
      this.editUsername = !this.editUsername
    }, 
    async changeUsernameMethod(val){
      if(usernameValidator(val)){
        this.error = usernameValidator(val)[0]
        return;
      }
      this.error = ""
      const response = await axios.put("/api/user", {username: val})
      if(response.data.response.modifiedCount == 1){
        this.formatName()
        this.changeUsername = false
      }
    }, 
    async changePasswordMethod(){
      const passwordObject = {
        password: this.password, 
        new_password: this.new_password
      }
      if(passwordValidator(this.new_password, this.confirm_new_password)){
        this.error = passwordValidator(this.new_password, this.confirm_new_password)[0]
        return;
      }
      const response = await axios.put("/api/user", passwordObject)
      if(!response.data.changed){
        const value = {
          value: `<span style="color: red">${response.data.messageBody}</span>`,
          button_values: ["Close"]
        }
        this.setPopupValue(value)
      } else {
        const value = {
        value: `<span style="color: green">Password changed successfully</span>`,
        button_values: ["Close"]
      }
        this.setPopupValue(value) 
        this.changePassword = false
        this.error = ""
      }
    },
    toggleChangePassword(){
      if(this.changeUsername){
        this.changeUsername = false
      }
      this.changePassword = !this.changePassword
      this.error = ""
    },
    toggleChangeUsername(){
      if(this.changePassword){
        this.changePassword = false
      }
      this.changeUsername = !this.changeUsername
      this.error = ""

    }
  },
  async created() {
    await this.fetchUser();
    await this.fetchTasks();
    this.name = this.currentUser.username
  },
};
</script>

<style></style>
