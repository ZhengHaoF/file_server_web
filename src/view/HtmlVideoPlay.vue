<template>
  <div>
    <video style="width: 100%;height: 100%" :src="url" controls></video>
  </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";

const route = useRoute()
const url = ref("");
onMounted(() => {
  url.value = route.query.url;
})


</script>

<style scoped>

</style>
