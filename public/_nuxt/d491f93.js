(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{262:function(t,e,n){var content=n(270);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(55).default)("6364b2a1",content,!0,{sourceMap:!1})},263:function(t,e,n){var content=n(272);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(55).default)("41358a88",content,!0,{sourceMap:!1})},265:function(t,e,n){"use strict";n.r(e);var o={props:{inputText:{type:String,required:!0},inputValue:{type:String,required:!0},inputType:{type:String,required:!0}},data:function(){return{}}},l=(n(269),n(65)),component=Object(l.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"input-place"},[n("input",{staticClass:"input-text",attrs:{type:t.inputType,placeholder:t.inputText},domProps:{value:t.inputValue},on:{input:function(e){return t.$emit("input",e.target.value)}}})])}),[],!1,null,"2dc9f570",null);e.default=component.exports},266:function(t,e,n){"use strict";n.r(e);var o={props:{buttonMethod:{type:Function,required:!0},buttonType:{type:String,required:!0},buttonDisabled:{type:Boolean,required:!1}}},l=(n(271),n(65)),r=n(88),d=n.n(r),c=n(377),component=Object(l.a)(o,(function(){var t=this.$createElement;return(this._self._c||t)("v-btn",{staticClass:"login-button",attrs:{rounded:"",width:"300px","color-text":"white",disabled:this.buttonDisabled,type:this.buttonType},on:{click:this.buttonMethod}},[this._t("default")],2)}),[],!1,null,"639960a9",null);e.default=component.exports;d()(component,{VBtn:c.a})},269:function(t,e,n){"use strict";n(262)},270:function(t,e,n){(e=n(54)(!1)).push([t.i,".input-place[data-v-2dc9f570]{text-align:center;margin:10px}.input-text[data-v-2dc9f570]{border:1px solid #ff8a65;border-radius:25px;padding:9px 20px;width:300px;outline:none}",""]),t.exports=e},271:function(t,e,n){"use strict";n(263)},272:function(t,e,n){(e=n(54)(!1)).push([t.i,".login-button[data-v-639960a9]{background:linear-gradient(90deg,#e64a19 0,#ff8a65 50%) no-repeat!important;opacity:.5}",""]),t.exports=e},292:function(t,e,n){"use strict";var o={props:{modalTitle:{type:String,required:!0},modalText:{type:String,required:!0},modalButton:{type:String,required:!0},modalToggle:{type:Boolean,required:!0}},methods:{changeDialogValue:function(){this.$emit("changeValue")}}},l=n(65),r=n(88),d=n.n(r),c=n(377),f=n(306),m=n(264),h=n(369),v=n(326),x=n(364),component=Object(l.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"text-center"},[n("v-dialog",{attrs:{persistent:"",width:"400"},model:{value:t.modalToggle,callback:function(e){t.modalToggle=e},expression:"modalToggle"}},[n("v-card",[n("v-card-title",{staticClass:"headline grey lighten-2",attrs:{"primary-title":""}},[t._v("\n        "+t._s(t.modalTitle)+"\n      ")]),t._v(" "),n("v-card-text",{staticStyle:{"margin-top":"20px",padding:"0 20px 20px","text-align":"center"}},[t._v("\n        "+t._s(t.modalText)+"\n      ")]),t._v(" "),n("v-divider"),t._v(" "),n("v-card-actions",[n("v-spacer"),t._v(" "),n("v-btn",{attrs:{color:"red",text:""},on:{click:function(e){return t.changeDialogValue()}}},[t._v("\n          "+t._s(t.modalButton)+"\n        ")])],1)],1)],1)],1)}),[],!1,null,null,null);e.a=component.exports;d()(component,{VBtn:c.a,VCard:f.a,VCardActions:m.a,VCardText:m.b,VCardTitle:m.c,VDialog:h.a,VDivider:v.a,VSpacer:x.a})},299:function(t,e,n){var content=n(328);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(55).default)("3ece6982",content,!0,{sourceMap:!1})},327:function(t,e,n){"use strict";n(299)},328:function(t,e,n){(e=n(54)(!1)).push([t.i,".title[data-v-999a2afc]{margin-top:100px;font-size:40px}.login-button-div[data-v-999a2afc],.title[data-v-999a2afc]{text-align:center}.login-button[data-v-999a2afc]{color:#fff;margin-top:30px}.forget-text[data-v-999a2afc]{font-size:12px;margin-top:12px}.for-new[data-v-999a2afc],.forget-text[data-v-999a2afc]{text-align:center;text-decoration:underline;color:#6d6d6d;cursor:pointer}.for-new[data-v-999a2afc]{margin-top:170px;margin-bottom:20px}.validation-email[data-v-999a2afc],.validation-password[data-v-999a2afc]{text-align:center;font-size:13px;color:red}",""]),t.exports=e},373:function(t,e,n){"use strict";n.r(e);n(11),n(189),n(32),n(17),n(58);var o=n(13),l=n(265),r=n(266),d=n(292),c=n(110),f={components:{InputComponent:l.default,ButtonComponent:r.default,Dialog:d.a},data:function(){return{loginTitle:"ログイン",forgetText:"パスワードを忘れた方",forNewtext:"新規登録",textEmail:"メールアドレス",textPassword:"英数字6桁以上",inputEmail:localStorage.getItem("userEmail"),inputPassword:localStorage.getItem("userPassword"),emailType:"text",passwordType:"password",typeSubmit:"submit",emailValidation:"",passwordValidation:"",loginValidation:!0,completedEmail:!1,completedPassword:!1,iconUrl:"",dialog:!1,dialogTitle:"",dialogText:"",buttonText:""}},watch:{inputEmail:function(t){0===t.length?(this.emailValidation="メールアドレスを入力して下さい",this.completedEmail="false",this.check()):new RegExp(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/).test(t)?(this.emailValidation="",this.completedEmail="true",this.check()):(this.emailValidation="有効なメールアドレスを入力してください",this.completedEmail="false",this.check())},inputPassword:function(t){t.length>=6?(this.passwordValidation="",this.completedPassword="true",this.check()):(this.passwordValidation="6文字以上の英数字を入力して下さい",this.completedPassword="false",this.check())}},created:function(){var t=new RegExp(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/).test(this.inputEmail);this.inputPassword&&t&&this.inputPassword.length>=6&&(this.loginValidation=!1)},methods:{login:function(){var t=this,e=this;localStorage.setItem("userEmail",this.inputEmail),localStorage.setItem("userPassword",this.inputPassword),c.a.auth().signInWithEmailAndPassword(this.inputEmail,this.inputPassword).then((function(){c.a.auth().onAuthStateChanged(function(){var n=Object(o.a)(regeneratorRuntime.mark((function n(o){return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(o.emailVerified){n.next=8;break}t.modalVisible=!1,t.dialog=!t.dialog,t.dialogTitle="認証エラー",t.dialogText="認証メールを確認してください",t.buttonText="Ok",n.next=11;break;case 8:return n.next=10,t.setUserEmail(o);case 10:e.$router.push({name:"video"});case 11:case"end":return n.stop()}}),n)})));return function(t){return n.apply(this,arguments)}}())})).catch((function(){e.dialog=!e.dialog,e.dialogTitle="エラー",e.dialogText="メールアドレスまたはパスワードが違います",e.buttonText="Ok"}))},setUserEmail:function(t){var e=this;return new Promise((function(n){e.$store.commit("getUid",t),n()}))},toSignup:function(){this.$router.push({name:"signup"})},check:function(){new RegExp(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/).test(this.inputEmail)&&"true"===this.completedPassword?this.loginValidation=!1:this.loginValidation=!0},resetPassword:function(){this.$router.push({name:"resetPassword"})},clickDialog:function(){this.dialog=!this.dialog}}},m=(n(327),n(65)),component=Object(m.a)(f,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("div",{staticClass:"title"},[t._v(t._s(t.loginTitle))]),t._v(" "),[n("Dialog",{attrs:{"modal-title":t.dialogTitle,"modal-text":t.dialogText,"modal-button":t.buttonText,"modal-toggle":t.dialog},on:{changeValue:function(e){return t.clickDialog()}}})],t._v(" "),[n("InputComponent",{attrs:{"input-text":t.textEmail,"input-value":t.inputEmail,"input-type":t.emailType},on:{input:function(e){t.inputEmail=e}}})],t._v(" "),n("div",{staticClass:"validation-email"},[t._v(t._s(t.emailValidation))]),t._v(" "),[n("InputComponent",{attrs:{"input-text":t.textPassword,"input-value":t.inputPassword,"input-type":t.passwordType},on:{input:function(e){t.inputPassword=e}}})],t._v(" "),n("div",{staticClass:"validation-password"},[t._v(t._s(t.passwordValidation))]),t._v(" "),n("div",{staticClass:"login-button-div"},[n("ButtonComponent",{attrs:{"button-method":t.login,"button-type":t.typeSubmit,"button-disabled":t.loginValidation}},[t._v("ログイン")])],1),t._v(" "),n("div",{staticClass:"forget-text",on:{click:function(e){return t.resetPassword()}}},[t._v(t._s(t.forgetText))]),t._v(" "),n("div",{staticClass:"for-new",on:{click:function(e){return t.toSignup()}}},[t._v(t._s(t.forNewtext))])],2)}),[],!1,null,"999a2afc",null);e.default=component.exports;installComponents(component,{InputComponent:n(265).default,ButtonComponent:n(266).default})}}]);