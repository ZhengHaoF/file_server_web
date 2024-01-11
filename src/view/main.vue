<template>
  <div>
   <div style="height: calc(100vh - 90px)">
     <InfoTable :table-data="tableData" @del-file="delFile" :table-head="tableHeader" @clickFile="clickFile" @copy-url="copyUrl"></InfoTable>
   </div>
    <div class="ret" @click="returnPath">返回</div>
    <div v-if="imgShow" class="imgBox">
      <div class="img">
        <div class="close-btn" @click="headImg">
          <close :strokeWidth="5" fill="#ffffff" size="20" theme="outline"/>
        </div>
        <div class="left-btn" @click="preImg">
          <arrow-circle-left :strokeWidth="5" fill="#ffffff" size="30" theme="outline"/>
        </div>
        <div class="right-btn" @click="nextImg">
          <arrow-circle-right :strokeWidth="5" fill="#ffffff" size="30" theme="outline"/>
        </div>
        <img :src="nowImageSrc" alt="">
      </div>
      <div class="blackScreen" @click="headImg"></div>
    </div>
    <Dialog v-if="showDialog" :ok-btn-text="'返回'" :title="'预览方式'" @ok-btn="okBtn">
      <template #body>
        <ul class="play-list">
          <li @click="playVideo('web')">网页播放</li>
          <li @click="playVideo('vlc')">Vlc播放</li>
        </ul>
      </template>
    </Dialog>
    <Dialog v-if="delDialog" :btnNum="2" :title="'提示'" @ok-btn="delBtn" @close-btn="closeBtn">
      <template #body>
        <div style="padding-top: 20px;padding-bottom: 20px">
          是否删除文件
        </div>
      </template>
    </Dialog>
  </div>
</template>
<script setup>
import InfoTable from "@/components/InfoTable.vue";
import {Close,ArrowCircleLeft,ArrowCircleRight} from "@icon-park/vue-next";
import {nextTick, onMounted, onUnmounted, ref} from "vue";
import axios from "axios";
import {useRoute, useRouter} from "vue-router";
import Dialog from "@/components/Dialog.vue";


const showDialog = ref(false);
const delDialog = ref(false);
const router = useRouter()
const route = useRoute()
// const local = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
const local = "http://localhost:3000"//测试用
const path = ref("$")
const tableData = ref([])
const tableHeader = ref([
    {
        span: "文件名",
        prop: "name",
        textColor: "",
        bgColor: "",
    },
    {
        span: "大小",
        prop: "size",
        textColor: "red",
        bgColor: "red",
    },
    {
        span: "操作",
        prop: "cz",
        width: "80px",
        textColor: "green",
        bgColor: "green",
    },
])


const returnPath = () => {
    path.value = path.value.slice(0, path.value.lastIndexOf("__") === -1 ? path.value.length : path.value.lastIndexOf("__"));
    getFileList();
}

const imgUrls = ref([
])

const nowImageSrc = ref("");
const nowImgIndex = ref(0);
const nowFileIndex = ref(0);
const imgShow = ref(false);
//下一张图片
const nextImg = () => {
  nowImgIndex.value++
  nowImgIndex.value = nowImgIndex.value % imgUrls.value.length
  nowImageSrc.value = imgUrls.value[nowImgIndex.value]
  console.log(nowImgIndex.value)
}
//上一张图片
const preImg = () => {
  nowImgIndex.value--;
  if(nowImgIndex.value<0){
    nowImgIndex.value = imgUrls.value.length -1
  }
  nowImgIndex.value = nowImgIndex.value % imgUrls.value.length
  nowImageSrc.value = imgUrls.value[nowImgIndex.value]
}
//查看图片
const showImg = ()=>{
  imgShow.value = true;
  nowImageSrc.value = imgUrls.value[nowImgIndex.value];
  console.log(imgUrls.value)
}
const headImg = ()=>{
  imgShow.value = false;
}

const getFileUrl = (filePath,fileName)=>{
    if (filePath === "$") {
      filePath = ""
    } else {
      filePath = filePath.replace(/\$/g, "")
    }
    filePath = filePath.replace(/__/g, "/")
    console.log(`获取文件：${local}/getFile${filePath}/${fileName}`)
    return `${local}/getFile${filePath}/${fileName}`;
}

const getFilePath = (filePath,fileName)=>{
  if (filePath === "$") {
    filePath = ""
  } else {
    filePath = filePath.replace(/\$/g, "")
  }
  filePath = filePath.replace(/__/g, "/")
  return `${filePath}/${fileName}`;
}
const copyUrl = (index)=>{
  let fileInfo = tableData.value[index];
  return;
  try {
    navigator.share({
      title: fileInfo.name,
      url: getFileUrl(path.value, fileInfo.name),
    });
  }catch (e){
    alert(getFileUrl(path.value, fileInfo.name))
  }
}
const delFile = (index)=>{
  delDialog.value = true;
  nowFileIndex.value = index;
}

const VIDEO = [".MP4", ".AVI", ".MOV", ".FLV",".MKV"];
const IMG = [".JPG", ".JPEG", ".PNG", ".WEBP"];
const PS = [".PSD"];
const ZIP = [".RAR", ".ZIP", ".7Z"];
const AUDIO = [".WAV", ".MP3", ".OGG"];
const DOC = [".DOC",".DOCX"];
const EXCEL = [".XLS",".XLSX"];

const okBtn = ()=>{
  showDialog.value = false;
}
const closeBtn = ()=>{
  delDialog.value = false;
}

const delBtn = ()=>{
  delDialog.value = false;
  nextTick(()=>{
    let fileInfo = tableData.value[nowFileIndex.value];
    axios.post(`${local}/delFile`,{
      filePath:getFilePath(path.value,fileInfo.name)
    }).then((res, err) => {
      if (res.status === 200) {
        getFileList();
      }
    })
  })
}

const playVideo = (t)=>{
  showDialog.value = false;
  nextTick(()=>{
    if(t==='web'){
      router.push({
        path:"/VideoPlay",
        query:{
          url:playUrl.value,
        }
      })
    }else{
      window.open('vlc://' + playUrl.value)
    }
  })
}

const playUrl = ref("");
const clickFile = (index) => {
    //文件信息
    let fileInfo = tableData.value[index];
    if (fileInfo.isDirectory && !fileInfo.isFile) {
        //是文件夹
        path.value += `__${fileInfo.name}`
        getFileList();
        addHistory();
    } else {
        let fileSuffix = fileInfo.suffix;
        if (VIDEO.includes(fileSuffix.toUpperCase())) {
            //视频
            playUrl.value = getFileUrl(path.value, fileInfo.name)
            showDialog.value = true;
        } else if (IMG.includes(fileSuffix.toUpperCase())) {
            //图片
            imgUrls.value = [];
            let num = 0;
            for(let i = 0;i<tableData.value.length;i++){
                let fileSuffix2 = tableData.value[i].suffix;
                if(IMG.includes(fileSuffix2.toUpperCase())){
                  if(tableData.value[i].name === tableData.value[index].name){
                    nowImgIndex.value = num;
                    console.log(nowImgIndex.value,123456789)
                  }
                  num++;
                  imgUrls.value.push(getFileUrl(path.value, tableData.value[i].name))
                }
            }

            showImg()
        } else if(AUDIO.includes(fileSuffix.toUpperCase())){
            //音频
            router.push({
                path:"/AudioPlay",
                query:{
                    url:getFileUrl(path.value, fileInfo.name),
                }
            })
        } else {
            let a = document.createElement("a");
            a.href = getFileUrl(path.value, fileInfo.name);
            a.download = fileInfo.name;
            a.target = "_blank";
            a.click();
        }
    }
}
const getFileList = () => {
    axios.get(`${local}/list/${path.value}`).then((res, err) => {
        if (res.status === 200) {
            tableData.value = res.data.map((item) => {
                item['size'] = (Number(item['size']) / 1024 / 1024).toFixed(2) + "MB";
                if (item['isDirectory']) {
                    item['size'] = "";
                }
                return item;
            })
        }
    })
}
const backChange = ()=>{
  returnPath()
}

const addHistory = ()=>{
  if (window.history && window.history.pushState) {
    // 往历史记录里面添加一条新的当前页面的url
    history.pushState(null, null, document.URL);
    // 给 popstate 绑定一个方法 监听页面刷新
    window.addEventListener('popstate', backChange, false);//false阻止默认事件
  }
}
onMounted(() => {
  addHistory();
  getFileList();
})


onUnmounted(()=>{
  window.removeEventListener('popstate', backChange, false);//false阻止默认事件
})





</script>

<style scoped lang="scss">
.ret {
    width: 100%;
    background-color: #56dc57;
    text-align: center;
    line-height: 50px;
    position: fixed;
    bottom: 0;
    user-select: none;
    cursor: pointer;
}
.show-play{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    width: 80vw;
    height: 60vh;
}
.play-list{
  li{
    text-align: center;
    line-height: 40px;
    margin-left: 10px;
    margin-right: 10px;
    list-style: none;
    color: #333;
  }
}

.imgBox{
  z-index: 99;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  .blackScreen{
    width: 100vw;
    height: 100vh;
    background-color: black;
    overflow: hidden;
    position: fixed;
    opacity: 0.8;
  }
  .img{
    .close-btn{
      width: 25px;
      height: 25px;
      text-align: center;
      line-height: 25px;
      position: absolute;
      top: 0;
      right: 0;
      opacity: 0.5;
    }
    .left-btn{
      width: 35px;
      height: 35px;
      text-align: center;
      line-height: 35px;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(0%, -50%);
      opacity: 0.5;

    }
    .right-btn{
      width: 35px;
      height: 35px;
      position: absolute;
      text-align: center;
      line-height: 35px;
      top: 50%;
      right: 0;
      transform: translate(0%, -50%);
      opacity: 0.5;
    }
    z-index: 10;
    box-sizing: border-box;
    overflow: hidden;
    position: absolute;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    img{
      width: 100%;
      object-fit: contain;
    }
  }
}
</style>
