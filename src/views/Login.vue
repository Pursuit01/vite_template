<template>
  <div>
    <h2>登陆页面</h2>
    <div class="box"></div>
    <SvgIcon name="vue" style="width: 3em; height: 3em" prefix="icon"></SvgIcon>
  </div>
</template>

<script setup></script>

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
