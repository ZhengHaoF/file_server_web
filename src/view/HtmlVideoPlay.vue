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

</style>
