<template>
  <div class="video-container">
    <div class="video-wrapper">
      <video 
        class="video-player" 
        :src="url" 
        controls="controls"
        playsinline
        webkit-playsinline
        x5-playsinline
        preload="metadata"
      ></video>
    </div>
    <div class="video-controls">
      <button class="control-btn" @click="previous">上一个</button>
      <button class="control-btn" @click="next">下一个</button>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
const route = useRoute()
const url = ref("");
const index = ref(0);

import { storeToRefs } from 'pinia'
import {useAlertsStore} from "@/store/store";
const store = useAlertsStore();
const { videoList } = storeToRefs(store);
const emit = defineEmits(['nextVideo', 'prevVideo']);
const props = defineProps({
  url: {
    type: String,
    default: ""
  }
});

onMounted(() => {
  url.value = props.url || route.query.url;
})
const previous = () => {
  emit("prevVideo")
}

const next = () => {
  emit("nextVideo")
}

</script>

<style scoped>
.video-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #000;
  overflow: hidden;
}

.video-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  position: relative;
}

.video-player {
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
  background-color: #000;
}

.video-controls {
  display: flex;
  padding: 15px 10px;
  background-color: #1a1a1a;
  border-top: 1px solid #333;
  gap: 10px;
}

.control-btn {
  flex: 1;
  padding: 12px 16px;
  background-color: #56dc57;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-height: 44px; /* 移动端推荐的最小触摸目标 */
}

.control-btn:active {
  background-color: #4ac74b;
}

/* 横屏模式优化 */
@media screen and (orientation: landscape) {
  .video-container {
    flex-direction: row;
  }
  
  .video-wrapper {
    flex: 1;
  }
  
  .video-controls {
    flex-direction: column;
    width: 120px;
    padding: 20px 10px;
    border-top: none;
    border-left: 1px solid #333;
  }
  
  .control-btn {
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
}

/* 平板设备优化 */
@media screen and (min-width: 768px) and (max-width: 1024px) {
  .video-controls {
    padding: 20px 15px;
    gap: 15px;
  }
  
  .control-btn {
    padding: 15px 20px;
    font-size: 16px;
  }
}

/* 小屏手机优化 */
@media screen and (max-width: 375px) {
  .video-controls {
    padding: 12px 8px;
    gap: 8px;
  }
  
  .control-btn {
    padding: 10px 12px;
    font-size: 13px;
    min-height: 40px;
  }
}

/* 防止视频控制条被遮挡 */
video::-webkit-media-controls {
  transform: translateZ(0);
}

/* 全屏模式优化 */
.video-player:fullscreen {
  object-fit: contain;
}

.video-player:-webkit-full-screen {
  object-fit: contain;
}

.video-player:-moz-full-screen {
  object-fit: contain;
}

.video-player:-ms-fullscreen {
  object-fit: contain;
}
</style>
