interface RoutesMapImpl {
  [prop: string]: () => Promise<any>;
}
export const globalRoutesMap: RoutesMapImpl = {
  "404": () => import("@/views/404.vue"),
  login: () => import("@/views/Login.vue"),
  "/": () => import("@/App.vue"),
  // layout: () =>
};
