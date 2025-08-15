import * as Vue from 'vue'
import App from './App.vue'
import Chat from '../../src/index.js'

const app = Vue.createApp(App)

app.use(Chat)

app.mount('#app')
