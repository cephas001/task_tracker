<template>
  <div class="login-wrapper" v-if="!loading">
    <div class="error" v-if="/email/gi.test(error.message)">
      {{ error.message }}
    </div>
    <form @submit.prevent="logIn">
      <label for="email">Email</label>
      <input type="text" id="email" name="email" required v-model="email" />
      <h3>Please enter the email provided during registration.</h3>

      <label for="password">Password</label>
      <div class="flex">
        <input
          id="password"
          name="password"
          v-model="password"
          :type="[showPassword ? 'text' : 'password']"
          required
        />
        <i
          :class="[showPassword ? 'fa fa-eye-slash' : 'fa fa-eye']"
          @click="showPassword = !showPassword"
        ></i>
      </div>
      <h3>Please enter the correct password provided during registration.</h3>
      <Button value="Log In" />
    </form>

    <router-link :to="{ name: 'SignUp' }"
      >Don't have an account? Register instead...</router-link
    >
    <router-link class="forget-password" :to="{name: 'ForgotPassword'}">Forget password?</router-link>
  </div>
</template>

<script>
import axios from "axios";
import Button from "@/components/Button.vue";
import { mapState } from "vuex";
import { emailValidator } from "../../utils/validatorService.js";
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      error: {},
    };
  },
  computed: {
    ...mapState(["loading"]),
  },
  components: {
    Button,
  },
  methods: {
    async logIn() {
      const userToLogIn = {
        email: this.email,
        password: this.password,
      };

      if(emailValidator(this.email)){
        this.error = emailValidator(this.email)[0]
        return;
      }

      const response = await axios.post(
        "/api/login",
        userToLogIn
      );
      if (response.data.message) {
        this.error = response.data;
        return;
      }
      localStorage.clear()
      localStorage.setItem("token", response.data.token);
      this.$router.push({ name: "Home" });
    },
  },
};
</script>
