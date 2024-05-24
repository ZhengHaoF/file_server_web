<template>
  <div id="mui-player" style="width: 100%;height: 100vh"></div>
</template>
<script setup>
import 'mui-player/dist/mui-player.min.css'
import MuiPlayer from 'mui-player'
import {onBeforeUnmount, onMounted} from "vue";
import {useRoute} from "vue-router";
import router from "@/router";

const route = useRoute()
let mp;
onMounted(() => {
  let url = route.query.url;
  // 初始化 MuiPlayer 插件，MuiPlayer 方法传递一个对象，该对象包括所有插件的配置
  mp = new MuiPlayer({
    container: '#mui-player',
    title: url,
    initFullFixed: true,
    src: url,
  })
  // 监听播放器已创建完成
  mp.on('back', (e) => {
    router.back();
  });
})
onBeforeUnmount(() => {
  mp.destroy();
})

</script>

<style scoped>

</style>
