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
// 引入pinia
import { createPinia } from "pinia";
// 引入router
import router from "@/router";
// 路由加载进度条样式
import "nprogress/nprogress.css";
// 引入动画库
import "animate.css";
// 引入请求工具库
import "@/utils/request";
// 引入svg映射关系
import "virtual:svg-icons-register";
// 引入注册全局组件的插件
import registGlobalCom from "./components/registGlobalCom";

async function bootstrap() {
  
  const app = createApp(App);

  // 使用pinia
  const pinia = createPinia();
  app.use(pinia);

  // 使用路由
  app.use(router);

  // 注册全局组件
  app.use(registGlobalCom);

  app.use(ElementPlus, { size: "default", locale: zhCn });

  // app.use(plugin, { name: "xm" });
  app.use(plugin, { pinia });

  app.mount("#app");
}
bootstrap();
