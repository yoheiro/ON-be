<template>
  <div class="input-place">
    <input
      class="input-text"
      :type="inputType"
      :placeholder="inputText"
      :value="inputValue"
      @input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  props: {
    inputText: {
      type: String,
      required: true,
    },
    inputValue: {
      type: String,
      required: true,
    },
    inputType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
};
</script>
<style scoped>
.input-place {
  text-align: center;
  margin: 10px;
}
.input-text {
  border: 1px solid #0277bd;
  border-radius: 25px;
  padding: 9px 20px 9px 20px;
  width: 300px;
  outline: none;
}
</style>
