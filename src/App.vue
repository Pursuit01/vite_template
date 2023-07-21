<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import User from "@/components/User/index.vue";
</script>

<template>
  <div style="position: fixed; top: 50px">
    <router-link to="/login">登录</router-link> |
    <router-link to="/404">404</router-link>
  </div>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component"></component>
    </transition>
  </router-view>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <!-- <User></User> -->
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
