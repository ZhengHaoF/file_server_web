<template>
  <div>
    <div class="top-box">
      <div class="ret" @click="returnPath">
        <return :strokeWidth="2" class="icon-svg" :fill="themeColor" size="24" theme="outline"/>
      </div>
      <div class="top-title">
        {{ getFilePath(path, '') }}
      </div>
      <div class="mode">
        <list-bottom @click="changeMode" v-if="model==='list'" theme="outline" size="28" :fill="themeColor" :strokeWidth="3"/>
        <all-application @click="changeMode" v-else theme="outline" size="28" :fill="themeColor" :strokeWidth="3"/>
        <setting-two  @click="SetString" style="float: right" theme="outline" size="28" :fill="themeColor" :strokeWidth="3"/>
      </div>
    </div>
    <div style="height: 100%;padding-top: 40px;">
      <InfoTable :key="infoTableKey" v-if="model==='list'" ref="InfoTableRef" :table-data="getTableDate" :table-head="tableHeader"
                 :theme-color="themeColor" @clickFile="clickFile" @handleScroll="handleScroll" @del-file="delFile"
                 @copy-url="copyUrl"></InfoTable>
      <ImageTable :key="imageTableKey" v-if="model==='img'" ref="imageTableRef" :columns="columns" :img-size="imgSize"
                   :onlyShowImages="onlyShowImages" :table-data="getTableDate" :table-head="tableHeader" :theme-color="themeColor"
                   @clickFile="clickFile" @handleScroll="handleScroll" @del-file="delFile"
                   @copy-url="copyUrl"></ImageTable>
    </div>
    <Transition>
      <div v-if="imgShow" class="imgBox">
        <div class="close-icon" @click="headImg">
          <close :strokeWidth="5" fill="#ffffff" size="30" theme="outline"/>
        </div>
        <div class="img">
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
    </Transition>
    <Transition>
      <Dialog v-if="showDialog" :ok-btn-text="'返回'" :title="'预览方式'" @ok-btn="okBtn">
        <template #body>
          <ul class="play-list">
            <li @click="playVideo('web')">MuiPlayer播放</li>
            <li @click="playVideo('vlc')">Vlc播放</li>
            <li @click="playVideo('html')">网页播放器</li>
          </ul>
        </template>
      </Dialog>
    </Transition>
    <Transition>
      <Dialog v-if="delDialog" :btnNum="2" :title="'提示'" @ok-btn="delBtn" @close-btn="closeBtn">
        <template #body>
          <div style="padding-top: 20px;padding-bottom: 20px">
            是否删除文件
          </div>
        </template>
      </Dialog>
    </Transition>
    <Transition>
      <Dialog v-if="setStringShow" :btnNum="1" :title="'设置'" @ok-btn="setOk">
        <template #body>
          <div class="set-item">
            <span>预览图像素：</span><input type="number" class="PxInput" v-model="imgSize"> px
          </div>
          <div class="set-item">
            <span>图片模式列数：</span><input type="number" class="PxInput" v-model="columns"> 列
          </div>
          <div class="set-item">
            <span>主题色：</span><pick-colors :z-index="99999" width="50" v-model:value="themeColor"/>
          </div>
          <div class="set-item">
            <span>视屏打开方式：</span>
            <select class="select-input" v-model="playMode">
              <option value="ask">每次询问</option>
              <option value="web">MuiPlayer播放</option>
              <option value="vlc">Vlc播放</option>
              <option value="html">网页播放器</option>
            </select>
          </div>
          <div class="set-item">
            <span>文件排序方式：</span>
            <select class="select-input" v-model="fileSore">
              <option value="timeStoB">时间正序</option>
              <option value="timeBtoS">时间倒序</option>
              <option value="sizeStoB">大小正序</option>
              <option value="sizeBtoS">大小倒序</option>
              <option value="nameStoB">名称正序</option>
              <option value="nameBtoS">名称倒序</option>
            </select>
          </div>
          <div class="set-item">
            <span>文件夹位置：</span>
            <select class="select-input" v-model="folderSort">
              <option value="start">最前</option>
              <option value="end">最后</option>
            </select>
          </div>
          <div class="set-item">
            <span>图片模式只显示图片：</span><input type="checkbox" v-model="onlyShowImages">
          </div>
          <div class="set-item">
            <span>是否查看原图：</span><input type="checkbox" v-model="viewOriginalImage">
          </div>
          <div class="set-item">
            <div class="close-btn" @click="clearCache">清空缓存</div>
          </div>
          <div class="set-item">
            密码：<input type="number" class="PxInput" v-model="restartTheServerPwd"><div class="red-btn" @click="restartTheServer">重启服务器</div>
          </div>
        </template>
      </Dialog>
    </Transition>
    <Transition>
      <div class="loading" v-if="showLoading">
        <div style="position: relative;width: 100%;height: 100%">
          <img class="turn" :src="loadingImg" alt="">
          <div  class="text">加载中···</div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import {ArrowCircleLeft, ArrowCircleRight, Close, Return,ListBottom,AllApplication,SettingTwo} from "@icon-park/vue-next";
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import axios from "axios";
import {useRoute, useRouter} from "vue-router";
import Dialog from "@/components/Dialog.vue";
import ImageTable from "@/components/ImageTable.vue";
import InfoTable from "@/components/InfoTable.vue";
import PickColors from 'vue-pick-colors'
import {getScroll, setScroll} from "@/tools/tools";

const InfoTableRef = ref(null);
const imageTableRef = ref(null);
const infoTableKey = ref(0);
const imageTableKey = ref(0);
const showDialog = ref(false);
const delDialog = ref(false);
const router = useRouter()
const route = useRoute()
let local;
if(import.meta.env.MODE === "development"){
  local = "http://localhost:3000"//测试用
}else{
  local = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
}
const path = ref("$")
const tableData = ref([]);
const getTableDate = computed(()=>{
  let newTableDate = [];
  switch (fileSore.value) {
    case "timeStoB":
      newTableDate =  jsonSort(tableData.value, "mtime",true);
      break;
    case "timeBtoS":
      newTableDate = jsonSort(tableData.value, "mtime");
      break;
    case "sizeStoB":
      newTableDate = jsonSort(tableData.value, "sizeRow",true);
      break;
    case "sizeBtoS":
      newTableDate = jsonSort(tableData.value, "sizeRow");
      break;
    case "nameStoB":
      newTableDate = jsonSort(tableData.value, "name");
      break;
    case "nameBtoS":
      newTableDate = jsonSort(tableData.value, "name",true);
      break;
    default:
      newTableDate = tableData.value;
  }

  let newTableDate2 = [];
  switch (folderSort.value) {
    case "start":
      newTableDate.forEach((item)=>{
        if(item.isFile){
          newTableDate2.push(item)
        }else{
          newTableDate2.unshift(item)
        }
      })
      break;
    case "end":
      newTableDate.forEach((item)=>{
        if(item.isFile){
          newTableDate2.unshift(item)
        }else{
          newTableDate2.push(item)
        }
      })
      break;
    default:
      newTableDate2 = newTableDate.value;
  }
  return newTableDate2;
})
const tableHeader = ref([
  {
    span: "文件名",
    prop: "name",
    textColor: "",
    bgColor: "",
  },
  // {
  //   span: "大小",
  //   prop: "size",
  //   textColor: "red",
  //   bgColor: "red",
  // },
  // {
  //   span: "操作",
  //   prop: "cz",
  //   width: "80px",
  //   textColor: "green",
  //   bgColor: "green",
  // },
  // {
  //   span: "修改时间",
  //   prop: "mtime",
  //   width: "120px",
  //   textColor: "green",
  //   bgColor: "green",
  // },
])

//加载框使用的图片
import loadingImg from "../assets/loading.png"
import {jsonSort} from "../tools/tools";
import {getRatio} from "../../utils/utils";
//显示加载框
const showLoading = ref(false);

const returnPath = () => {
  if(imgShow.value || showDialog.value || delDialog.value || setStringShow.value){
    imgShow.value = false;
    showDialog.value = false;
    delDialog.value = false;
    setStringShow.value = false;
  }else{
    path.value = path.value.slice(0, path.value.lastIndexOf("__") === -1 ? path.value.length : path.value.lastIndexOf("__"));
    getFileList();
  }
}

const imgUrls = ref([])

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
  if (nowImgIndex.value < 0) {
    nowImgIndex.value = imgUrls.value.length - 1
  }
  nowImgIndex.value = nowImgIndex.value % imgUrls.value.length
  nowImageSrc.value = imgUrls.value[nowImgIndex.value]
}
//查看图片
const showImg = () => {
  imgShow.value = true;
  nowImageSrc.value = imgUrls.value[nowImgIndex.value];
  console.log(imgUrls.value)
}
const headImg = () => {
  imgShow.value = false;
}

const getFileUrl = (filePath, fileName) => {
  if (filePath === "$") {
    filePath = ""
  } else {
    filePath = filePath.replace(/\$/g, "")
  }
  filePath = filePath.replace(/__/g, "/")
  // console.log(`获取文件：${local}/getFile${filePath}/${fileName}`)
  return `${local}/getFile${filePath}/${window.encodeURIComponent(fileName)}`;
}

const getFilePath = (filePath, fileName) => {
  if (filePath === "$") {
    filePath = ""
  } else {
    filePath = filePath.replace(/\$/g, "")
  }
  filePath = filePath.replace(/__/g, "/")
  return `${filePath}/${fileName}`;
}
//滚动事件
const handleScroll = (value)=>{
  if(String(value).indexOf("index_") === -1){
    setScroll(path.value,Math.floor(value))
  }else{
    setScroll(path.value,value)
  }
}
const copyUrl = (index) => {
  let fileInfo = getTableDate.value[index];
  try {
    navigator.share({
      title: fileInfo.name,
      url: getFileUrl(path.value, fileInfo.name),
    });
  } catch (e) {
    alert(getFileUrl(path.value, fileInfo.name))
  }
}
const delFile = (index) => {
  delDialog.value = true;
  nowFileIndex.value = index;
}

const VIDEO = [".MP4", ".AVI", ".MOV", ".FLV", ".MKV"];
const IMG = [".JPG", ".JPEG", ".PNG", ".WEBP"];
const PS = [".PSD"];
const ZIP = [".RAR", ".ZIP", ".7Z"];
const AUDIO = [".WAV", ".MP3", ".OGG"];
const DOC = [".DOC", ".DOCX"];
const EXCEL = [".XLS", ".XLSX"];

const okBtn = () => {
  showDialog.value = false;
}
const closeBtn = () => {
  delDialog.value = false;
}

const delBtn = () => {
  delDialog.value = false;
  nextTick(() => {
    let fileInfo = getTableDate.value[nowFileIndex.value];
    axios.post(`${local}/delFile`, {
      filePath: getFilePath(path.value, fileInfo.name)
    }).then((res, err) => {
      if (res.status === 200) {
        getFileList();
      }
    })
  })
}

const playVideo = (t) => {
  showDialog.value = false;
  nextTick(() => {
    if (t === 'web') {
      let href = router.resolve({
        path: "/VideoPlay",
        query: {
          url: playUrl.value,
        }
      })
      window.open(href.href)
    } else if (t === 'vlc') {
      window.open('vlc://' + playUrl.value)
    }else{
      let href = router.resolve({
        path: "/HtmlVideoPlay",
        query: {
          url: playUrl.value,
        }
      })
      window.open(href.href)
    }
  })
}

const playUrl = ref("");
const clickFile = (index) => {
  //文件信息
  let fileInfo = getTableDate.value[index];
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
      if(playMode.value === 'ask'){
        //视屏播放是否询问
        showDialog.value = true;
      }else{
        playVideo(playMode.value)
      }
    } else if (IMG.includes(fileSuffix.toUpperCase())) {
      let w = (window.screen.width*getRatio()/100).toFixed(0);//获取屏幕分辨率
      //图片
      imgUrls.value = [];
      let num = 0;
      for (let i = 0; i < getTableDate.value.length; i++) {
        let fileSuffix2 = getTableDate.value[i].suffix;
        if (IMG.includes(fileSuffix2.toUpperCase())) {
          if (getTableDate.value[i].name === getTableDate.value[index].name) {
            nowImgIndex.value = num;
          }
          num++;
          if(viewOriginalImage.value){
            imgUrls.value.push(getFileUrl(path.value, getTableDate.value[i].name));
          }else {
            imgUrls.value.push(getFileUrl(path.value, getTableDate.value[i].name) + `!${w}x${w}`);
          }
        }
      }

      showImg()
    } else if (AUDIO.includes(fileSuffix.toUpperCase())) {
      //音频
      router.push({
        path: "/AudioPlay",
        query: {
          url: getFileUrl(path.value, fileInfo.name),
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
  showLoading.value = true;
  axios.get(`${local}/list/${window.encodeURIComponent(path.value)}`).then((res, err) => {
    showLoading.value = false;
    if (res.status === 200) {
      let data = res?.data?.list;
      if(!data){
        console.log("格式不匹配")
        return;
      }
      tableData.value = data.map((item) => {
        item['sizeRow'] = Number(item['size']);
        item['size'] = (Number(item['size']) / 1024 / 1024).toFixed(2) + "MB";
        if (item['isDirectory']) {
          item['size'] = "";
        }else{
          item['url'] = getFileUrl(path.value, item.name);
        }
        return item;
      })
      nextTick(()=>{
        console.log(getScroll(path.value),"读取的位置")
        if(model.value === "list"){
          if(String(getScroll(path.value)).indexOf("index_") === -1){
            InfoTableRef.value.setScroll(getScroll(path.value))
          }else{
            InfoTableRef.value.setScroll(0)
          }
        }else{
          if(String(getScroll(path.value)).indexOf("index_") !== -1){
            imageTableRef.value.setScroll(String(getScroll(path.value)).replaceAll("index_",""))
          }else{
            imageTableRef.value.setScroll(getScroll(path.value))
          }
        }
      })
    }
  }).catch((err)=>{
    showLoading.value = false;
    if(err.response.status === 404){
      console.log(err.response.data);
      localStorage.setItem("path","$");
      location.reload();
    }
  })
}
const backChange = () => {
  returnPath()
}

const addHistory = () => {
  if (window.history && window.history.pushState) {
    // 往历史记录里面添加一条新的当前页面的url
    history.pushState(null, null, document.URL);
    // 给 popstate 绑定一个方法 监听页面刷新
    window.addEventListener('popstate', backChange, false);//false阻止默认事件
  }
}


const model = ref("list")
//切换图片/列表模式
const changeMode = () => {
  model.value = model.value === "list"?"img":"list"
  localStorage.setItem("model",model.value)
}

const setStringShow = ref(false)
const SetString = ()=>{
  setStringShow.value = true;
}

//设置菜单代码块

//主题色
const themeColor = ref("#FA7868")
//播放方式
const playMode = ref("ask");
//文件排序方式
const fileSore = ref("timeStoB");
//文件夹位置
const folderSort = ref("start");
//图片长边大小
const imgSize = ref(150)
//列数
const columns = ref(3)
const setOk = ()=>{
  setStringShow.value = false;
  localStorage.setItem("imgSize",String(imgSize.value))
  localStorage.setItem("playMode",String(playMode.value))
  localStorage.setItem("columns",String(columns.value))
  localStorage.setItem("fileSore",String(fileSore.value))
  localStorage.setItem("folderSort",String(folderSort.value))
  localStorage.setItem("themeColor",String(themeColor.value))
  infoTableKey.value++;
  imageTableKey.value++;
}

const clearCache = ()=>{
  localStorage.clear();
  location.reload();
}


const restartTheServerPwd  = ref("");
const restartTheServer = ()=>{
  axios.post(`${local}/restartServer`,{
    pwd:restartTheServerPwd.value
  }).then((res)=>{
    if(res.data.msg === "开始重启"){
      console.log(6666)
      router.go(0)
    }else{
      alert(res.data.msg)
    }
  })

}

const onlyShowImages = ref(false);
const viewOriginalImage = ref(false);
watch(onlyShowImages, (newName, oldName) => {
  localStorage.setItem("onlyShowImages", String(newName));
});
watch(viewOriginalImage, (newName, oldName) => {
  localStorage.setItem("viewOriginalImage", String(newName));
});
onMounted(() => {
  //预览图片大小
  imgSize.value = Number(localStorage.getItem("imgSize") || 500);
  //图片模式查看列数
  columns.value = Number(localStorage.getItem("columns") || 3);
  //默认播放方式
  playMode.value = localStorage.getItem("playMode") || "ask";
  //文件夹位置
  folderSort.value = localStorage.getItem("folderSort") || "start";
  //文件排序方式
  fileSore.value = localStorage.getItem("fileSore") || "timeStoB";
  //图片模式下只显示图片和文件夹
  onlyShowImages.value = localStorage.getItem("onlyShowImages") === 'true';
  viewOriginalImage.value = localStorage.getItem("viewOriginalImage") === 'true';
  //主题色
  themeColor.value = localStorage.getItem("themeColor") || "#f6823b";
  model.value = localStorage.getItem("model") || "list";
  let pathValue = localStorage.getItem("path");
  if (pathValue) {
    path.value = pathValue;
  }
  addHistory();
  getFileList();

  // function scr() {
  //   setScroll(path.value,Math.floor(window.scrollY))
  //   // console.log(Math.floor(window.scrollY),"存储的位置")
  // }
  // window.addEventListener('scroll',throttle(scr, 200));
})

onUnmounted(() => {
  window.removeEventListener('popstate', backChange, false);//false阻止默认事件
})

watch(path, (newName, oldName) => {
  localStorage.setItem("path", newName);
});


</script>

<style lang="scss" scoped>
.top-box {
  width: 100%;
  position: fixed;
  background-color: #F6F6F6;
  top: 0;
  padding-top: 5px;
  user-select: none;
  cursor: pointer;
  display: flex;
  z-index: 99999;
  .ret {
    flex: 2;
    text-align: center;
  }

  .top-title {
    flex: 6;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow:ellipsis;
  }

  .mode {
    flex: 2;
    padding-right: 5px;
  }
}

.show-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  width: 80vw;
  height: 60vh;
}

.play-list {
  li {
    text-align: center;
    line-height: 40px;
    margin-left: 10px;
    margin-right: 10px;
    list-style: none;
    color: #333;
  }
}

.imgBox {
  z-index: 99999999999;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  .close-icon {
    background-color: black;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 50px;
    position: absolute;
    top: 10px;
    right: 10px;
    opacity: 0.5;
    z-index: 9999;
    border-radius: 10px;
  }
  .blackScreen {
    width: 100vw;
    height: 100vh;
    background-color: black;
    overflow: hidden;
    position: fixed;
    opacity: 0.8;
  }

  .img {
    .left-btn {
      width: 40px;
      height: 40px;
      position: absolute;
      text-align: center;
      line-height: 50px;
      top: 50%;
      left: 0;
      transform: translate(0%, -50%);
      opacity: 0.5;
      background-color: black;
      border-radius: 10px;
    }

    .right-btn {
      width: 40px;
      height: 40px;
      position: absolute;
      text-align: center;
      line-height: 50px;
      top: 50%;
      right: 0;
      transform: translate(0%, -50%);
      opacity: 0.5;
      background-color: black;
      border-radius: 10px;
    }

    z-index: 10;
    box-sizing: border-box;
    overflow: hidden;
    position: absolute;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 100%;
      object-fit: contain;
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.PxInput{
  width: 40px;
  padding: 2px;
}
.select-input{
  padding: 2px;
}

.set-item {
  padding-top: 12px;
  padding-bottom: 5px;
  display: flex;
  span{
    align-self:center;
  }
}
.loading{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  background-color: rgba(0,0,0,0.6);
  border-radius: 20px;
  color: white;
  text-align: center;
  img{
    position: absolute;
    top: 20px;
    left: 30px;
  }
  .text{
    position: absolute;
    bottom: 10px;
    text-align: center;
    width: 100%;
    height: 20px;
    color: white;
  }

}

</style>
