<template>
  <v-container>
    <v-row>
      <v-col>現在検出可能なbeaconがありません。</v-col>
    </v-row>
    <v-row>
      <v-col cols="12"
        ><v-img
          class="keyframe animation"
          :src="require('~/assets/beacon.png')"
        ></v-img
      ></v-col>
    </v-row>
    <v-row>
      <v-col><nuxt-link to="/joinRoom">部屋へ</nuxt-link></v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      obj: {
        uuid: '',
        major: 'kaji',
      },
    };
  },
  created() {
    const that = this;
    async function assignment() {
      await that.$store.commit('getMajor', that.obj);
    }
    assignment().then();
  },
};
</script>

<style>
.animation {
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-duration: 1.5s;
}
.keyframe {
  animation-name: anim_sc;
  transform: scale(0.85, 0.85);
}
@keyframes anim_sc {
  100% {
    transform: scale(1, 1);
  }
}
</style>
