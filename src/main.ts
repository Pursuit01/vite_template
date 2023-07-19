import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

// 引入element plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// 全局 less 样式
import "@/style/index.less";
// 引入插件
import plugin from "@/plugins";

import { createPinia } from "pinia";

async function bootstrap() {
  const app = createApp(App);

  app.use(ElementPlus);

  // 使用pinia
  const pinia = createPinia();
  app.use(pinia);

  // app.use(plugin, { name: "xm" });
  app.use(plugin, { pinia });

  app.mount("#app");
}
bootstrap();
