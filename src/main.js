import './assets/main.css'

import App from './App.vue'
import {createApp} from "vue";
import routes from './router'
const app = createApp(App)
app.use(routes)
app.mount('#app')
