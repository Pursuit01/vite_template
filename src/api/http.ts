import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
// import { useWuJieStore } from "@/store/modules/wuJie";

// 创建axios实例
const service = axios.create({
  timeout: 30000, // 请求超时时间
});

service.defaults.headers.get["contentType"] =
  "application/x-www-form-urlencoded";
service.defaults.headers.post["contentType"] = "application/json";
service.defaults.headers.put["contentType"] = "application/json";
service.defaults.headers.delete["contentType"] = "application/json";
service.defaults.headers.common["Accept-Language"] = "zh-CN,zh;q=0.9";

let isNeedGoLogin = false;

const elMessages: any[] = [];

const showMessage = (message: string) => {
  const _message: string = message;
  let _index = elMessages.findIndex((item) => item.message == _message);

  if (_index > -1) {
    elMessages[_index]["mesEl"].close();
    elMessages.splice(_index, 1);
  }

  const mesEl: any = ElMessage({
    showClose: true,
    message: _message,
    type: "error",
    duration: 3 * 1000,
    onClose: () => {
      _index = elMessages.findIndex((item) => item.message == _message);
      elMessages.splice(_index, 1);
    },
  });
  _index = elMessages.findIndex((item) => item.message == _message);
  // mesEl.close();
  if (!(_index > -1)) {
    elMessages.push({
      message: _message,
      mesEl,
    });
  }
};

// request拦截器
service.interceptors.request.use(
  (config: any) => {
    // if (
    //   import.meta.env.NODE_ENV == "development" ||
    //   import.meta.env.MODE == "development"
    // ) {
    //   // 设置了代理 就不能设置baseURL
    //   config.baseURL = "";
    // }
    let token = localStorage.getItem("token");
    token = token ? `Bearer ${token}` : "";
    config.headers["Authorization"] = token;
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  (response: any) => {
    const res = response.data;
    if (response.config.responseType === "blob") return response;

    if (res.code == "0000000" || res?.success) {
      return { headers: response.headers, ...res };
    } else {
      if (res.code === "1000009") {
        // const wuJieStore: any = useWuJieStore();
        if (!isNeedGoLogin) {
          isNeedGoLogin = true;
          let message = `你已被登出，可以取消继续留在该页面，或者重新登录`;
          if (res.code == "1002002") {
            message = `登录失效是否重新登录`;
          }

          ElMessageBox.confirm(message, "提示", {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning",
            closeOnClickModal: false,
            showCancelButton: false,
            showClose: false,
            draggable: true,
          })
            .then(() => {
              // wuJieStore?.logOut();
            })
            .catch(() => {})
            .finally(() => {
              // console.log("不管点啥都");
              isNeedGoLogin = false;
            });
        }
      }

      // 1002001:未登录;
      // 1002002: token已失效！
      if (res.code == "1002001" || res.code == "1002002") {
        if (!isNeedGoLogin) {
          isNeedGoLogin = true;
          let message = `你已被登出，可以取消继续留在该页面，或者重新登录`;
          if (res.code == "1002002") {
            message = `登录失效是否重新登录`;
          }

          ElMessageBox.confirm(message, "提示", {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning",
            closeOnClickModal: false,
            showCancelButton: false,
            draggable: true,
          })
            .then(() => {})
            .catch(() => {})
            .finally(() => {
              isNeedGoLogin = false;
            });
        }
      }
      let _message = res.message || res.msg || "接口获取失败";

      showMessage(_message);

      return Promise.reject(res);
    }
  },
  async (error) => {
    let _message =
      error?.response?.data?.message ||
      error.message ||
      error.response?.data?.message ||
      error.response?.data?.msg ||
      "接口获取失败";
    if (
      error.code === "ECONNABORTED" &&
      error.message.indexOf("timeout") !== -1
    ) {
      _message = "请求超时，请检查网络再重新连接";
    }
    showMessage(_message);
    return Promise.reject(error);
  }
);

export default service;
export const post = (url: any, data: any) => service.post(url, data);
export const get = (url: any, params: any) => service.get(url, { params });
