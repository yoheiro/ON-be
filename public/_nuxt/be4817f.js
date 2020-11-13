(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{286:function(e,t,o){var content=o(337);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,o(55).default)("719f2cb9",content,!0,{sourceMap:!1})},336:function(e,t,o){"use strict";o(286)},337:function(e,t,o){(t=o(54)(!1)).push([e.i,"#my-video[data-v-7475c6aa]{transform:rotateY(180deg);max-width:40vw}",""]),e.exports=t},353:function(e,t,o){"use strict";o.r(t);o(31),o(25),o(45),o(56);var n=o(13),r=o(335),c=o.n(r),d={data:function(){return{APIKey:"f0380daa-b6a9-43c6-b015-249eb77f026f",selectedAudio:"",selectedVideo:"",audios:[],videos:[],localStream:null,peerId:"",roomId:"",remoteStreams:[],roomOpened:!1}},created:function(){var e=this;return Object(n.a)(regeneratorRuntime.mark((function t(){var o;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.peer=new c.a({key:e.APIKey,debug:3}),t.next=3,navigator.mediaDevices.enumerateDevices();case 3:o=t.sent,console.log(o),o.filter((function(e){return"audioinput"===e.kind})).map((function(audio){return e.audios.push({text:audio.label||"Microphone ".concat(e.audios.length+1),value:audio.deviceId})})),o.filter((function(e){return"videoinput"===e.kind})).map((function(video){return e.videos.push({text:video.label||"Camera  ".concat(e.videos.length-1),value:video.deviceId})}));case 7:case"end":return t.stop()}}),t)})))()},methods:{onChange:function(){""!==this.selectedAudio&&""!==this.selectedVideo&&(this.connectLocalCamera(),console.log("onchange"))},connectLocalCamera:function(){var e=this;return Object(n.a)(regeneratorRuntime.mark((function t(){var o,n;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o={audio:!!e.selectedAudio&&{deviceId:{exact:e.selectedAudio}},video:!!e.selectedVideo&&{deviceId:{exact:e.selectedVideo}}},t.next=3,navigator.mediaDevices.getUserMedia(o);case 3:n=t.sent,document.getElementById("my-video").srcObject=n,e.localStream=n;case 6:case"end":return t.stop()}}),t)})))()},leaveRoom:function(){this.peer.open&&(this.roomOpened=!1,this.remoteStreams=[],this.room.close())},joinRoom:function(){var e=this;this.peer.open&&(this.roomOpened=!0,this.room=this.peer.joinRoom(this.roomId,{mode:"sfu",stream:this.localStream}),this.room.once("open",(function(){e.messages.push("=== You joined ===")})),this.room.on("peerJoin",(function(t){e.messages.push("=== ".concat(t," joined ==="))})),this.room.on("stream",function(){var t=Object(n.a)(regeneratorRuntime.mark((function t(o){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.remoteStreams.push(o);case 2:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),this.room.on("data",(function(t){var data=t.data,o=t.src;e.messages.push("".concat(o,": ").concat(data))})),this.room.on("peerLeave",(function(t){e.messages.push("=== ".concat(t," left ==="))})),this.room.once("close",(function(){e.messages.length=0})))}}},l=(o(336),o(65)),m=o(88),v=o.n(m),f=o(346),h=o(347),component=Object(l.a)(d,(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("v-row",{attrs:{justify:"center",align:"center"}},[o("v-col",{attrs:{cols:"12"}},[e._l(e.remoteStreams,(function(e,t){return o("div",{key:t},[o("video",{attrs:{autoplay:"",playsinline:""},domProps:{srcObject:e}})])})),e._v(" "),o("video",{attrs:{id:"my-video",muted:"true",width:"500",autoplay:"",playsinline:""},domProps:{muted:!0}}),e._v(" "),o("input",{directives:[{name:"model",rawName:"v-model",value:e.roomId,expression:"roomId"}],attrs:{type:"text",placeholder:"Room Name"},domProps:{value:e.roomId},on:{input:function(t){t.target.composing||(e.roomId=t.target.value)}}}),e._v(" "),o("p",[e._v("\n      ROOM ID: "),o("span",{attrs:{id:"room-id"}},[e._v(e._s(e.roomId))])]),e._v(" "),!0===e.roomOpened?o("button",{staticClass:"button--green",on:{click:e.leaveRoom}},[e._v("\n      Leave\n    ")]):o("button",{staticClass:"button--green",on:{click:e.joinRoom}},[e._v("Join")]),e._v(" "),o("br"),e._v(" "),o("div",[e._v("\n      マイク:\n      "),o("select",{directives:[{name:"model",rawName:"v-model",value:e.selectedAudio,expression:"selectedAudio"}],on:{change:[function(t){var o=Array.prototype.filter.call(t.target.options,(function(e){return e.selected})).map((function(e){return"_value"in e?e._value:e.value}));e.selectedAudio=t.target.multiple?o:o[0]},e.onChange]}},[o("option",{attrs:{disabled:"",value:""}},[e._v("Please select one")]),e._v(" "),e._l(e.audios,(function(audio,t,n){return o("option",{key:n,domProps:{value:audio.value}},[e._v("\n          "+e._s(audio.text)+"\n        ")])}))],2),e._v("\n\n      カメラ:\n      "),o("select",{directives:[{name:"model",rawName:"v-model",value:e.selectedVideo,expression:"selectedVideo"}],on:{change:[function(t){var o=Array.prototype.filter.call(t.target.options,(function(e){return e.selected})).map((function(e){return"_value"in e?e._value:e.value}));e.selectedVideo=t.target.multiple?o:o[0]},e.onChange]}},[o("option",{attrs:{disabled:"",value:""}},[e._v("Please select one")]),e._v(" "),e._l(e.videos,(function(video,t,n){return o("option",{key:n,domProps:{value:video.value}},[e._v("\n          "+e._s(video.text)+"\n        ")])}))],2)])],2)],1)}),[],!1,null,"7475c6aa",null);t.default=component.exports;v()(component,{VCol:f.a,VRow:h.a})}}]);