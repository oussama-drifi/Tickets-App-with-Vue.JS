import './assets/main.css'
import '@fontsource/poppins'; // Default weight 400
import 'bootstrap-icons/font/bootstrap-icons.css';   

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')