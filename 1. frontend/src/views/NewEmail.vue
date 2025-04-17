<template>
  <div>
    <form @submit.prevent="changeEmail">
      <label for="email"><h1>Enter New Email</h1></label>
      <div class="error" v-if="error !== {}">
        {{ error.message }}
      </div>
      <input
        type="text"
        id="email"
        v-model="email"
        required
        autocomplete="off"
      />
      <Button value="Submit" class="btn" />
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Button from "@/components/Button.vue";
export default {
  name: "NewEmail",
  data() {
    return {
      email: "",
      error: {},
    };
  },
  components: {
    Button,
  },
  methods: {
    async changeEmail() {
      var email = this.email;
      if (/^[0-9]/.test(this.email)) {
        this.error = {
          message: "Please enter a valid email address.",
        };
        return;
      }
      if (!/[a-z0-9]{6,}@g?e?mail.com/.test(this.email)) {
        this.error = {
          message: "Please enter a valid email address",
        };
        return;
      }
      const formerEmail = localStorage.getItem("email");
      const emailObject = {
        formerEmail,
        newEmail: email,
      };
      const firstresponse = await axios.put(
        "/api/register",
        emailObject
      );
      if ((firstresponse.data.message = "Updated")) {
        try {
          const response = await axios.post("/api/resend", {
            email,
          });
          localStorage.setItem("email", response.data.email);
          localStorage.setItem("hash", response.data.hash);
          this.$router.push({ name: "OTP" });
        } catch (e) {
          console.log(e);
        }
      }
    },
  },
};
</script>
