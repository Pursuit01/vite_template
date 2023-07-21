import { createApp } from "vue";
import App from "./App.vue";

// 引入element plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

// 全局 less 样式
import "@/style/index.less";
// 引入插件
import plugin from "@/plugins";

import { createPinia } from "pinia";

import router from "@/router";
// 路由加载进度条样式
import "nprogress/nprogress.css";

import "animate.css";
import "@/utils/request";

async function bootstrap() {
  const app = createApp(App);

  app.use(ElementPlus, { size: "default", locale: zhCn });

  // 使用pinia
  const pinia = createPinia();
  app.use(pinia);

  app.use(router);

  // app.use(plugin, { name: "xm" });
  app.use(plugin, { pinia });

  app.mount("#app");
}
bootstrap();
