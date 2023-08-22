<script setup lang="ts">
const config = reactive({
  max: 3,
});
</script>

<template>
  <el-config-provider :message="config">
    <router-view></router-view>
  </el-config-provider>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  /* animation: fadeInDown;  */
  animation: slideInDown;
  animation-duration: 1s;
}
</style>
