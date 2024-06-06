<template>
  <div v-epg-group>
    <div class="top-box">
      <div class="ret" @click="returnPath" v-epg-item>
        <return :strokeWidth="2" class="icon-svg" :fill="themeColor" size="24" theme="outline"/>
      </div>
      <div class="top-title">
        {{ getFilePath(path, '') }}
      </div>
      <div class="mode">
        <list-bottom v-epg-item @click="changeMode" v-if="model==='list'" theme="outline" size="28" :fill="themeColor" :strokeWidth="3"/>
        <all-application v-epg-item @click="changeMode" v-else theme="outline" size="28" :fill="themeColor" :strokeWidth="3"/>
        <setting-two v-epg-item @click="SetString" style="float: right" theme="outline" size="28" :fill="themeColor" :strokeWidth="3"/>
      </div>
    </div>
    <div style="height: 100%;padding-top: 40px">
      <InfoTable v-if="model==='list'" :theme-color="themeColor" :table-data="tableData" :table-head="tableHeader" @clickFile="clickFile" @del-file="delFile"
                 @copy-url="copyUrl"></InfoTable>
      <image-table v-else :theme-color="themeColor"  :columns="columns" :img-size="imgSize" :table-data="tableData" :table-head="tableHeader" @clickFile="clickFile" @del-file="delFile"
                   @copy-url="copyUrl"></image-table>
    </div>
    <Transition>
      <div v-if="imgShow" class="imgBox">
        <div class="close-icon" @click="headImg">
          <close  :strokeWidth="5" fill="#ffffff" size="30" theme="outline"/>
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
      <Dialog v-if="showDialog" :ok-btn-text="'返回'" :title="'预览方式'" @ok-btn="okBtn" v-epg-group>
        <template #body>
          <ul class="play-list">
            <li @click="playVideo('web')" v-epg-item ref="previewMethod">MuiPlayer播放</li>
            <li @click="playVideo('vlc')" v-epg-item>Vlc播放</li>
            <li @click="playVideo('html')" v-epg-item>网页播放器</li>
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
      <Dialog v-if="setStringShow" :btnNum="1" :title="'设置'" v-epg-group @ok-btn="setOk">
        <template #body>
          <div class="set-item">
            <span>预览图像素：</span><input type="number" ref="imgPx" v-epg-item class="PxInput" v-model="imgSize"> px
          </div>
          <div class="set-item">
            <span>图片模式列数：</span><input type="number" v-epg-item class="PxInput" v-model="columns"> 列
          </div>
          <div class="set-item">
            <span>主题色：</span><pick-colors z-index="99999" v-epg-item width="50" v-model:value="themeColor"/>
          </div>
          <div class="set-item">
            <span>视屏打开方式：</span>
            <select class="select-input" v-model="playMode" v-epg-item>
              <option value="ask">每次询问</option>
              <option value="web">MuiPlayer播放</option>
              <option value="vlc">Vlc播放</option>
              <option value="html">网页播放器</option>
            </select>
          </div>
          <div class="set-item">
            <div class="close-btn" @click="clearCache" v-epg-item>清空缓存</div>
          </div>
        </template>
      </Dialog>
    </Transition>
  </div>
</template>
<script setup>
import {ArrowCircleLeft, ArrowCircleRight, Close, Return,ListBottom,AllApplication,SettingTwo} from "@icon-park/vue-next";
import {nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import axios from "axios";
import {useRoute, useRouter} from "vue-router";
import Dialog from "@/components/Dialog.vue";
import ImageTable from "@/components/ImageTable.vue";
import InfoTable from "@/components/InfoTable.vue";
import PickColors from 'vue-pick-colors'
import {getScroll, setScroll, throttle} from "@/tools/tools";
import { useVuEPG } from "vuepg";
const epg = useVuEPG();
const showDialog = ref(false);
const delDialog = ref(false);
const router = useRouter()
const route = useRoute()
//图片长边大小
const imgSize = ref(500)
//列数
const columns = ref(3)
let local;
if(import.meta.env.MODE === "development"){
  local = "http://localhost:3000"//测试用
}else{
  local = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
}
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
  }
])
const themeColor = ref("#f6823b")
//预览方式
const previewMethod = ref();
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
  return `${local}/getFile${filePath}/${fileName}`;
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
const copyUrl = (index) => {
  let fileInfo = tableData.value[index];
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
    let fileInfo = tableData.value[nowFileIndex.value];
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
      if(playMode.value === 'ask'){
        //视屏播放是否询问
        showDialog.value = true;
        console.log(888)
        nextTick(()=>{
          epg.move(previewMethod.value)
        })
      }else{
        playVideo(playMode.value)
      }
    } else if (IMG.includes(fileSuffix.toUpperCase())) {
      //图片
      imgUrls.value = [];
      let num = 0;
      for (let i = 0; i < tableData.value.length; i++) {
        let fileSuffix2 = tableData.value[i].suffix;
        if (IMG.includes(fileSuffix2.toUpperCase())) {
          if (tableData.value[i].name === tableData.value[index].name) {
            nowImgIndex.value = num;
          }
          num++;
          imgUrls.value.push(getFileUrl(path.value, tableData.value[i].name))
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
  axios.get(`${local}/list/${path.value}`).then((res, err) => {
    if (res.status === 200) {
      tableData.value = res.data.map((item) => {
        item['size'] = (Number(item['size']) / 1024 / 1024).toFixed(2) + "MB";
        if (item['isDirectory']) {
          item['size'] = "";
        }else{
          item['url'] = getFileUrl(path.value, item.name);
        }
        return item;
      })
      nextTick(()=>{
        // console.log(getScroll(path.value),"读取的位置")
        scrollTo({top: getScroll(path.value)})
      })
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
const imgPx = ref()
const SetString = ()=>{
  setStringShow.value = true;
  nextTick(()=>{
    epg.move(imgPx.value)

    try {
      let dom = document.getElementsByClassName("vuepg-focus")[0];
      if(dom.tagName === "INPUT"){
        dom.focus()
      }
    }catch (e) {

    }

  })
}

const playMode = ref("ask")
const setOk = ()=>{
  setStringShow.value = false;
  localStorage.setItem("imgSize",String(imgSize.value))
  localStorage.setItem("playMode",String(playMode.value))
  localStorage.setItem("columns",String(columns.value))
  localStorage.setItem("themeColor",String(themeColor.value))
}

const clearCache = ()=>{
  localStorage.clear();
  location.reload();
}

onMounted(() => {
  imgSize.value = Number(localStorage.getItem("imgSize") || 500);
  columns.value = Number(localStorage.getItem("columns") || 3);
  playMode.value = localStorage.getItem("playMode") || "ask"
  themeColor.value = localStorage.getItem("themeColor") || "#f6823b";
  model.value = localStorage.getItem("model") || "list";
  let pathValue = localStorage.getItem("path");
  if (pathValue) {
    path.value = pathValue;
  }
  addHistory();
  getFileList();

  function scr() {
    setScroll(path.value,Math.floor(window.scrollY))
    // console.log(Math.floor(window.scrollY),"存储的位置")
  }
  window.addEventListener('scroll',throttle(scr, 200));

  epg.setActionCallback("BACK", () => {
    let dom = document.getElementsByClassName("vuepg-focus")[0];
    if(imgShow.value){
      imgShow.value = false;
      return;
    }
    if(dom.tagName === "INPUT"){
      dom.value = dom.value.slice(0,-1)
      return;
    }
    returnPath();
  });

  epg.setActionCallback("LEFT", () => {
    if(imgShow.value){
      preImg()
    }
  });

  epg.setActionCallback("RIGHT", () => {
    if(imgShow.value){
      nextImg()
    }
  });

  epg.setActionCallback("UP", () => {
    try {
      let dom = document.getElementsByClassName("vuepg-focus")[0];
      if(dom.tagName === "TR"){
        scrollTo({top: window.scrollY - dom.offsetHeight, behavior: 'smooth'})
      }else if(dom.tagName === "INPUT"){
        dom.focus()
      }else if(dom.tagName === "SELECT"){
      }else if(dom.tagName === "DIV" && dom.className === "item vuepg-focus"){
        scrollTo({top: window.scrollY + dom.offsetHeight, behavior: 'smooth'})
      }
    }catch (e){
      
    }

  });

  epg.setActionCallback("DOWN", () => {
    try {
      let dom = document.getElementsByClassName("vuepg-focus")[0];
      console.log(dom.tagName)
      if(dom.tagName === "TR"){
        scrollTo({top: window.scrollY + dom.offsetHeight, behavior: 'smooth'})
      }else if(dom.tagName === "INPUT"){
        dom.focus()
      }else if(dom.tagName === "SELECT"){
      }else if(dom.tagName === "DIV" && dom.className === "item vuepg-focus"){
        scrollTo({top: window.scrollY + dom.offsetHeight, behavior: 'smooth'})
      }
    }catch (e) {

    }
  });
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

  .ret {
    flex: 2;
    text-align: center;
  }

  .top-title {
    flex: 6;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* 限制在一个块元素显示的文本的行数 */
    -webkit-box-orient: vertical; /* 垂直排列 */
    word-break: break-all; /* 内容自动换行 */
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
  z-index: 99;
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

</style>
