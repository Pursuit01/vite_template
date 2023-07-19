import { defineStore } from "pinia";

export const useGlobalStore = defineStore("globalStore", {
  state: () => ({
    isGlobal: true,
  }),
});
export const run = () => {
  return useGlobalStore();
};
