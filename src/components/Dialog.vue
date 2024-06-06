<template>
  <div class="box">
    <div class="main">
      <div class="title"><span>{{ props.title }}</span></div>
      <div class="body">
        <slot name="body">

        </slot>
      </div>
      <div class="footer">
        <div class="close-btn" v-if="props.btnNum > 1" @click="closeBtn">关闭</div>
        <div class="ok-btn" @click="okBtn" v-epg-item>{{props.okBtnText}}</div>
      </div>
    </div>
  </div>

</template>
<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "标题",
  },
  btnNum: {
    type: Number,
    default: 1,
  },
  okBtnText: {
    type: String,
    default: "确定",
  },
})
const emit = defineEmits(['okBtn','closeBtn'])
const okBtn = () => {
  emit("okBtn")
}

const closeBtn = () => {
  emit("closeBtn")
}
</script>
<style lang="scss" scoped>
.box {
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;

  .main {
    width: 80vw;
    background-color: white;
    position: absolute;
    border-radius: 5px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding-left: 10px;
    padding-right: 10px;
    box-sizing: border-box;

    .title {
      border-bottom: 1px solid #c4c4c4;
      height: 50px;
      display: flex;

      span {
        display: flex;
        text-align: center;
        align-items: center;
        margin: 0 auto;
      }
    }

    .body {
    }

    .footer {
      bottom: 0;
      height: 50px;
      width: 100%;
      border-top: 1px solid #c4c4c4;
      display: flex;
      align-items: center;

      //.close-btn {
      //  flex: 1;
      //  margin-left: 20px;
      //  margin-right: 20px;
      //  text-align: center;
      //  box-sizing: border-box;
      //  border: 1px solid #a4a4a4;
      //  border-radius: 5px;
      //  color: #a4a4a4;
      //  font-weight: bolder;
      //  line-height: 30px;
      //  height: 30px;
      //  font-size: 14px;
      //}
      //
      //.ok-btn {
      //  flex: 1;
      //  margin-left: 20px;
      //  margin-right: 20px;
      //  text-align: center;
      //  box-sizing: border-box;
      //  border: 1px solid #56dc57;
      //  border-radius: 5px;
      //  color: #56dc57;
      //  background-color: #e8f6e9;
      //  font-weight: bolder;
      //  line-height: 30px;
      //  height: 30px;
      //  font-size: 14px;
      //}
    }
  }
}
</style>
