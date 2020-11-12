<template>
  <div>
    <div class="title">{{ title }}</div>
    <template>
      <InputComponent
        style="margin-bottom: 10px"
        :input-text="textEmail"
        :input-value="inputEmail"
        :input-type="emailType"
        @input="inputEmail = $event"
      />
    </template>
    <div class="validation-email">{{ emailValidation }}</div>
    <div class="login-button-div">
      <template>
        <ButtonComponent
          class="reset-button"
          style="color: white"
          :button-text="loginButton"
          :button-method="reset"
          :button-type="typeSubmit"
          :button-disabled="loginValidation"
          >送信</ButtonComponent
        >
      </template>
    </div>
    <div class="toLogin" @click="$router.push({ name: 'login' })">
      ログイン画面へ
    </div>
  </div>
</template>

<script>
import InputComponent from '../components/inputComponent';
import ButtonComponent from '../components/buttonComponent';
import firebase from '~/plugins/firebase';

export default {
  components: {
    InputComponent,
    ButtonComponent,
  },
  data() {
    return {
      title: 'パスワードリセット',
      textEmail: 'メールアドレス',
      loginButton: '送信',
      typeSubmit: 'submit',
      inputEmail: '',
      emailType: 'text',
      emailValidation: '',
      loginValidation: true,
    };
  },
  watch: {
    inputEmail(value) {
      if (value.length === 0) {
        this.emailValidation = 'メールアドレスを入力して下さい';
        this.loginValidation = true;
      } else if (
        !new RegExp(
          /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/
        ).test(value)
      ) {
        this.emailValidation = '有効なメールアドレスを入力してください';
        this.loginValidation = true;
      } else {
        this.emailValidation = '';
        this.loginValidation = false;
      }
    },
  },
  methods: {
    reset() {
      const auth = firebase.auth();
      const that = this;
      const email = this.inputEmail;

      firebase.auth().languageCode = 'ja';
      auth
        .sendPasswordResetEmail(email)
        .then(function () {
          alert('パスワードの再設定メールを送信しました');
          localStorage.removeItem('userPassword');
        })
        .then(function () {
          that.$router.push({ name: 'login' });
        });
    },
  },
};
</script>
<style scoped>
.login-button-div {
  text-align: center;
}
.title {
  text-align: center;
  margin-top: 50px;
  margin-bottom: 30px;
}
.validation-email {
  text-align: center;
  font-size: 13px;
  color: red;
  margin-bottom: 10px;
}
.reset-button {
  color: white;
  margin-top: 10px;
}
.toLogin {
  color: rgb(109, 109, 109);
  text-decoration: underline;
  cursor: pointer;
  text-align: center;
  margin-top: 30px;
  font-size: 15px;
}
</style>
