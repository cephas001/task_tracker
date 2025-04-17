<template>
	<div class="forgot-password login-wrapper">
    <div v-if="error.message" class="error" style="margin: 0 auto; width: 90%;"> 
      {{error.message}}
    </div>
    <form @submit.prevent="sendEmail">
    <label for="email">Email</label>
    <input 
      	type="text" 
      	id="email" 
      	name="email" 
      	required 
      	style="width: 100%"
      	v-model="email"
    />
      <h3>Please enter the email provided during registration.</h3>
      <Button value="Submit" />
    </form>

    <router-link :to="{ name: 'SignUp' }"
    >Don't have an account? Register instead...</router-link
    >
    <router-link class="forget-password" :to="{name: 'Login'}">Login instead</router-link>
  </div>
</template>

<script>
import Button from "@/components/Button.vue";
import axios from "axios";
export default {
  name: 'ForgotPassword',
  data () {
    return {
    	email: '', 
      error: {}
    }
  },
  components: {
  	Button
  },
  methods: {
  	async sendEmail(){
  		const email = this.email;
  		const response = await axios.put("/api/password_change", {
  			email
  		})	
  		if(!response.data.sent) {
  			this.error = response.data;
        return;
  		}
  		localStorage.setItem("hash", response.data.fullHash)
  		localStorage.setItem("email", response.data.email)
  		this.$router.push({name: "OTP", params: {email_change: true}})
  	}
  }
}
</script>
