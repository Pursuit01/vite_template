import { globalRoutesMap } from "./config";
export const defaultRoute = [
  { path: "/login", component: globalRoutesMap["login"] },
  { path: "/404", component: globalRoutesMap["404"] },
  { path: "/", component: globalRoutesMap["/"] },
  { path: "/:pathMatch(.*)*", component: globalRoutesMap["404"] },
];
