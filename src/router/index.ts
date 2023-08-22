import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { defaultRoute } from "./default";
import _routes from "./default";
import NProgress from "nprogress";

// const routes: RouteRecordRaw[] = [...defaultRoute,...mainRoute];
const routes: RouteRecordRaw[] = [...defaultRoute,..._routes];
const router = createRouter({
  history: createWebHistory('access-control'),
  routes,
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});
router.afterEach(() => {
  NProgress.done();
});
export default router;
