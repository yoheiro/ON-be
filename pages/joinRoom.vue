<template>
  <v-container>
    <v-row>
      <v-col class="text-h6 font-weight-bold user-data"
        >Beacon検知したルーム
      </v-col>
    </v-row>
    <v-row>
      <v-col
        ><v-card class="mx-auto" max-width="344" @click="joinRoom">
          <v-img :src="roomImg" height="200px"></v-img>

          <v-card-title>{{ roomName }}</v-card-title>

          <v-card-subtitle>
            {{ userNumbers }}人が雑談しています。</v-card-subtitle
          >

          <v-list-item>
            <div v-for="(item, index) in userIcons" :key="index">
              <v-list-item-avatar color="grey darken-3">
                <v-img :src="item.icon"></v-img>
              </v-list-item-avatar>
            </div> </v-list-item></v-card
      ></v-col>
    </v-row>
    <!-- <v-divider class="mt-4 content-divider"></v-divider> -->
    <!-- <v-row>
      <v-col class="text-h6 font-weight-bold user-data"> 他のルーム </v-col>
    </v-row>
    <v-row>
      <v-col
        ><v-card
          v-for="(item, index) in roomArray"
          :key="index"
          class="mx-auto mt-2"
          max-width="344"
        >
          <v-img :src="item.roomImg" height="200px"></v-img>

          <v-card-title>{{ item.roomName }}</v-card-title>

          <v-card-subtitle>
            {{ item.userNumbers }}人が雑談しています。</v-card-subtitle
          >
        </v-card></v-col
      >
    </v-row> -->
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from '~/plugins/firebase';
export default {
  layout: 'protected',
  data() {
    return {
      userNumbers: '',
      userIcons: [],
      userIconsRoom: [],
      roomArray: [],
      roomName: '',
      roomImg: '',
    };
  },
  computed: {
    ...mapGetters({ userId: 'uid' }),
  },
  created() {
    const db = firebase.firestore();
    const room = db.collection('room').doc('kaji');
    const rooms = db.collection('rooms');
    const user = db.collection('users');
    room.get().then((doc) => {
      this.roomName = doc.data().roomName;
      this.roomImg = doc.data().roomImg;
      const uids = doc.data().uids;
      this.userNumbers = uids.length;
      uids.forEach((uid) => {
        user
          .doc(uid)
          .get()
          .then((doc) => {
            this.userIcons = [...this.userIcons, { icon: doc.data().userIcon }];
          });
      });
    });

    rooms.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        this.roomArray = [
          ...this.roomArray,
          {
            roomName: doc.data().roomName,
            roomImg: doc.data().roomImg,
            uids: doc.data().uids,
            userNumbers: doc.data().uids.length,
          },
        ];
      });
    });
  },
  methods: {
    joinRoom() {
      this.$router.push({ name: 'video' });
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
