interface RoutesMapImpl {
  [prop: string]: () => Promise<any>;
}
export const globalRoutesMap: RoutesMapImpl = {
  "404": () => import("@/views/404.vue"),
  "/": () => import("@/layout/index.vue"),
  device: () => import('@/views/Device/index.vue'),
  access: () => import('@/views/Access/index.vue'),
  control: () => import('@/views/Control/index.vue'),
  openDoor: () => import('@/views/OpenDoor/index.vue'),
};
