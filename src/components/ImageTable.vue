<template>
  <div class="box">
    <div v-for="(data,index) in getShowTableData" :key="index" class="item" :style="{width:`calc(100%/${columns})`}" @click="clickFile(data.index)">
      <div class="icon">
        <seo-folder class="icon-svg" theme="outline" :size="iconSize" :fill="themeColor" :strokeWidth="2" v-if="data['isDirectory']"/>
        <video-two class="icon-svg" theme="outline" :size="iconSize" :fill="themeColor"  :strokeWidth="2" v-else-if="VIDEO.includes(data['suffix'].toUpperCase())"/>
        <img class="icon-svg" v-lazy="data.url + `!${imgSize}x${imgSize}`" style="object-fit: cover;width: 100%;height: 100%;aspect-ratio:1/1" v-else-if="IMG.includes(data['suffix'].toUpperCase())" alt="data.name" src=""/>
        <file-zip class="icon-svg" theme="outline" :size="iconSize" :fill="themeColor"  :strokeWidth="2" v-else-if="ZIP.includes(data['suffix'].toUpperCase())"/>
        <audio-file class="icon-svg" theme="outline" :size="iconSize" :fill="themeColor"  :strokeWidth="2" v-else-if="AUDIO.includes(data['suffix'].toUpperCase())"/>
        <file-doc class="icon-svg" theme="outline" :size="iconSize" :fill="themeColor"  :strokeWidth="2" v-else-if="DOC.includes(data['suffix'].toUpperCase())"/>
        <file-excel class="icon-svg" theme="outline" :size="iconSize" :fill="themeColor"  :strokeWidth="2" v-else-if="EXCEL.includes(data['suffix'].toUpperCase())"/>
        <adobe-photoshop class="icon-svg" theme="outline" :size="iconSize" :fill="themeColor"  :strokeWidth="2" v-else-if="PS.includes(data['suffix'].toUpperCase())"/>
        <file-code-one theme="outline" :size="iconSize" :fill="themeColor"  :strokeWidth="2" v-else/>
      </div>
      <div class="file-name">
        {{data.name}}
      </div>
    </div>
    <div v-if="tableData.length !== 0" style="text-align: center;color: #999;line-height: 30px">到底了···</div>
    <div v-if="tableData.length === 0" style="height: 6rem;text-align: center;line-height: 6rem">
      当前数据为空
    </div>
  </div>
</template>
<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {VideoTwo,FileZip,SeoFolder,AudioFile,FileDoc,FileExcel,AdobePhotoshop,FileCodeOne} from '@icon-park/vue-next';
const show = ref(false);
const showTableData = ref([]);
const emit = defineEmits(['clickFile','copyUrl','delFile'])
const VIDEO = [".MP4", ".AVI", ".MOV", ".FLV",".MKV"];
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





onMounted(() => {
  showTableData.value = props.tableData.slice(0, props.showMax);
})
const getShowTableData = computed(() => {
  let list = [];
  showTableData.value.forEach((item,index) => {
    if (IMG.includes(item['suffix'].toUpperCase()) || item['isDirectory']){
      list.push({
        ...item,
        "index":index //index保持不变
      })
    }
  })
  return list;
})
const clickFile = (index) => {
  emit("clickFile", index)
}
const changeShow = () => {
  show.value = !show.value;
  if (show.value) {
    //展开
    showTableData.value = props.tableData;
  } else {
    //收起
    showTableData.value = props.tableData.slice(0, props.showMax)
  }
}
const copyUrl = (index)=>{
  emit("copyUrl", index)
}
const delFile = (index)=>{
  emit("delFile", index)
}

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
.box {
  height: calc(100vh - 40px);
  overflow-y: scroll;
}

.item{
  text-align: center;
  font-size: 14px;
  float: left;

  .icon{
    padding: 10px;
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
}


</style>
