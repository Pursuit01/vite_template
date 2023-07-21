import type { App } from "vue";
import { registerStore } from "../store";
export default {
  install(app: App, { pinia }) {
    // console.log(123, app);
    registerStore(pinia);
  },
};
