import './assets/main.css'

import App from './App.vue'
import {createApp} from "vue";
import routes from './router'
import '@icon-park/vue-next/styles/index.css'
const app = createApp(App)
app.use(routes)
app.mount('#app')

