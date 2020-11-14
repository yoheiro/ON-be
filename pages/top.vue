<template>
  <v-container>
    <v-row>
      <v-col>現在beaconを検出中です。</v-col>
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
        uuid: '1233aacc-0dc1-40a7-8085-303a6d64ddb5',
        major: '4',
      },
      distancebe: 1000,
      isRoom: false,
    };
  },
  created() {
    const that = this;
    async function assignment() {
      await that.$store.commit('getMajor', that.obj);
    }
    assignment().then(this.getdis());
  },
  methods: {
    getdis() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady() {
      // Now safe to use device APIs
      const that = this;
      const uuid = '1233aacc-0dc1-40a7-8085-303a6d64ddb5';
      const identifier = 'beacons';
      const minor = '55';
      const major = '4';
      const beaconRegion = new cordova.plugins.locationManager.BeaconRegion(
        identifier,
        uuid,
        major,
        minor
      );

      // delegateの作成と設定
      const delegate = new cordova.plugins.locationManager.Delegate();

      // delegate.didDetermineStateForRegion = function(pluginResult) {
      //     // 領域への入退場のステータス変化を検知
      //     console.log(pluginResult);
      // };

      // delegate.didEnterRegion = function(pluginResult) {
      //     // ビーコンをキャッチした時に呼ばれる
      //     console.log(pluginResult);
      // };

      delegate.didRangeBeaconsInRegion = function (pluginResult) {
        const beaconData = pluginResult.beacons[0];
        that.distancebe = Math.pow(
          10.0,
          (beaconData.tx - beaconData.rssi) / 20.0
        );
        console.log('d = ' + that.distancebe);
        if (that.distancebe <= 10 && !that.isRoom) {
          that.$router.push({ name: 'detectionBeacon' });
          console.log('beaconに近づきました');
          that.isRoom = true;
        }
      };
      // delegate の設定
      cordova.plugins.locationManager.setDelegate(delegate);

      cordova.plugins.locationManager
        .startRangingBeaconsInRegion(beaconRegion)
        .fail(function (e) {
          console.error(e);
        })
        .done();
      // 監視の開始
      // cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
      //     .fail(function(e) { })
      //     .done();
    },
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
