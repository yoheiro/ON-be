<template>
  <v-container>
    <v-row>
      <v-col cols="8" class="text-h6 font-weight-bold user-data"
        >Myユーザー情報</v-col
      >
      <v-col cols="4"><v-btn small @click="toEdit">編集する</v-btn></v-col>
    </v-row>
    <v-row>
      <v-col>
        <span class="font-weight-bold">ユーザー名：</span>{{ userName }}
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span class="font-weight-bold">アイコン：</span>
        <v-avatar color="grey darken-3" size="38">
          <v-img :src="userIcon"></v-img> </v-avatar
      ></v-col>
    </v-row>
    <v-row>
      <v-col>
        <span class="font-weight-bold">プロフィール：</span> {{ profile }}
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span class="font-weight-bold">興味あり：</span>
        <v-chip-group column>
          <v-chip
            v-for="tag in interestedTag"
            :key="tag"
            color="primary"
            outlined
          >
            {{ tag }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
export default {
  layout: 'protected',
  data() {
    return {
      userName: '',
      userIcon: '',
      profile: '',
      interestedTag: [],
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
  },
  methods: {
    toEdit() {
      this.$router.push({ name: 'editUser' });
    },
  },
};
</script>

<style>
.content-divider {
  border-color: #29b6f6;
}
.user-data {
  color: #29b6f6;
}
</style>
