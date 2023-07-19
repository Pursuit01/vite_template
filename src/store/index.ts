import { useGlobalStore } from "./modules/global";
import type { Pinia } from "pinia";
interface ImportMetaGlob {
  [specifier: string]: () => { default: { run: Function } };
}

const stores: ImportMetaGlob = import.meta.glob(["@/store/modules/*.ts"], {
  eager: true,
});

console.log("stores", stores);

export const registerStore = (pinia: Pinia) => {
  // const globalStore = useGlobalStore();
  pinia.use(({ pinia, store }) => {
    console.log(pinia, store);

    Object.keys(stores).forEach((key) => {
      const regex = /\/src\/store\/modules\/(.*?)\.ts/;
      const name = key.match(regex)![1] + "Store";
      console.log("name", name, stores[key].run());

      store[name] = stores[key].run();
    });

    // 不能使用return，会有仓库嵌套
    // return registerStores;
  });
};
