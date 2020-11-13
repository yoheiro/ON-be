<template>
  <div>
    <div class="title">{{ loginTitle }}</div>
    <template>
      <Dialog
        :modal-title="dialogTitle"
        :modal-text="dialogText"
        :modal-button="buttonText"
        :modal-toggle="dialog"
        @changeValue="clickDialog()"
      />
    </template>
    <template>
      <InputComponent
        :input-text="textEmail"
        :input-value="inputEmail"
        :input-type="emailType"
        @input="inputEmail = $event"
      />
    </template>
    <div class="validation-email">{{ emailValidation }}</div>
    <template>
      <InputComponent
        :input-text="textPassword"
        :input-value="inputPassword"
        :input-type="passwordType"
        @input="inputPassword = $event"
      />
    </template>
    <div class="validation-password">{{ passwordValidation }}</div>
    <div class="login-button-div">
      <ButtonComponent
        :button-method="login"
        :button-type="typeSubmit"
        :button-disabled="loginValidation"
        >ログイン</ButtonComponent
      >
    </div>
    <div class="forget-text" @click="resetPassword()">{{ forgetText }}</div>
    <div class="for-new" @click="toSignup()">{{ forNewtext }}</div>
    <!-- <button @click="getToken()">token</button> -->
  </div>
</template>

<script>
import InputComponent from '../components/inputComponent';
import ButtonComponent from '../components/buttonComponent';
import Dialog from '../components/modalComponent';
import firebase from '~/plugins/firebase';

export default {
  components: {
    InputComponent,
    ButtonComponent,
    Dialog,
  },
  data() {
    return {
      loginTitle: 'ログイン',
      forgetText: 'パスワードを忘れた方',
      forNewtext: '新規登録',
      textEmail: 'メールアドレス',
      textPassword: '英数字6桁以上',
      inputEmail: localStorage.getItem('userEmail'),
      inputPassword: localStorage.getItem('userPassword'),
      emailType: 'text',
      passwordType: 'password',
      typeSubmit: 'submit',
      emailValidation: '',
      passwordValidation: '',
      loginValidation: true,
      completedEmail: false,
      completedPassword: false,
      iconUrl: '',
      dialog: false,
      dialogTitle: '',
      dialogText: '',
      buttonText: '',
    };
  },
  watch: {
    inputEmail(value) {
      if (value.length === 0) {
        this.emailValidation = 'メールアドレスを入力して下さい';
        this.completedEmail = 'false';
        this.check();
      } else if (
        !new RegExp(
          /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/
        ).test(value)
      ) {
        this.emailValidation = '有効なメールアドレスを入力してください';
        this.completedEmail = 'false';
        this.check();
      } else {
        this.emailValidation = '';
        this.completedEmail = 'true';
        this.check();
      }
    },
    inputPassword(value) {
      if (value.length >= 6) {
        this.passwordValidation = '';
        this.completedPassword = 'true';
        this.check();
      } else {
        this.passwordValidation = '6文字以上の英数字を入力して下さい';
        this.completedPassword = 'false';
        this.check();
      }
    },
  },
  created() {
    const isEmailValid = new RegExp(
      /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/
    ).test(this.inputEmail);

    if (this.inputPassword) {
      if (isEmailValid && this.inputPassword.length >= 6) {
        this.loginValidation = false;
      }
    }
  },
  methods: {
    login() {
      const that = this;
      localStorage.setItem('userEmail', this.inputEmail);
      localStorage.setItem('userPassword', this.inputPassword);
      firebase
        .auth()
        .signInWithEmailAndPassword(this.inputEmail, this.inputPassword)
        .then(() => {
          firebase.auth().onAuthStateChanged(async (user) => {
            if (!user.emailVerified) {
              this.modalVisible = false;
              this.dialog = !this.dialog;
              this.dialogTitle = '認証エラー';
              this.dialogText = '認証メールを確認してください';
              this.buttonText = 'Ok';
            } else {
              await this.setUserEmail(user);
              that.$router.push({ name: 'top' });
            }
          });
        })
        .catch(function () {
          that.dialog = !that.dialog;
          that.dialogTitle = 'エラー';
          that.dialogText = 'メールアドレスまたはパスワードが違います';
          that.buttonText = 'Ok';
        });
    },
    setUserEmail(val) {
      return new Promise((resolve) => {
        this.$store.commit('getUid', val);
        resolve();
      });
    },
    toSignup() {
      this.$router.push({ name: 'signup' });
    },
    check() {
      if (
        new RegExp(
          /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/
        ).test(this.inputEmail) &&
        this.completedPassword === 'true'
      ) {
        this.loginValidation = false;
      } else {
        this.loginValidation = true;
      }
    },
    resetPassword() {
      this.$router.push({ name: 'resetPassword' });
    },
    clickDialog() {
      this.dialog = !this.dialog;
    },
  },
};
</script>

<style scoped>
.title {
  text-align: center;
  margin-top: 100px;
  font-size: 40px;
}
.login-button-div {
  text-align: center;
}
.login-button {
  color: white;
  margin-top: 30px;
}
.forget-text {
  text-align: center;
  font-size: 12px;
  margin-top: 12px;
  text-decoration: underline;
  color: rgb(109, 109, 109);
  cursor: pointer;
}
.for-new {
  margin-top: 170px;
  margin-bottom: 20px;
  text-align: center;
  color: rgb(109, 109, 109);
  cursor: pointer;
  text-decoration: underline;
}
.validation-email {
  text-align: center;
  font-size: 13px;
  color: red;
}
.validation-password {
  text-align: center;
  font-size: 13px;
  color: red;
}
</style>
