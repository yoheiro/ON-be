<template>
  <v-bottom-navigation :app="true" fixed grow>
    <v-btn nuxt :ripple="false" class="pl-0" @click="toRoom">
      <span>ルーム</span>
      <v-icon>mdi-door-open</v-icon>
    </v-btn>
    <v-divider vertical></v-divider>
    <v-btn nuxt :ripple="false" class="pr-0" @click="toMypage">
      <span>マイページ</span>
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  methods: {
    toRoom() {
      this.$router.push({ name: 'joinRoom' });
    },
    toMypage() {
      this.$router.push({ name: 'mypage' });
    },
  },
};
</script>
