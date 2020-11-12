<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <div v-for="(stream, index) in remoteStreams" :key="index">
        <video autoplay playsinline :srcObject.prop="stream"></video>
      </div>
      <video
        id="my-video"
        muted="true"
        width="500"
        autoplay
        playsinline
      ></video>
      <input v-model="roomId" type="text" placeholder="Room Name" />
      <p>
        ROOM ID: <span id="room-id">{{ roomId }}</span>
      </p>
      <button
        v-if="roomOpened === true"
        class="button--green"
        @click="leaveRoom"
      >
        Leave
      </button>
      <button v-else class="button--green" @click="joinRoom">Join</button>
      <br />
      <div>
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

        カメラ:
        <select v-model="selectedVideo" @change="onChange">
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
    </v-col>
  </v-row>
</template>

<script>
import Peer from 'skyway-js';

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
      roomId: '',
      remoteStreams: [],
      roomOpened: false,
    };
  },
  async created() {
    // ここでpeerのリスナーを設置
    this.peer = new Peer({ key: this.APIKey, debug: 3 }); // 新規にPeerオブジェクトの作成

    // デバイスへのアクセス
    const deviceInfos = await navigator.mediaDevices.enumerateDevices();
    console.log(deviceInfos);

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
        console.log('onchange');
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
      });

      // 重要：誰かがテキストメッセージを送った時、messagesを更新
      this.room.on('data', ({ data, src }) => {
        this.messages.push(`${src}: ${data}`);
      });

      // 誰かが退出した場合、div（remoteVideos）内にある、任意のdata-peer-idがついたvideoタグの内容を空にして削除する
      this.room.on('peerLeave', (peerId) => {
        // const index = this.remoteStreams.findIndex((v) => v.peerId === peerId);
        // const removedStream = this.remoteStreams.splice(index, 1);
        this.messages.push(`=== ${peerId} left ===`);
      });

      // 自分が退出した場合の処理
      this.room.once('close', () => {
        // メッセージ送信ボタンを押せなくする
        this.messages.length = 0;
      });
    },
  },
};
</script>

<style scoped>
#my-video {
  transform: rotateY(180deg);
  max-width: 40vw;
}
</style>
