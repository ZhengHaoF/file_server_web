<template>
  <div>
    <video style="width: 100%;height: 100%" :src="url" controls="controls"></video>
    <div style="display: flex">
      <div class="ok-btn" @click="previous">上一个</div>
      <div class="ok-btn" @click="next">下一个</div>
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

onMounted(() => {
  url.value = route.query.url;
})
const previous = () => {

  if (index.value < 0) {
    index.value = videoList.value.length - 1;
  }
  if(videoList.value[index.value]){
    url.value = videoList.value[index.value].videoUrl;
  }
  index.value--;
}

const next = () => {
  if(index.value > videoList.value.length - 1){
    index.value = 0;
  }
  if(videoList.value[index.value]){
    url.value = videoList.value[index.value].videoUrl;
  }
  index.value++
}

</script>

<style scoped>

</style>
