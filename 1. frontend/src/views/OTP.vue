<template>
  <div class="otp-wrapper" v-if="!loading">
    <details open>
      <summary><h1 class="instruction-summary">Instructions</h1></summary>
      <h1 class="instruction">
        Please enter the six digit code sent to the email you provided.
      </h1>
      <h1 class="instruction">
        Not getting any? You might need to check your spam folder.
      </h1>
      <h1 class="instruction">
        Please note that the code would expired after two minutes if not used.
      </h1>
    </details>
    <form @submit.prevent="verify">
      <label for="otp">Enter OTP</label>
      <div class="error" v-if="error.message" style="padding: 7px; margin-top: 0.9em; font-size: 1.1em; text-align: center;">
        {{ error.message }}
      </div>
      <input type="text" id="otp" v-model="otp" required autocomplete="off" />
      <h3>Please enter the code sent to the email provided.</h3>
      <div v-if="$route.params.email_change"> 
        <label for="new_passord">Enter new password</label>
        <input type="text" id="new_passord" v-model="password"/>
        <h3>
          Your password must be at least 8 characters long and contain at least
          one letter and number.
        </h3>

        <label for="confirm_new_password">Confirm new passowrd</label>
        <input type="text" id="confirm_new_password" />
        <h3>Passwords should both match.</h3>
      </div>
      <div class="links">
        <Button value="Submit code" class="btn" />
        <a @click="resend">Resend code?</a>   
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Button from "@/components/Button.vue";
import { mapState } from "vuex";
export default {
  name: "SignUp",
  data() {
    return {
      otp: "",
      error: {},
      timer: "",
      password: ""
    };
  },
  components: {
    Button,
  },
  computed: {
    ...mapState(["loading"])
  },
  methods: {
    async verify() {
      const email = localStorage.getItem("email");
      const hash = localStorage.getItem("hash");
      const code = {
        otp: this.otp,
        email,
        hashReceived: hash,
        password: this.password
      };
      try {
        const response = await axios.post("/api/verify", code);
        if (response.data.message !== "Otp has expired" && response.data.message !== "Please enter correct code") {
          localStorage.clear();
          localStorage.setItem("token", response.data.token)
          this.$router.push({ name: "Home" });
        } else {
          this.error = response.data;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async resend() {
      const email = localStorage.getItem("email");
      try {
        const response = await axios.post("/api/resend", {
          email,
        });
        localStorage.setItem("hash", response.data.fullHash);
      } catch (e) {
        console.log(e);
      }
    },
  },
  watch: {
    otp: function(val) {
      if (val.length > 6) {
        this.otp = this.otp.substr(0, 6);
        return;
      }
    },
  },
};
</script>
