<template>
  <div>
    <Modal
      :modal-title="modalTitle"
      :modal-text="modalText"
      :modal-button="modalButtonText"
      :modal-toggle="dialog"
      @changeValue="clickDialog()"
    />
    <!-- <button @click="clickDialog()">dialog</button> -->
    <div class="title">{{ signupTitle }}</div>
    <template>
      <InputComponent
        :input-text="textName"
        :input-value="inputName"
        :input-type="nameType"
        @input="inputName = $event"
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
    <template v-if="modal">
      <MyModal class="terms" />
    </template>
    <div class="checkbox">
      <v-checkbox v-model="checkbox" color="#61d4b3"></v-checkbox>
      <div class="agreement-text" @click="pushAgreement()">
        <span class="important">{{ agreement }}</span>
        に同意する
      </div>
    </div>
    <div class="login-button-div">
      <ButtonComponent
        :button-method="signUp"
        :login-email="inputEmail"
        :login-password="inputPassword"
        :button-type="typeSubmit"
        :button-disabled="loginValidation"
        >新規登録</ButtonComponent
      >
    </div>
    <div class="for-new" @click="toLogin()">{{ newText }}</div>
  </div>
</template>

<script>
import InputComponent from '../components/inputComponent';
import ButtonComponent from '../components/buttonComponent';
import MyModal from '../components/MyModalComponent';
import Modal from '../components/modalComponent';
import firebase from '~/plugins/firebase';

export default {
  components: {
    InputComponent,
    ButtonComponent,
    MyModal,
    Modal,
  },
  data() {
    return {
      signupTitle: 'アカウント作成',
      newText: 'アカウントをお持ちの方',
      textName: 'ユーザ名',
      textEmail: 'メールアドレス',
      textPassword: '英数字6桁以上',
      inputName: '',
      inputEmail: '',
      inputPassword: '',
      nameType: 'text',
      emailType: 'text',
      passwordType: 'password',
      typeSubmit: 'submit',
      nameValidation: '',
      emailValidation: '',
      passwordValidation: '',
      loginValidation: true,
      completedName: false,
      completedEmail: false,
      completedPassword: false,
      checkbox: false,
      agreement: '利用規約',
      modal: false,
      dialog: false,
      modalTitle: 'title',
      modalText: 'test',
      modalButtonText: 'OK',
    };
  },
  watch: {
    inputName(value) {
      if (value.length >= 1) {
        this.nameValidation = '';
        this.completedName = 'true';
        this.check();
      } else {
        this.nameValidation = 'ユーザ名を入力して下さい';
        this.completedName = 'false';
        this.check();
      }
    },
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
    checkbox(value) {
      if (value) {
        this.check();
      } else {
        this.check();
      }
    },
  },
  methods: {
    async clickDialog() {
      await (() => {
        return new Promise((resolve) => {
          this.dialog = !this.dialog;
          resolve();
        });
      });
      this.$router.push({ name: 'login' });
    },
    toLogin() {
      this.$router.push({ name: 'login' });
    },
    pushAgreement() {
      this.modal = !this.modal;
    },
    signUp() {
      const that = this;
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.inputEmail, this.inputPassword)
        .then((user) => {
          user = firebase.auth().currentUser;
          firebase.auth().languageCode = 'ja';
          user.sendEmailVerification().then(function () {
            firebase.auth().onAuthStateChanged((user) => {
              if (user) {
                that.saveUserData(user);
              } else {
                alert('error');
              }
            });
          });
        })
        .catch((error) => {
          alert(error.message);
        });
      this.dialog = !this.dialog;
      this.modalTitle = '登録完了';
      this.modalText =
        '登録したメールアドレスに認証メールを送信しました。ログインするために認証してください。';
    },
    saveUserData(val) {
      const that = this;
      const users = firebase.firestore().collection('users');
      users.doc(val.uid).set({
        userEmail: that.inputEmail,
        userName: that.inputName,
        userToken: '',
      });
    },
    check() {
      if (
        this.completedName === 'true' &&
        this.completedEmail === 'true' &&
        this.completedPassword === 'true' &&
        this.checkbox
      ) {
        this.loginValidation = false;
      } else {
        this.loginValidation = true;
      }
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
  margin-top: 110px;
  margin-bottom: 20px;
  text-align: center;
  color: rgb(109, 109, 109);
  text-decoration: underline;
  cursor: pointer;
}
.terms {
  width: 90%;
}
.checkbox {
  margin-left: 70px;
  margin-top: 40px;
  display: flex;
}
.agreement-text {
  margin-top: 20px;
}
.important {
  text-decoration: underline;
  cursor: pointer;
  color: #ff8a65;
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
