<template>
  <div class="home">
    <button>{{ value }}</button>
  </div>
</template>

<script>
export default {
  name: "Button",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
};
</script>
