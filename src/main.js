import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify';
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client/dist/socket.io.slim.js';
Vue.config.productionTip = false
const socket = io("http://192.168.2.103:8080")
Vue.use(VueSocketIOExt, socket);
require("video.js/dist/video-js.css")
new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
