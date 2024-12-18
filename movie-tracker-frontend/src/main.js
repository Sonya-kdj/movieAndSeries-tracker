import { createPinia } from 'pinia'
import { createApp } from 'vue'
import router from '../src/routes/index'
import App from './App.vue'

import './index.css'

const app = createApp(App)
app.use(router) // Подключаем роутер
app.use(createPinia()) // Подключаем состояние с помощью Pinia (если используется)
app.mount('#app')
