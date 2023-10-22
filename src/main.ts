import './assets/base.css'
// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import {isMobile} from './utils/utils'

if (isMobile()) {
    document.documentElement.style.fontSize = window.innerWidth / 750 + "px";
    document.body.style.fontSize = "28rem";
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
