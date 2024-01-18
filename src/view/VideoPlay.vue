<template>
  <div id="dplayer" style="width: 100%;height: 100vh"></div>
</template>
<script setup>
import DPlayer from 'dplayer';
import {onBeforeUnmount, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
const route = useRoute()

const dp = ref(null)
onMounted(()=>{
    let url = route.query.url;
     dp.value = new DPlayer({
        container: document.getElementById('dplayer'),
        video: {
            url: url,
        },
    });
})
onBeforeUnmount(()=>{
    dp.value.destroy();
})

</script>

<style scoped>

</style>
