<template>
  <div>
    <link
      href="https://fonts.googleapis.com/css?family=Roboto:100,400,300,500,700"
      rel="stylesheet"
      type="text/css"
    />

    <div class="conteneur" align="center">
      <div class="css3_div">
        <img src="../assets/beacon.png" height="230px" />
        <div class="txtcss">
          <font style="font-weight: 300; font-size: 33px"
            >Beaconを検知しました</font
          >
        </div>
      </div>
      <div class="html5_div">
        <img
          src="../assets/drink-space.png"
          width="230px"
          style="border-radius: 10px"
        />
        <div class="txthtml">
          <font style="font-weight: 300; font-size: 33px"
            >ドリンク休憩ルームに<br />入りました</font
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  created() {
    const that = this;
    const toRoom = function () {
      that.$router.push({ name: 'joinRoom' });
    };
    setTimeout(toRoom, 5000);
  },
};
</script>
<style>
.conteneur {
  background-color: #cce7f3;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
}
.css3_div {
  -webkit-animation-duration: 4.4s;
  -webkit-animation-iteration-count: 1;
  -webkit-animation-fill-mode: both;
  -webkit-animation-name: first;
  -moz-animation-duration: 4.4s;
  -moz-animation-iteration-count: 1;
  -moz-animation-fill-mode: both;
  -moz-animation-name: first;
  -ms-animation-duration: 4.4s;
  -ms-animation-iteration-count: 1;
  -ms-animation-fill-mode: both;
  -ms-animation-name: first;
  animation-duration: 4.4s;
  animation-iteration-count: 1;
  animation-fill-mode: both;
  animation-name: first;
}
@-webkit-keyframes first {
  0% {
    -webkit-transform: translate(000px, 1500px);
  }
  20% {
    -webkit-transform: translate(000px, 65px);
  }
  25%,
  65%,
  75% {
    -webkit-transform: translate(000px, 85px);
  }
  100% {
    -webkit-transform: translate(000px, -300px);
  }
}
@-moz-keyframes first {
  0% {
    -moz-transform: translate(000px, 1500px);
  }
  20% {
    -moz-transform: translate(000px, 65px);
  }
  25%,
  65%,
  75% {
    -moz-transform: translate(000px, 85px);
  }
  100% {
    -moz-transform: translate(000px, -300px);
  }
}
@-ms-keyframes first {
  0% {
    -ms-transform: translate(000px, 1500px);
  }
  20% {
    -ms-transform: translate(000px, 65px);
  }
  25%,
  65%,
  75% {
    -ms-transform: translate(000px, 85px);
  }
  100% {
    -ms-transform: translate(000px, -300px);
  }
}
@keyframes first {
  0% {
    transform: translate(000px, 1500px);
  }
  20% {
    transform: translate(000px, 65px);
  }
  25%,
  65%,
  75% {
    transform: translate(000px, 85px);
  }
  100% {
    transform: translate(000px, -300px);
  }
}
.txtcss {
  vertical-align: top;
  text-align: center;
  color: #a0711a;
  font-family: 'Roboto';
  margin-left: 10px;
  height: 95px;
  overflow: hidden;
  -webkit-animation-delay: 0.4s;
  -webkit-animation-duration: 1s;
  -webkit-animation-iteration-count: 1;
  -webkit-animation-fill-mode: both;
  -webkit-animation-name: txtcss;
  -moz-animation-delay: 0.4s;
  -moz-animation-duration: 1s;
  -moz-animation-iteration-count: 1;
  -moz-animation-fill-mode: both;
  -moz-animation-name: txtcss;
  -ms-animation-delay: 0.4s;
  -ms-animation-duration: 1s;
  -ms-animation-iteration-count: 1;
  -ms-animation-fill-mode: both;
  -ms-animation-name: txtcss;
  animation-delay: 0.4s;
  animation-duration: 1s;
  animation-iteration-count: 1;
  animation-fill-mode: both;
  animation-name: txtcss;
}
@-webkit-keyframes txtcss {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.html5_div {
  -webkit-animation-delay: 0.4s;
  -webkit-animation-duration: 4.4s;
  -webkit-animation-iteration-count: 1;
  -webkit-animation-fill-mode: both;
  -webkit-animation-name: second;
  -moz-animation-delay: 0.4s;
  -moz-animation-duration: 4.4s;
  -moz-animation-iteration-count: 1;
  -moz-animation-fill-mode: both;
  -moz-animation-name: second;
  -ms-animation-delay: 0.4s;
  -ms-animation-duration: 4.4s;
  -ms-animation-iteration-count: 1;
  -ms-animation-fill-mode: both;
  -ms-animation-name: second;
  animation-delay: 0.4s;
  animation-duration: 4.4s;
  animation-iteration-count: 1;
  animation-fill-mode: both;
  animation-name: second;
}
@-webkit-keyframes second {
  0% {
    -webkit-transform: translate(000px, 1500px);
  }
  20% {
    -webkit-transform: translate(000px, 1500px);
  }
  25%,
  65% {
    -webkit-transform: translate(000px, 1500px);
  }
  100% {
    -webkit-transform: scale(2.3);
  }
}
@-moz-keyframes second {
  0% {
    -moz-transform: translate(000px, 1500px);
  }
  20% {
    -webkit-transform: translate(000px, 1500px);
  }
  25%,
  65% {
    -webkit-transform: translate(000px, 1500px);
  }
  100% {
    -moz-transform: scale(2.3);
  }
}
@-ms-keyframes second {
  0% {
    -ms-transform: translate(000px, 1500px);
  }
  20% {
    -webkit-transform: translate(000px, 1500px);
  }
  25%,
  65% {
    -webkit-transform: translate(000px, 1500px);
  }
  100% {
    -ms-transform: scale(2.3);
  }
}
@keyframes second {
  0% {
    transform: translate(000px, 1500px);
  }
  20% {
    -webkit-transform: translate(000px, 1500px);
  }
  25% {
    -webkit-transform: translate(000px, 1500px);
  }
  65% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(11.3);
  }
}
.txthtml {
  vertical-align: top;
  text-align: center;
  color: #a0711a;
  font-family: 'Roboto';
  margin-left: 10px;
  height: 95px;
  overflow: hidden;
  -webkit-animation-delay: 0.4s;
  -webkit-animation-duration: 0.6s;
  -webkit-animation-iteration-count: 0.3;
  -webkit-animation-fill-mode: both;
  -webkit-animation-name: txthtml;
  -moz-animation-delay: 0.4s;
  -moz-animation-duration: 0.6s;
  -moz-animation-iteration-count: 0.3;
  -moz-animation-fill-mode: both;
  -moz-animation-name: txthtml;
  -ms-animation-delay: 0.4s;
  -ms-animation-duration: 0.6s;
  -ms-animation-iteration-count: 0.3;
  -ms-animation-fill-mode: both;
  -ms-animation-name: txthtml;
  animation-delay: 0.4s;
  animation-duration: 0.6s;
  animation-iteration-count: 0.3;
  animation-fill-mode: both;
  animation-name: txthtml;
}
@-webkit-keyframes txthtml {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-moz-keyframes txthtml {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-ms-keyframes txthtml {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes txthtml {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
