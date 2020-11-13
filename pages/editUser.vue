<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="8" class="text-h6 font-weight-bold user-data"
          >Myユーザー情報</v-col
        >
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="userName"
            color="#0277bd"
            prepend-icon="mdi-account-edit"
            label="ユーザ名"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-file-input
            type="file"
            accept="image/*"
            placeholder="画像を選択してください"
            prepend-icon="mdi-image-edit-outline"
            label="アイコン編集"
            @change="setImage"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea
            v-model="profile"
            color="#0277bd"
            prepend-icon="mdi-chat"
            label="プロフィール"
            auto-grow
            rows="3"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <span class="font-weight-bold">興味あり：</span>
          <v-chip-group
            v-model="interestedTag"
            column
            multiple
            max="5"
            active-class="primary--text"
          >
            <v-chip v-for="item in tags" :key="item" :value="item">
              {{ item }}
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="div-edit-button">
          <v-btn
            rounded
            width="80vw"
            class="white--text button-color edit-button"
            outlined
            @click="edit"
            >編集完了</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
    <v-overlay
      class="crop-card-card"
      :absolute="true"
      opacity="1"
      :value="overlay"
    >
      <v-card v-if="overlay" class="crop-card" height="100%">
        <vue-cropper
          ref="cropper"
          class="crop"
          :guides="false"
          :view-mode="cropperViewMode"
          :high-light="false"
          drag-mode="move"
          :auto-crop-area="1.0"
          :background="false"
          :rotatable="true"
          :scalable="true"
          :crop-box-resizable="false"
          :crop-box-movable="false"
          :src="previousIcon"
          :aspect-ratio="1 / 1"
          :min-crop-box-height="windowSize.width"
          :min-crop-box-width="windowSize.width"
          :min-canvas-height="windowSize.width"
          :min-canvas-width="windowSize.width"
          :min-container-height="windowSize.width"
          :min-container-width="windowSize.width"
          :modal="true"
        ></vue-cropper>
      </v-card>
      <v-footer fixed>
        <v-btn @click="rechooseImage">画像を選び直す</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="cropImage">変更を保存する</v-btn>
      </v-footer>
    </v-overlay>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import VueCropper from 'vue-cropperjs';
import firebase from '~/plugins/firebase';
import 'cropperjs/dist/cropper.css';

export default {
  components: {
    VueCropper,
  },
  data() {
    return {
      userName: '',
      userIcon: '',
      profile: '',
      tags: [
        'ハッカソン',
        '開発コンテスト',
        'ビジネスコンテスト',
        'スポーツ観戦',
        'カフェ巡り',
        'アウトドア派',
        'インドア派',
        '旅行',
        '音楽',
        '読書',
        'カメラ',
        'ヨガ',
        'アニメ',
        'カラオケ',
        '映画鑑賞',
        'Netflix',
        '語学',
        '温泉めぐり',
        'インスタグラム',
        '自転車',
        'スマブラ',
        '居酒屋めぐり',
        'ピクニック',
        '散歩',
        'ジャニーズ',
        'ネコ好き',
        'KPOP',
        '麻雀',
        'ポーカー',
      ],
      interestedTag: '',
      overlay: false,
      windowSize: {
        height: '',
        width: '',
      },
      previousIcon: '',
      imageType: '',
      imageName: '',
      cropper: {
        side: 1,
        vertical: 1,
      },
      imageAfter: {
        name: null,
        src: null,
        BlobFile: null,
      },
      cropperViewMode: 0,
    };
  },
  computed: {
    ...mapGetters({ userId: 'uid' }),
  },
  created() {
    const db = firebase.firestore();
    const user = db.collection('users');

    user
      .doc(this.userId)
      .get()
      .then((doc) => {
        this.userName = doc.data().userName;
        this.userIcon = doc.data().userIcon;
        this.profile = doc.data().profile;
        this.interestedTag = doc.data().interestedTag;
      });
    this.windowSize = {
      width: this.$vuetify.breakpoint.width * 0.95,
    };
  },
  methods: {
    edit() {
      const userData = firebase.firestore().collection('users');
      userData
        .doc(this.userId)
        .update({
          userName: this.userName,
          profile: this.profile,
          interestedTag: this.interestedTag,
        })
        .then(() => {
          this.$router.push({ name: 'joinRoom' });
        });
    },
    setImage(e) {
      const img = new Image();
      img.onload = () => {
        const size = {
          width: img.naturalWidth,
          height: img.naturalHeight,
        };
        URL.revokeObjectURL(img.src);
        if (size.height > size.width) {
          this.cropperViewMode = 2;
          this.overlay = true;
        } else {
          this.cropperViewMode = 3;
          this.overlay = true;
        }
      };
      img.src = URL.createObjectURL(e);

      const reader = new FileReader();
      this.imageType = e.type;
      this.imageName = e.name;
      console.log(e);

      reader.onload = (event) => {
        this.previousIcon = event.target.result;
        console.log(event);
      };
      reader.readAsDataURL(e);
    },
    cropImage() {
      this.previousIcon = this.$refs.cropper
        .getCroppedCanvas({ width: 100, height: 100 })
        .toDataURL(this.imageType);
      this.imageAfter.BlobFile = this.dataURLtoBlob(this.previousIcon);
      this.changeIcon();
    },
    dataURLtoBlob(dataURL) {
      const convert = require('dataurl-to-blob');
      return convert(dataURL);
    },
    changeIcon() {
      const image = this.imageAfter.BlobFile;
      const users = firebase.firestore().collection('users').doc(this.userId);
      const storageRef = firebase
        .storage()
        .ref(`icon/${this.uid}`)
        .child(this.imageName);

      storageRef.put(image).then(() => {
        storageRef.getDownloadURL().then((url) => {
          users.update({ userIcon: url }).then(() => {
            alert('アイコンを変更しました');
            this.overlay = false;
          });
        });
      });
    },
    rechooseImage() {
      this.overlay = false;
    },
  },
};
</script>

<style>
.user-data {
  color: #29b6f6;
}
.div-edit-button {
  text-align: center;
}
.edit-button {
  background: linear-gradient(to right, #0277bd 0%, #29b6f6 50%);
}
.cropper-view-box,
.cropper-face {
  border-radius: 50%;
}
.crop-card {
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.crop-card-card {
  display: flex;
  align-items: center;
  justify-content: center;
}
.cropper-container {
  overflow: hidden;
}
</style>
