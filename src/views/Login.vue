<template>
  <div>
    <h2>登陆页面</h2>
    <el-button @click="stopAnimate">停止动画</el-button>
    <div class="box" ref="box"></div>
  </div>
</template>

<script setup>
const box = ref();
const boxStyle = reactive({
  animation: "move 10s infinite",
});
const stopAnimate = () => {};
</script>

<style lang="less" scoped>
.box {
  width: 100px;
  height: 100px;
  background-color: green;
  animation: move 10s infinite;
}
@keyframes move {
  0% {
    margin-left: 0;
  }
  100% {
    margin-left: 500px;
  }
}
</style>
