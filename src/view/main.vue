<template>
    <div>
        <InfoTable :table-data="tableData" :table-head="tableHeader" @clickFile="clickFile" @copy-url="copyUrl"></InfoTable>
        <div class="ret" @click="returnPath">返回</div>
    </div>
</template>
<script setup>
import InfoTable from "@/components/InfoTable.vue";
import {onMounted, ref} from "vue";
import axios from "axios";
import 'viewerjs/dist/viewer.css'
import { api as viewerApi } from "v-viewer"
import {useRoute, useRouter} from "vue-router";
const router = useRouter()
const route = useRoute()
const local = `${window.location.protocol}//${window.location.hostname}:3000`
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
//查看图片
const showImg = ()=>{
    viewerApi({
        images: imgUrls.value
    })
}

const getFileUrl = (filePath,fileName)=>{
    if (filePath === "$") {
        filePath = ""
    } else {
        filePath = filePath.replace(/\$/g, "")
    }
    filePath = filePath.replace(/__/g, "/")
    console.log(`${local}/getFile${filePath}/${fileName}`)
    return `${local}/getFile${filePath}/${fileName}`;
}

const copyUrl = (index)=>{
    let fileInfo = tableData.value[index];
    alert(getFileUrl(path.value, fileInfo.name))
}

const VIDEO = [".MP4", ".AVI", ".MOV", ".FLV",".MKV"];
const IMG = [".JPG", ".JPEG", ".PNG", ".WEBP"];
const PS = [".PSD"];
const ZIP = [".RAR", ".ZIP", ".7Z"];
const AUDIO = [".WAV", ".MP3", ".OGG"];
const DOC = [".DOC",".DOCX"];
const EXCEL = [".XLS",".XLSX"];
const clickFile = (index) => {
    //文件信息
    let fileInfo = tableData.value[index];
    if (fileInfo.isDirectory && !fileInfo.isFile) {
        //是文件夹
        path.value += `__${fileInfo.name}`
        getFileList();
    } else {
        let fileSuffix = fileInfo.suffix;
        if (VIDEO.includes(fileSuffix.toUpperCase())) {
            //视频
            router.push({
                path:"/VideoPlay",
                query:{
                    url:getFileUrl(path.value, fileInfo.name),
                }
            })
        } else if (IMG.includes(fileSuffix.toUpperCase())) {
            //图片
            imgUrls.value = [];
            for(let i = index;i<tableData.value.length && i< i+10;i++){
                let fileSuffix2 = tableData.value[i].suffix;
                //获取后面10张图片
                if(IMG.includes(fileSuffix2.toUpperCase())){
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
onMounted(() => {

    getFileList();
})





</script>

<style scoped>
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
</style>
