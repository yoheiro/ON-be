<template>
  <div>
    <h1 class="title">On be</h1>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase';

export default {
  data() {
    return {
      userPassword: '',
      userEmail: '',
    };
  },
  created() {
    this.compFunc();
  },
  methods: {
    setUserEmail(val) {
      return new Promise((resolve) => {
        this.$store.commit('getUid', val);
        resolve();
      });
    },
    getPushPermission() {
      try {
        window.FirebasePlugin.hasPermission(function (hasPermission) {
          if (hasPermission) {
            alert('OK');
          } else {
            window.FirebasePlugin.grantPermission(
              function () {},
              function (error) {
                alert(error);
              }
            );
          }
        });
      } catch (error) {
        alert(error);
      }
    },
    login() {
      const that = this;
      this.userPassword = localStorage.getItem('userPassword');
      this.userEmail = localStorage.getItem('userEmail');
      // ログアウトしてuserEmailとuserPasswordがundefinedのときはlogin.vueに遷移
      if (this.userEmail === null || this.userPassword === null) {
        that.$router.push({ name: 'login' });
      } else {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.userEmail, this.userPassword)
          .then(() => {
            firebase.auth().onAuthStateChanged(async (user) => {
              // 認証メールを認証していない時login.vueに遷移
              if (!user.emailVerified) {
                await (() => {
                  this.modalVisible = false;
                  this.dialog = !this.dialog;
                  this.dialogTitle = '認証エラー';
                  this.dialogText = '認証メールを確認してください';
                  this.buttonText = 'Ok';
                });
                this.$router.push({ name: 'login' });
              } else {
                await this.setUserEmail(user);
                this.$router.push({ name: 'video' });
              }
            });
          })
          .catch(function () {
            setTimeout(function () {
              that.$router.push({ name: 'login' });
            }, 1000);
          });
      }
    },
    compFunc() {
      // this.getPushPermission();
      this.login();
    },
  },
};
</script>
<style scoped>
.title {
  text-align: center;
  color: #ffab91;
}
</style>
