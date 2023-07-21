import type { App } from "vue";
import SvgIcon from "./SvgIcon/index.vue";
export default {
  install(app: App) {
    app.component("SvgIcon", SvgIcon);
  },
};
