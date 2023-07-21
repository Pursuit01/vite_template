import axios from "axios";
import { ElMessage } from "element-plus";

const instance = axios.create({
  baseURL: "/",
  timeout: 60000,
});

// 设置默认contentypes
instance.defaults.headers.get["contentType"] =
  "application/x-www-form-urlencoded";
instance.defaults.headers.post["contentType"] = "application/json";
instance.defaults.headers.put["contentType"] = "application/json";
instance.defaults.headers.delete["contentType"] = "application/json";
instance.defaults.headers.common["Accept-Language"] = "zh-CN,zh;q=0.9";

// 请求拦截器
instance.interceptors.request.use(
  (config: any) => {
    // 为请求添加token
    const token = localStorage.getItem("token") || "";
    config["Authorization"] = token ? `Bearer ${token}` : "";
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    console.log("响应拦截到了", response);
    if (response.status == 200) {
      return response.data;
    } else if (response.status >= 400 && response.status < 500) {
      // 规定400 401 为token失效
      ElMessage.error("token过期，退出登录");
      return;
    }
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
// 快捷post请求
export const post = (url: string, data: Object, headers = {}) =>
  instance({
    method: "post",
    url,
    data,
    headers,
  });

export const get = (url: string, params: Object, headers = {}) =>
  instance({
    method: "get",
    url,
    params,
    headers,
  });
// post(
//   "/api/post",
//   {},
//   {
//     contentType: "application/json",
//   }
// ).then((res) => {
//   console.log("res", res);
// });
