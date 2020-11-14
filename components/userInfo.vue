<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <span class="font-weight-bold">ユーザー名：</span
          >{{ userInfo.userName }}
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <span class="font-weight-bold">アイコン：</span>
          <v-avatar color="grey darken-3" size="38">
            <v-img :src="userInfo.userIcon"></v-img> </v-avatar
        ></v-col>
      </v-row>
      <v-row>
        <v-col>
          <span class="font-weight-bold">プロフィール：</span>
          {{ userInfo.profile }}
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <span class="font-weight-bold">興味あり：</span>
          <v-chip-group column>
            <v-chip
              v-for="tag in userInfo.interestedTag"
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
  </div>
</template>

<script>
import firebase from '~/plugins/firebase';
export default {
  props: {
    userId: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      userInfo: [],
    };
  },
  created() {
    console.log(this.userId);
    this.getUserData().then(() => {
      console.log(this.userInfo);
    });
  },
  methods: {
    async getUserData() {
      this.userInfo = await firebase
        .firestore()
        .collection('users')
        .doc(this.userId)
        .get()
        .then((doc) => {
          return doc.data();
        });
    },
  },
};
</script>
