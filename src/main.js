import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify';
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client/dist/socket.io.slim.js';
import VueConfirmDialog from 'vue-confirm-dialog'
Vue.config.productionTip = false
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy)


Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)
const socket = io("https://partywatch-socketio-server.herokuapp.com/")
//const socket = io("http://192.168.2.103:8080")
Vue.use(VueSocketIOExt, socket);
require("video.js/dist/video-js.css")
new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
