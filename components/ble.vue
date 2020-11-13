<template>
  <div>
    <div>
      {{distancebe}}
    </div>
  </div>
</template>
<script>
export default {
    name:'ble',
  data() {
    return {
      distancebe : "please wait!",

    }
  },
  methods:{
    getdis() {
    document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    // Now safe to use device APIs
     
    var uuid = '1233aacc-0dc1-40a7-8085-303a6d64ddb5';
    var identifier = 'beacons';
    var minor="55";
    var major="4";
    var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);
    
 
// delegateの作成と設定
var delegate = new cordova.plugins.locationManager.Delegate();

   
// delegate.didDetermineStateForRegion = function(pluginResult) {
//     // 領域への入退場のステータス変化を検知
//     console.log(pluginResult);
// };
 
// delegate.didEnterRegion = function(pluginResult) {
//     // ビーコンをキャッチした時に呼ばれる  
//     console.log(pluginResult);
// };
   
delegate.didRangeBeaconsInRegion = function(pluginResult) {
    var beaconData = pluginResult.beacons[0];
    this.distancebe=((Math.pow(10.0, (beaconData.tx - beaconData.rssi) / 20.0)));
    console.log("d = "+this.distancebe);
}
// delegate の設定
cordova.plugins.locationManager.setDelegate(delegate);

cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
	.fail(function(e) { console.error(e); })
	.done();
// 監視の開始
// cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
//     .fail(function(e) { })
//     .done();



}

  }
  }
  ,
  mounted(){
    this.getdis()
  }
}
</script>