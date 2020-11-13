<template>
  <v-app>
    <v-main class="main-layout-styles">
      <nuxt />
    </v-main>
    <bottom-tab />
  </v-app>
</template>
<script>
import BottomTab from '~/components/mainBottom';
export default {
  components: {
    BottomTab,
  },
};
</script>
<style scoped>
.main-layout-styles {
  height: 100%;
}
</style>
