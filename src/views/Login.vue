<template>
  <div>
    <h2>登陆页面</h2>
    <div class="box"></div>
    
    <el-button type="primary">按钮</el-button>
    <!-- <SvgIcon name="vue" style="width: 3em; height: 3em" prefix="icon"></SvgIcon> -->
    <!-- <component
      v-for="(item, index) in list"
      :key="index"
      :is="item"
    ></component> -->
  </div>
</template>

<script setup>
// import Com from "./404.vue";
// import Com2 from "./404.vue";
// const list = [
//   {isRender: true, com: Com},
//   {isRender: false, com: Com2},
// ];
</script>

<style lang="less" scoped>
.box {
  width: 100px;
  height: 100px;
  background-color: green;
  // animation: move 10s infinite;
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
