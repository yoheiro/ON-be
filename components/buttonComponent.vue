<template>
  <v-btn
    class="login-button"
    rounded
    width="300px"
    color-text="white"
    :disabled="buttonDisabled"
    :type="buttonType"
    @click="buttonMethod"
  >
    <slot></slot>
  </v-btn>
</template>

<script>
export default {
  props: {
    buttonMethod: {
      type: Function,
      required: true,
    },
    buttonType: {
      type: String,
      required: true,
    },
    buttonDisabled: {
      type: Boolean,
      required: false,
    },
  },
};
</script>

<style scoped>
.login-button {
  background: linear-gradient(to right, #0277bd 0%, #29b6f6 50%);
}
</style>
