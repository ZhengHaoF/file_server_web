<template>
  <div class="box">
    <RecycleScroller
        ref="scroller"
        :item-size="Math.floor(scrollWidth/columns) + 20"
        :items="getShowTableData"
        :emitUpdate="scrollReady"
        @update="getScrollTop"
        class="virtual-list"
        key-field="index"
        :style="{height:scrollHeight - 40 + 'px'}"
    >
      <template v-slot="{ item }">
        <div :key="index" v-for="(data,index) in item.childList" class="item" :style="{width:`calc(100%/${columns})`}" @click="clickFile(data.index)">
          <div class="icon">
            <seo-folder class="icon-svg" theme="filled" :fill="themeColor" :size="iconSize" :strokeWidth="1" v-if="data['isDirectory']"/>
            <video-file class="icon-svg" theme="filled" :size="iconSize" :fill="themeColor"  :strokeWidth="1" v-else-if="VIDEO.includes(data['suffix'].toUpperCase())"/>
            <img class="icon-svg imgLazy" v-lazy="data.url + `!${imgSize}x${imgSize}`" style="object-fit: cover;width: 100%;height: 100%;aspect-ratio:1/1;border-radius: 10px;" v-else-if="IMG.includes(data['suffix'].toUpperCase())" alt="data.name" src=""/>
            <file-zip class="icon-svg" theme="filled" :size="iconSize" :fill="themeColor"  :strokeWidth="1" v-else-if="ZIP.includes(data['suffix'].toUpperCase())"/>
            <audio-file class="icon-svg" theme="filled" :size="iconSize" :fill="themeColor"  :strokeWidth="1" v-else-if="AUDIO.includes(data['suffix'].toUpperCase())"/>
            <file-doc class="icon-svg" theme="filled" :size="iconSize" :fill="themeColor"  :strokeWidth="1" v-else-if="DOC.includes(data['suffix'].toUpperCase())"/>
            <file-excel class="icon-svg" theme="filled" :size="iconSize" :fill="themeColor"  :strokeWidth="1" v-else-if="EXCEL.includes(data['suffix'].toUpperCase())"/>
            <adobe-photoshop class="icon-svg" theme="filled" :size="iconSize" :fill="themeColor"  :strokeWidth="1" v-else-if="PS.includes(data['suffix'].toUpperCase())"/>
            <file-code-one theme="filled" :size="iconSize" :fill="themeColor"  :strokeWidth="1" v-else/>
          </div>
          <div class="file-name">
            {{data.name}}
          </div>
        </div>
      </template>
    </RecycleScroller>
    <div v-if="getShowTableData.length === 0" style="text-align: center;position: absolute;width: 100vw;height: 100vh;top: 0;left: 0;line-height: 100vh">
      当前数据为空
    </div>
  </div>
</template>
<script setup>
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {VideoFile,FileZip,SeoFolder,AudioFile,FileDoc,FileExcel,AdobePhotoshop,FileCodeOne} from '@icon-park/vue-next';
const show = ref(false);
const showTableData = ref([]);
const emit = defineEmits(['clickFile','copyUrl','delFile','handleScroll'])
const VIDEO = [".MP4", ".AVI", ".MOV", ".FLV",".MKV",".TS"];
const IMG = [".JPG", ".JPEG", ".PNG", ".WEBP"];
const PS = [".PSD"];
const ZIP = [".RAR", ".ZIP", ".7Z"];
const AUDIO = [".WAV", ".MP3", ".OGG"];
const DOC = [".DOC",".DOCX"];
const EXCEL = [".XLS",".XLSX"];

const iconSize = ref("100%")
const props = defineProps({
  tableData: {
    type: Array,
    default: [],
  },
  showMax: {
    type: Number,
    default: 99999,
  },
  imgSize:{
    type: Number,
    default: 500,
  },
  columns:{
    type: Number,
    default: 3,
  },
  themeColor: {
    type: String,
    default: ""
  },
  onlyShowImages: {
    type: true,
    default: false
  }
})

const key = ref(0);

const scrollHeight = ref(0);
const scrollWidth = ref(0);
onMounted(() => {
  scrollHeight.value = window.innerHeight;
  scrollWidth.value = window.innerWidth;
  showTableData.value = props.tableData.slice(0, props.showMax);
  key.value++;
  scrollReady.value = false;
  nextTick(()=>{
    scrollReady.value = true;
  })
})
const getShowTableData = computed(() => {
  let list = [];
  showTableData.value.forEach((item,index) => {
    if(props.onlyShowImages){
      if (IMG.includes(item['suffix'].toUpperCase()) || item['isDirectory']){
        list.push({
          ...item,
          index:index
        })
      }
    }else{
      list.push({
        ...item,
        index:index
      })
    }
  })

  //以“行数”个为一组的数组，用于虚拟列表
  let newList = [];
  let tempList = [];
  list.forEach((item,index)=>{
    if(tempList.length < props.columns - 1){
      tempList.push({
        ...item
      });
    }else{
      tempList.push({
        ...item
      });
      newList.push({
        index:"item" + newList.length,
        childList:tempList
      });
      tempList = [];
    }
  })
  if(tempList.length > 0){
    newList.push({
      index:"item" + newList.length,
      childList:tempList
    });
  }
  key.value++;
  return newList;
})
const clickFile = (index) => {
  emit("clickFile", index)
}
const copyUrl = (index)=>{
  emit("copyUrl", index)
}
const delFile = (index)=>{
  emit("delFile", index)
}
const scroller = ref(null)
const scrollReady = ref(false)
const getScrollTop = ()=>{
  if(scroller?.value?.$_lastUpdateScrollPosition !== 0){
    emit("handleScroll",`index_${Math.floor(scroller?.value?.$_lastUpdateScrollPosition)}`)
  }
}

//滚动到指定位置
const setScroll = (value)=>{
  console.log(value)
  scroller.value.scrollToPosition(value);
}
defineExpose({
  setScroll,
});
watch(() => props.tableData, () => {
  show.value = false;
  if (props.tableData.length > props.showMax) {
    showTableData.value = props.tableData.slice(0, props.showMax)
  } else {
    showTableData.value = props.tableData;
  }
})

</script>

<style lang="scss" scoped>
.item{
  text-align: center;
  font-size: 14px;
  float: left;

  .icon{
    padding: 12px;
    display: flex;
    margin: 0 auto;
  }
  .file-name{
    width: 100%;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* 限制在一个块元素显示的文本的行数 */
    -webkit-box-orient: vertical; /* 垂直排列 */
    word-break: break-all;  /* 内容自动换行 */
  }
  .imgLazy[lazy='loading']{
    animation: turn 5s linear infinite;
  }

}
</style>
