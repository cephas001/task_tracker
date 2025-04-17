<template>
  <div class="signup-wrapper">
    <form @submit.prevent="signUp">
      <label for="username" :class="[!errors[0] ? 'username-style' : '']"
        >Username</label
      >
      <input
        type="text"
        id="username"
        name="username"
        v-model="username"
        required
      />
      <h3>
        Username can contain only underscores and alphanumeric characters, and
        cannot begin with a number.
      </h3>
      <div v-if="errors.length !== 0">
        <div v-if="/username/gi.test(errors[0].message)">
          <div class="error" v-for="(error, i) in errors" :key="i">
            {{ error.message }}
          </div>
        </div>
      </div>

      <label for="email">Email</label>
      <input
        type="text"
        id="email"
        name="email"
        v-model="email"
        required
      />
      <h3>Email should be valid.</h3>
      <div v-if="errors.length !== 0">
        <div v-if="/email/gi.test(errors[0].message)">
          <div class="error" v-for="(error, i) in errors" :key="i">
            {{ error.message }}
          </div>
        </div>
      </div>

      <div v-if="errors.length !== 0">
        <div v-if="/password/gi.test(errors[0].message)">
          <div class="error password-error" v-for="(error, i) in errors" :key="i">
            {{ error.message }}
          </div>
        </div>
      </div>
      <label for="password">Password</label>
      <div class="flex">
        <input
          :type="[showPassword1 ? 'text' : 'password']"
          id="password"
          name="password"
          v-model="password"
          required
        />
        <i
          :class="[showPassword1 ? 'fa fa-eye-slash' : 'fa fa-eye']"
          @click="showPassword1 = !showPassword1"
        ></i>
      </div>
      <h3>
        Your password must be at least 8 characters long and contain at least
        one letter and number.
      </h3>

      <label for="password2">Confirm Password</label>
      <div class="flex">
        <input
          :type="[showPassword2 ? 'text' : 'password']"
          id="password2"
          name="password2"
          v-model="password2"
          required
        />
        <i
          :class="[showPassword2 ? 'fa fa-eye-slash' : 'fa fa-eye']"
          @click="showPassword2 = !showPassword2"
        ></i>
      </div>
      <h3>Passwords should both match.</h3>
      <Button value="Register" />
    </form>
    <router-link :to="{ name: 'Login' }"
      >Already, have an account? Login instead</router-link
    >
  </div>
</template>

<script>
import axios from "axios";
import Button from "@/components/Button.vue";
import { usernameValidator, emailValidator, passwordValidator } from "../../utils/validatorService.js"
export default {
  name: "SignUp",
  data() {
    return {
      username: "",
      email: "",
      showPassword1: false,
      showPassword2: false,
      password: "",
      password2: "",
      errors: [],
    };
  },
  components: {
    Button,
  },
  watch: {
    errors: {
      deep: true, 
      handler() {
        window.document.body.scrollTop = 25;
        window.document.documentElement.scrollTop = 25;
      }
    }
  },
  methods: {
    async signUp() {
      const self = this;
      if(usernameValidator(this.username)){
        this.errors = usernameValidator(this.username)
        return;
      }
      if(emailValidator(this.email)){
        this.errors = emailValidator(this.email)
        return;
      }
      if(passwordValidator(this.password, this.password2)){
        this.errors = passwordValidator(this.password, this.password2) 
        return; 
      }
      
      const newUser = {
        username: this.username.trim(),
        email: this.email.trim(),
        password: this.password,
        password2: this.password2,
      };
      try {
        const response = await axios.post(
          "/api/register",
          newUser
        );
        const data = response.data;
        console.log(data);
        if (response.data.fullHash) {
          localStorage.setItem("email", response.data.email);
          localStorage.setItem("hash", response.data.fullHash);
          self.$router.push({ name: "OTP" });
        } else {
          this.errors = data;
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
