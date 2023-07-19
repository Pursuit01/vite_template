<template>
  <div>
    <h2>{{ userInfo.firstName }} -- {{ userInfo.lastName }}</h2>
    <h2>{{ userStore.fullName }}</h2>
    <h3>年龄：{{ userInfo.age }}</h3>
    <el-button @click="changeAge">点击修改年龄</el-button>
    <el-button @click="resetState">重置</el-button>
    <el-button @click="changeGlobal">点击修改全局仓库的数据</el-button>
    <br />
    <h4>{{ globalStore.isGlobal + "" }}</h4>
  </div>
</template>

<script setup>
import { useUserStore } from "./store";
import { useGlobalStore } from "@/store/modules/global";
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const globalStore = useGlobalStore();
console.log("userStore", userStore);
const changeAge = () => {
  // userStore.setAge(userInfo.value.age + 1);
  // userStore.$patch({
  //   userInfo: {
  //     age: 100,
  //   },
  // });
  userStore.$patch((state) => {
    state.userInfo.age += 1;
  });
};

// 充重置状态
const resetState = () => {
  userStore.$reset();
};

const changeGlobal = () => {
  userStore.globalStore.isGlobal = !userStore.globalStore.isGlobal;
};
</script>

<style scoped></style>
