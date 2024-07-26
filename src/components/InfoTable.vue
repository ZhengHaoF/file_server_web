<template>
    <div class="box" ref="box">
      <table>
            <tr style="background-color: #f6f6f6">
                <th v-for="item in tableHead"
                    :class="{'bgRed':item.bgColor==='red','bgGreen':item.bgColor==='green','textRed':item.textColor==='red','textGreen':item.textColor==='green'} "
                    :style="{'width':item.width}"
                >
                    {{ item.span }}
                </th>
            </tr>

            <tr v-for="(data,index) in showTableData">
                <td v-for="(head) in tableHead"
                    :class="{'textRed':head['textColor']==='red','textGreen':head['textColor']==='green'} ">
                    <div v-if="head.prop === 'name'" class="file-name" @click="clickFile(index)">
                      <div class="file-logo">
                        <seo-folder class="icon-svg" theme="outline" size="24" :fill="themeColor" :strokeWidth="2" v-if="data['isDirectory']"/>
                        <video-two class="icon-svg" theme="outline" size="24" :fill="themeColor" :strokeWidth="2" v-else-if="VIDEO.includes(data['suffix'].toUpperCase())"/>
                        <image-files class="icon-svg" theme="outline" size="24" :fill="themeColor" :strokeWidth="2" v-else-if="IMG.includes(data['suffix'].toUpperCase())"/>
                        <file-zip class="icon-svg" theme="outline" size="24" :fill="themeColor" :strokeWidth="2" v-else-if="ZIP.includes(data['suffix'].toUpperCase())"/>
                        <audio-file class="icon-svg" theme="outline" size="24" :fill="themeColor" :strokeWidth="2" v-else-if="AUDIO.includes(data['suffix'].toUpperCase())"/>
                        <file-doc class="icon-svg" theme="outline" size="24" :fill="themeColor" :strokeWidth="2" v-else-if="DOC.includes(data['suffix'].toUpperCase())"/>
                        <file-excel class="icon-svg" theme="outline" size="24" :fill="themeColor" :strokeWidth="2" v-else-if="EXCEL.includes(data['suffix'].toUpperCase())"/>
                        <adobe-photoshop class="icon-svg" theme="outline" size="24" :fill="themeColor" :strokeWidth="2" v-else-if="PS.includes(data['suffix'].toUpperCase())"/>
                        <file-code-one theme="outline" size="24" :fill="themeColor" :strokeWidth="2" v-else/>
                      </div>
                      <div class="file-text">
                        {{ data[head.prop]}}
                      </div>
                    </div>
                    <div v-else-if="head.prop === 'cz'" v-if="data.isFile" class="file-name" style="display: flex;text-align: center">
                        <div style="flex: 1">
                          <button @click="copyUrl(index)" :style="{borderColor:themeColor}">分享</button>
                        </div>
                        <div style="flex: 1">
                          <button @click="delFile(index)" :style="{borderColor:themeColor}">删除</button>
                        </div>
                    </div>
                    <div v-else class="file-name">{{ data[head.prop] }}</div>
                </td>
            </tr>

            <tr v-if="tableData.length !== 0"><td style="text-align: center;color: #999" colspan="3">到底了···</td></tr>
        </table>
        <div v-if="tableData.length === 0" style="height: 6rem;text-align: center;line-height: 6rem">
            当前数据为空
        </div>
<!--        <div v-show="showMax && tableData.length > showMax" class="show-all" @click="changeShow">-->
<!--            <div style="text-align: center;width: 100%">{{ show ? '收起' : '展开' }}</div>-->
<!--        </div>-->
    </div>
</template>
<script setup>
import {onMounted, ref, watch} from "vue";
import {VideoTwo,ImageFiles,FileZip,SeoFolder,AudioFile,FileDoc,FileExcel,AdobePhotoshop,FileCodeOne} from '@icon-park/vue-next';

/*
滚动到底监听
import { useScroll } from '@vueuse/core'
const box = ref(null)
const { x, y, isScrolling, arrivedState, directions} = useScroll(box)
//滚动监听
watch(y,(n,o)=>{
  //是否滚动到底部
  if(arrivedState.bottom){
    console.log("滚动到底部了")
  }
})
 */
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
const props = defineProps({
  tableData: {
    type: Array,
    default: [],
  },
  tableHead: {
    type: Array,
    default: [],
  },
  showMax: {
    type: Number,
    default: 99999,
  },
  themeColor: {
    type: String,
    default: ""
  }
})

onMounted(() => {
    showTableData.value = props.tableData.slice(0, props.showMax);
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

table {
  width: 100%;
  font-size: 16px;

  .bgRed {
    color: #fc9c62;
    background-color: #fff2e9;
  }

  .bgGreen {
    color: #56dc57;
    background-color: #e8f6e9;
  }

  .textRed {
    color: #fc9c62;
  }

  .textGreen {
    color: #56dc57;
  }

  th {
    height: 40px;
  }

  td {
    height: 40px;
    border-bottom: 1px solid #c4c4c4;
  }

  tr:hover {
    color: blue;
    user-select: none;
    background-color: #f6f6f6;
    cursor: pointer;
  }
}

.show-all {
  user-select: none;
  font-size: 16px;
  display: flex;
  width: 94%;
  line-height: 30px;
  box-sizing: border-box;
  border-top: 1px solid #c4c4c4;
  margin: 0 auto;
}

.file-name {
  padding-top: 5px;
  padding-bottom: 5px;
  word-break: break-all;
  display: flex;

  .icon-svg {
    vertical-align: middle;
  }

  .file-logo {
    min-width: 40px;
    text-align: center;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .file-text {

  }
  button{
    background-color: white;
    border: 1px solid black;
    border-radius: 5px;
    padding: 2px;
    color: #333;
  }
}
</style>
