<template>
  <div>
    {{ messages }}
    <v-row justify="center" align="center">
      <v-col cols="6">
        <div class="my-video-object">
          <video id="my-video" muted="true" autoplay playsinline></video>
          <div class="my-info">
            <v-icon :disabled="disableMyInfo" size="20px" @click="showMyInfo"
              >mdi-information-outline</v-icon
            >
          </div>
          <v-overlay :value="myInfoOverlay" :dark="false">
            <v-card class="my-info-card">
              <v-btn fab small class="my-info-close" @click="closeMyInfo"
                ><v-icon>mdi-close</v-icon></v-btn
              >
              <v-list>
                <v-list-item>
                  <v-list-item-icon class="ml-3">
                    <v-avatar><img :src="myInfo.userIcon" /></v-avatar>
                  </v-list-item-icon>
                  <v-list-item-content>
                    {{ myInfo.userName }}
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="ml-3" style="text-align: left"
                      >自己紹介文</v-list-item-title
                    >
                    <p>{{ myInfo.profile }}</p>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-overlay>
        </div>
      </v-col>
      <v-col cols="6">
        <v-list>
          <v-list-item>kaji</v-list-item>
          <v-list-item>静岡大学</v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-col v-for="(stream, index) in remoteStreams" :key="index" cols="6">
        <div>
          <video
            class="partner-video"
            autoplay
            playsinline
            :srcObject.prop="stream"
          ></video>
        </div>
      </v-col>
      <button
        v-if="roomOpened === false"
        class="button--green"
        @click="joinRoom"
      >
        Join
      </button>
      <br />
    </v-row>
    <input v-model="roomId" type="text" placeholder="Room Name" />
    <p>
      ROOM ID: <span id="room-id">{{ roomId }}</span>
    </p>
    <div>
      カメラ:
      <select ref="AudioSelecter" v-model="selectedVideo" @change="onChange">
        <option disabled value="">Please select one</option>
        <option
          v-for="(video, key, index) in videos"
          :key="index"
          :value="video.value"
        >
          {{ video.text }}
        </option>
      </select>
    </div>
    マイク:
    <select v-model="selectedAudio" @change="onChange">
      <option disabled value="">Please select one</option>
      <option
        v-for="(audio, key, index) in audios"
        :key="index"
        :value="audio.value"
      >
        {{ audio.text }}
      </option>
    </select>
    <v-bottom-navigation fixed>
      <v-btn @click="audioEnabled">
        <span>オーディオ</span>
        <v-icon>mdi-microphone</v-icon>
      </v-btn>

      <v-btn @click="cameraEnabled">
        <span>カメラ</span>
        <v-icon>mdi-camera</v-icon>
      </v-btn>

      <v-btn @click="leaveRoom">
        <span>退出</span>

        <v-icon>mdi-door</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
import Peer from 'skyway-js';
import firebase from '~/plugins/firebase';

export default {
  data() {
    return {
      APIKey: 'f0380daa-b6a9-43c6-b015-249eb77f026f',
      selectedAudio: '',
      selectedVideo: '',
      audios: [],
      videos: [],
      localStream: null,
      peerId: '',
      roomId: '1234',
      remoteStreams: [],
      roomOpened: false,
      messages: [],
      myInfo: {},
      myInfoOverlay: false,
      disableMyInfo: false,
    };
  },
  async created() {
    await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true, // マイクから音声も取得する場合はtrue
    });

    this.peer = new Peer({
      key: this.APIKey,
      debug: 3,
    }); // 新規にPeerオブジェクトの作成

    // デバイスへのアクセス
    const deviceInfos = await navigator.mediaDevices.enumerateDevices();

    // オーディオデバイスの情報を取得
    deviceInfos
      .filter((deviceInfo) => deviceInfo.kind === 'audioinput')
      .map((audio) =>
        this.audios.push({
          text: audio.label || `Microphone ${this.audios.length + 1}`,
          value: audio.deviceId,
        })
      );

    // カメラの情報を取得
    deviceInfos
      .filter((deviceInfo) => deviceInfo.kind === 'videoinput')
      .map((video) =>
        this.videos.push({
          text: video.label || `Camera  ${this.videos.length - 1}`,
          value: video.deviceId,
        })
      );
  },
  methods: {
    // 端末のカメラ音声設定
    onChange() {
      if (this.selectedAudio !== '' && this.selectedVideo !== '') {
        this.connectLocalCamera();
      }
    },

    async connectLocalCamera() {
      const constraints = {
        audio: this.selectedAudio
          ? { deviceId: { exact: this.selectedAudio } }
          : false,
        video: this.selectedVideo
          ? { deviceId: { exact: this.selectedVideo } }
          : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      document.getElementById('my-video').srcObject = stream;
      this.localStream = stream;
    },

    leaveRoom() {
      if (!this.peer.open) {
        return;
      }
      this.roomOpened = false;
      this.remoteStreams = [];
      this.room.close();
    },

    // 「div(joinTrigger)が押される＆既に接続が始まっていなかったら接続」するリスナーを設置
    joinRoom() {
      if (!this.peer.open) {
        return;
      }
      this.roomOpened = true; // 部屋に接続するメソッド（joinRoom）
      this.room = this.peer.joinRoom(this.roomId, {
        mode: 'sfu',
        stream: this.localStream,
      }); // 部屋に接続できた時（open）に一度だけdiv(messages)に=== You joined ===を表示
      this.room.once('open', () => {
        this.messages.push('=== You joined ===');
      }); // 部屋に誰かが接続してきた時（peerJoin）、いつでもdiv(messages)に下記のテキストを表示
      this.room.on('peerJoin', (peerId) => {
        this.messages.push(`=== ${peerId} joined ===`);
      });
      // 重要：streamの内容に変更があった時（stream）videoタグを作って流す
      this.room.on('stream', async (stream) => {
        await this.remoteStreams.push(stream);
        console.log('リモートストリーム');
        console.log(this.remoteStreams);
      });

      // 重要：誰かがテキストメッセージを送った時、messagesを更新
      this.room.on('data', ({ data, src }) => {
        this.messages.push(`${src}: ${data}`);
      });

      // 誰かが退出した場合、div（remoteVideos）内にある、任意のdata-peer-idがついたvideoタグの内容を空にして削除する
      this.room.on('peerLeave', (peerId) => {
        const index = this.remoteStreams.findIndex((v) => v.peerId === peerId);
        this.remoteStreams.splice(index, 1);
        this.messages.push(`=== ${peerId} left ===`);
      });

      // 自分が退出した場合の処理
      this.room.once('close', () => {
        // メッセージ送信ボタンを押せなくする
        this.messages.length = 0;
      });
    },
    async getMyData() {
      this.myInfo = await firebase
        .firestore()
        .collection('users')
        .doc('4w7Q9B9ziaPjVQnsniQftUhMoIF3')
        .get()
        .then((doc) => {
          return doc.data();
        });
    },
    showMyInfo() {
      this.disableMyInfo = !this.disableMyInfo;
      this.getMyData().then(() => {
        this.myInfoOverlay = !this.myInfoOverlay;
      });
    },
    closeMyInfo() {
      this.myInfoOverlay = !this.myInfoOverlay;
      this.disableMyInfo = !this.disableMyInfo;
    },
    cameraEnabled() {
      const videoTrack = this.localStream.getVideoTracks()[0];
      console.log(videoTrack);
      videoTrack.enabled = !videoTrack.enabled;
    },
    audioEnabled() {
      console.log(this.localStream.getAudioTracks());
      const audioTrack = this.localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      console.log(audioTrack.enabled);
    },
    test() {
      console.log(this.$refs.AudioSelecter);
    },
  },
};
</script>

<style scoped>
#my-video {
  transform: rotateY(180deg);
  max-width: 100%;
  border-radius: 10px;
  border: solid 3px #6091d3;
}

.my-video-object,
.my-info-card {
  position: relative;
  display: flex;
  flex-direction: column;
}

.my-info {
  position: absolute;
  text-align: right;
  right: 3px;
  z-index: 10;
  width: 100%;
}
.my-info-close {
  position: absolute;
  text-align: right;
  right: 3px;
  z-index: 100;
}
.partner-video {
  max-width: 100%;
  border-radius: 10px;
  border: solid 3px #6091d3;
}

.my-info-card {
  width: 90vw;
  border-radius: 10px;
}
</style>
