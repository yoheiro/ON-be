<template>
  <div>
    <v-dialog v-model="dialog" width="500">
      <!-- <template v-slot:activator="{ on, attrs }"> </template> -->

      <v-card>
        <v-card-text class="pt-5">
          カメラを選択してください:<br />
          <select
            ref="AudioSelecter"
            v-model="selectedVideo"
            class="selectbox"
            @change="onChange"
          >
            <!-- <option disabled value="">カメラを選択してください</option> -->
            <option
              v-for="(video, key, index) in videos"
              :key="index"
              :value="video.value"
            >
              {{ video.text }}
            </option>
          </select>
          <br />
          マイクを選択してください:<br />
          <select v-model="selectedAudio" class="selectbox" @change="onChange">
            <!-- <option disabled value="">マイクを選択してください</option> -->
            <option
              v-for="(audio, key, index) in audios"
              :key="index"
              :value="audio.value"
            >
              {{ audio.text }}
            </option>
          </select>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="roomOpened === false"
            class="mx-3 my-2"
            outlined
            color="#29b6f6"
            @click="joinRoom"
          >
            ルームに参加する
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- {{ messages }} -->
    <v-row justify="center" align="center">
      <v-col cols="6">
        <div class="my-video-object">
          <video id="my-video" muted="true" autoplay playsinline></video>
          <div class="my-info">
            <v-icon
              :disabled="disableMyInfo"
              size="20px"
              color="#fff"
              @click="showMyInfo"
              >mdi-information-outline</v-icon
            >
          </div>
          <v-overlay :value="myInfoOverlay" z-index="100" :dark="false">
            <v-card class="my-info-card">
              <v-btn
                fab
                small
                color="#29b6f6"
                elevation="0"
                class="my-info-close"
                @click="closeMyInfo"
                ><v-icon>mdi-close</v-icon></v-btn
              >
              <user-info :user-id="userId" />
            </v-card>
          </v-overlay>
        </div>
      </v-col>
      <v-col cols="6">
        <v-list>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-subtitle style="text-align: center"
                >表示名</v-list-item-subtitle
              >
              <v-list-item-title style="text-align: center">{{
                myInfo.userName
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-overlay :value="partnerOverlay" z-index="100" :dark="false">
        <v-card class="my-info-card">
          <v-btn
            fab
            small
            color="#29b6f6"
            elevation="0"
            class="my-info-close"
            @click="partnerOverlay = !partnerOverlay"
            ><v-icon>mdi-close</v-icon></v-btn
          >
          <user-info :user-id="showingPartnerInfo" />
        </v-card>
      </v-overlay>
      <v-col v-for="(stream, index) in remoteStreams" :key="index" cols="6">
        <div class="my-video-object">
          <video
            class="partner-video"
            autoplay
            playsinline
            :srcObject.prop="stream"
          ></video>
          <div class="my-info">
            <v-icon
              size="20px"
              color="#fff"
              @click="showPartnerInfo(stream.peerId)"
              >mdi-information-outline</v-icon
            >
          </div>
        </div>
      </v-col>

      <br />
    </v-row>

    <v-bottom-navigation fixed grow>
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
import { mapGetters } from 'vuex';
import Peer from 'skyway-js';
import firebase from '~/plugins/firebase';
import userInfo from '~/components/userInfo';

export default {
  components: { userInfo },
  data() {
    return {
      APIKey: 'f0380daa-b6a9-43c6-b015-249eb77f026f',
      dialog: true,
      selectedAudio: '',
      selectedVideo: '',
      audios: [],
      videos: [],
      localStream: null,
      peerId: '',
      remoteStreams: [],
      roomOpened: false,
      messages: [],
      myInfo: {},
      myInfoOverlay: false,
      partnerOverlay: false,
      showingPartnerInfo: '',
      disableMyInfo: false,
    };
  },
  computed: {
    ...mapGetters({ userId: 'uid', roomId: 'major' }),
  },
  async created() {
    this.getMyData();

    await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true, // マイクから音声も取得する場合はtrue
    });
    this.peer = new Peer(this.userId, {
      key: this.APIKey,
      debug: 3,
    }); // 新規にPeerオブジェクトの作成
    // デバイスへのアクセス
    const deviceInfos = await navigator.mediaDevices.enumerateDevices();
    // オーディオデバイスの情報を取得

    const that = this;
    async function getLocalDevice() {
      await deviceInfos
        .filter((deviceInfo) => deviceInfo.kind === 'audioinput')
        .map((audio) =>
          that.audios.push({
            text: audio.label || `Microphone ${this.audios.length + 1}`,
            value: audio.deviceId,
          })
        );

      // カメラの情報を取得
      await deviceInfos
        .filter((deviceInfo) => deviceInfo.kind === 'videoinput')
        .map((video) =>
          that.videos.push({
            text: video.label || `Camera  ${this.videos.length - 1}`,
            value: video.deviceId,
          })
        );
    }

    getLocalDevice()
      .then(() => {
        this.selectedAudio = this.audios[0];
        this.selectedVideo = this.videos[0];
      })
      .then(() => {
        this.connectLocalCamera();
        this.joinRoom();
      });

    console.log(this.audios);
    console.log(this.videos);
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
      this.$router.push({ name: 'top' });
    },

    // 「div(joinTrigger)が押される＆既に接続が始まっていなかったら接続」するリスナーを設置
    joinRoom() {
      if (!this.peer.open) {
        return;
      }
      this.dialog = false;
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
        .doc(this.userId)
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
    showPartnerInfo(peerId) {
      console.log(peerId);
      this.showingPartnerInfo = peerId;
      this.partnerOverlay = !this.partnerOverlay;
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
  z-index: 5;
  width: 100%;
}
.my-info-close {
  position: absolute;
  text-align: right;
  right: 10px;
  top: 10px;
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

.selectbox {
  width: 90%;
  margin: 1em auto;
  position: relative;
}
select {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  padding: 1em 1em;
  box-sizing: border-box;
  font-size: 1em;
  border: #ccc 1px solid;
  border-radius: 0;
  background: #fff;
}
.selectbox::after {
  display: block;
  width: 10px;
  height: 10px;
  position: absolute;
  right: 5%;
  top: 35%;
  border-bottom: #333 2px solid;
  border-right: #333 2px solid;
  transform: rotate(45deg) translateY(-30%);
}
.color.selectbox select {
  background: blue;
  color: #fff;
  border-radius: 2em;
}
.color.selectbox::after {
  border-bottom: #fff 5px solid;
  border-right: #fff 5px solid;
}
</style>
