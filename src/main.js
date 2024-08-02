import './assets/main.css'

import App from './App.vue'
import {createApp} from "vue";
import routes from './router'
import '@icon-park/vue-next/styles/index.css'
import loading from "@/assets/loading.png"
const app = createApp(App)
import VueLazyLoad from 'vue-lazyload'  //引入这个懒加载插件
import VueVirtualScroller from 'vue-virtual-scroller'
app.use(VueVirtualScroller)
app.use(routes)
app.use(VueLazyLoad, {
    preLoad: 1,
    error: loading,
    loading: loading,
    attempt: 2,
})
app.mount('#app')

