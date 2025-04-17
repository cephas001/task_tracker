<template>
<div>
	<div class="contact-wrapper" v-if="!popup">
		<form @submit.prevent="sendEmail">
	      <label for="subject"><h1>Title</h1></label>
	      <input type="text" id="subject" v-model="title"
	      	required 
	      	placeholder="Maximum of 50 characters" 
	      />
	      <div v-if="checkRoute()">
	      	<label for="email"><h1>Email</h1></label>
	      	<input type="text" id="email" v-model="email"
	      		required 
	      		placeholder="Valid email address" 
	      	/>	
	      </div>
	      <label for="body"><h1>Body</h1></label>
	      <textarea
	        type="text"
	        id="body"
	        required
	        v-model="body"
	        autocomplete="off"
	        placeholder="Maximum of 500 characters"
	      />
	      <button><Icon icon="bi:send-check" class="send-icon" /></button>
    	</form>
    	<div class="social-icons">
    		<h1 class="about reach">Reach us on the following social media platforms</h1>
    	<a href="https://www.facebook.com/profile.php?id=100051610280902" target="_blank" class="fa fa-facebook"></a>
    	<a href="https://twitter.com/he_is_cephas" class="fa fa-twitter" target="_blank"></a>
    	<a href="https://www.instagram.com/_cephas_1/" target="_blank" class="fa fa-instagram"></a>
    	<a href="tel:+2348112985079" class="fa fa-phone"></a>
    	</div>

    	<h1 class="about">About the developer</h1>
    	<p>
    		Okodugha Peter is currently a 100 level computer engineering in the University of Benin and a full stack web developer. 
    	</p>
    	<p>
    		He's is passionate about making websites and applications to solve problems and grow businesses. 
    	</p>
    	<p>
    		Please reach out to him via the social media links above or send him an email via the form.
    	</p>
	</div>
	<PopUp v-if="popup" @yesOrNo="yesOrNo"/>
</div>
</template>

<script>
import axios from "axios";
import { mapActions, mapState } from "vuex";
import { Icon } from "@iconify/vue";
import PopUp from "@/components/PopUp.vue"
export default {
  name: 'Contact',
  data () {
    return {
    	title: "", 
    	body: "", 
    	email: ""
    }
  }, 
  watch: {
  	title(val) {
  		if(val.length > 50){
  			this.title = val.substr(0, 50)
  		}
  	},
  	body(val) {
  		if(val.length > 500) {
  			this.body = val.substr(0, 500)
  		}
  	}
  },
  components: {
  	Icon,
  	PopUp
  },
  computed: {
  	...mapState(["popup"])
  },
  methods: {
  	...mapActions(["setPopupValue"]),
  	async sendEmail(){
  		if(this.title == "" || this.body == ""){
  			return
  		}
  		var emailToSend = {
  			title: this.title,
  			body: this.body
  		}
  		let response;
  		if(this.email == ""){
  			response = await axios.post("/api/contact", emailToSend)	
  		} else {
  			emailToSend.email = this.email
  			response = await axios.post("/api/contact/not_logged_in", emailToSend)
  		}
  		if(response.data.sent){
  			const value = {
        	value: `<span style="color: green">Your message has been sent.</span>`,
        	button_values: ["Close"]
      	}
        this.setPopupValue(value) 
  			this.title = ""
  			this.body = ""
  		} else {
  			const value = {
        	value: `<span style="color: red">There was an error sending the message.</span>`,
        	button_values: ["Resend", "Close"]
      	}
        this.setPopupValue(value) 
  		}
  	},
  	async yesOrNo(button){
  		if(button.toLowerCase() === "resend"){
  			await this.sendEmail()
  		}	else {
  			this.$store.state.popup = false
  		}
  	},
  	checkRoute(){
  		if(this.$route.meta.notRequiresLogin){
  			return true
  		}
  		return false
  	}
  }
}
</script>