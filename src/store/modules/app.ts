import { defineStore } from "pinia";
// import { mainRoute } from "@/router/default";
import routes from "@/router/default";
export const useAppStore = defineStore("appStore", {
  state: () => ({
    isCollapse: false,
    routes: routes,
  }), 
});
export const run = () => {
  return useAppStore();
};
