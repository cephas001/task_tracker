<template>
  <div class="entry-wrapper">
    <h1 class="entry-greetings">
     Task Tracker
     <sub>increasing productivity...</sub>
    </h1>
  
    <div class="links">
      <router-link :to="{ name: 'Login' }">Login</router-link>

      <router-link :to="{ name: 'SignUp' }">Sign Up</router-link>

      <router-link :to="{ name: 'Contact2' }">Contact Us</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Entry",
};
</script>
