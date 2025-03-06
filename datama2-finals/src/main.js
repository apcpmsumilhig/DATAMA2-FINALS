

import { createApp } from 'vue'
import App from './App.vue'
import check from './components/check.vue'
import './assets/main.css'


const app = createApp(App)
app.component('check', check)
app.mount('#app')