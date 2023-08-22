import { globalRoutesMap } from "./config";
export const defaultRoute = [
  { path: "/login", component: globalRoutesMap["login"] },
  { path: "/404", component: globalRoutesMap["404"] },
  // { path: "/", component: globalRoutesMap["/"] },
  { path: "/:pathMatch(.*)*", component: globalRoutesMap["404"] },
];
// export const mainRoute = [
//   {
//     path: '/dms',
//     name: 'dms',
//     index: '/dms',
//     component: globalRoutesMap["/"],
//     redirect: '/dms/device',
//     icon: "zr-setting",
//     title: "设备列表",
//     children: [
//       {
//         path: "device",
//         name: "device",
//         index: "/dms/device",
//         component: globalRoutesMap["device"],
//         title: "设备列表",
//         meta: {  },
//       },
//       {
//         parent: "device",
//         path: "deviceDetail",
//         name: "deviceDetail",
//         index: "/dms/",
//         component: globalRoutesMap["device"],
//         isHidden: true, // 在菜单上隐藏
//         title: "设备列表",
//         meta: { title: "设备列表" },
//       },
//     ]
//   },
//   {
//     path: "/access",
//     name: "access",
//     index: "/access",
//     component: globalRoutesMap["access"],
//     icon: "zr-menjin",
//     title: "门禁授权",
//     meta: { title: "门禁授权" },
//   },
//   {
//     path: "/control",
//     name: "control",
//     index: "/control",
//     component: globalRoutesMap["control"],
//     icon: "zr-control",
//     title: "通行记录",
//     meta: { title: "通行记录" },
//   },
//   {
//     path: "/opendoor",
//     name: "opendoor",
//     index: "/opendoor",
//     component: globalRoutesMap["openDoor"],
//     icon: "zr-jihua1",
//     title: "开门计划",
//     meta: { title: "开门计划" },
//   },
// ];

// ++++++++++++++++ 测试 ++++++++++++++++++
let _router = [
  // {
  //   path: "/",
  //   name: "home",
  //   component: globalRoutesMap["/"],
  //   redirect: "/home",
  //   meta: { title: "工作台" },
  //   children: [
  //     {
  //       path: "home",
  //       name: "home",
  //       component: globalRoutesMap["device"],
  //       icon: "zr-home",
  //       meta: { title: "首页" },
  //     },
  //   ],
  // },
  {
    path: "/dms",
    component:globalRoutesMap["/"],
    redirect: "/dms/device",
    name: "dms",
    meta: { title: "设备管理" },
    id: "",
    children: [
      {
        path: "device",
        name: "device",
        component: globalRoutesMap["device"],
        icon: "zr-setting1",
        meta: { title: "设备列表" },
      },
      {
        parent: "device",
        path: "deviceDetail",
        name: "deviceDetail",
        component:globalRoutesMap["device"],
        isHidden: true, // 在菜单上隐藏
        redirect: "/dms/deviceDetail/deviceInfo",
        meta: { title: "设备详情" },
        children: [
          {
            path: "deviceInfo",
            name: "deviceInfo",
            component: globalRoutesMap["device"],
            meta: { title: "台账信息" },
          },
          {
            path: "deviceMonitor",
            name: "deviceMonitor",
            component: globalRoutesMap["device"],
            meta: { title: "运行现状" },
          },
          {
            path: "devicePower",
            name: "devicePower",
            component: globalRoutesMap["device"],
            meta: { title: "能耗数据" },
          },

          {
            path: "deviceAlarm",
            name: "deviceAlarm",
            component: globalRoutesMap["device"],
            meta: { title: "告警记录" },
          },
        ],
      },
    ],
  },
  {
    path: "/access",
    component: globalRoutesMap["/"],
    redirect: "/access/menjin",
    name: "access",
    meta: { title: "门禁授权" },
    children: [
      {
        path: "menjin",
        name: "menjin",
        component: globalRoutesMap["access"],
        icon: "zr-menjin",
        meta: { title: "门禁授权" },
      },
    ],
  },
  {
    path: "/control",
    component: globalRoutesMap["/"],
    redirect: "/control/record",
    name: "control",
    meta: { title: "通行记录" },
    children: [
      {
        path: "record",
        name: "record",
        component: globalRoutesMap["control"],
        icon: "zr-control",
        meta: { title: "通行记录" },
      },
    ],
  },
  {
    path: "/open",
    component: globalRoutesMap["/"],
    redirect: "/open/door",
    name: "open",
    meta: { title: "开门计划" },
    children: [
      {
        path: "door",
        name: "door",
        component: globalRoutesMap["openDoor"],
        icon: "zr-jihua1",
        meta: { title: "开门计划" },
      },
    ],
  },
]
const routesFormat = (list: any, parent: any={}) => {

  return list.map((item: any) => {
    let url = "";
    let parentUrl = parent?.url && parent?.url != "/" ? parent.url : "";
    url = item.path != "/" ? `${parentUrl}/${item.name}` : "/";
    item.url = url;
    let nItem = {
      ...item
    }
    if (item.children && item.children.length > 0) {
      nItem.children = routesFormat(item.children, item);
    }
    return nItem;
  });
};
const routes = routesFormat(_router);

export default routes;