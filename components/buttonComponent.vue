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
  background: -webkit-linear-gradient(to right, #e64a19 0%, #ff8a65 50%)
    no-repeat !important;
  background: linear-gradient(to right, #e64a19 0%, #ff8a65 50%) no-repeat !important;
  opacity: 0.5;
}
</style>
