// history模式
import {
  createRouter,
  createWebHashHistory,
} from 'vue-router'

import Home from '@/view/main.vue'
import VideoPlay from '@/view/VideoPlay.vue'
import AudioPlay from '@/view/AudioPlay.vue'
import HtmlVideoPlay from '@/view/HtmlVideoPlay.vue'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/VideoPlay',
    component: VideoPlay
  },
  {
    path: '/HtmlVideoPlay',
    component: HtmlVideoPlay
  },
  {
    path: '/AudioPlay',
    component: AudioPlay
  },
]

// 创建路由对象
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router;
