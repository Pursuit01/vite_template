/*
 * @Author: 钱杰程
 * @Date: 2022-06-22 11:24:18
 * @LastEditTime: 2022-07-27 10:43:31
 * @LastEditors: 钱杰程
 * @Description:
 * @FilePath: \smartpower\src\views\dms\device\api.js
 * 可以输入预定的版权声明、个性签名、空行等
 */
import request from "@/api/http";

//获取设备位置树
export const getPositionList = () => {
  return request({
    method: "get",
    url: "/smart-power/api/v1/power-device/getProductTree",
  });
};

//获取设备分组树
export const getGroupList = () => {
  return request({
    method: "get",
    url: "/smart-power/api/v1/devicegroup/group/list",
  });
};

//
// 添加设备分组
export const addGroup = (params) => {
  return request({
    method: "post",
    url: "/smart-power/api/v1/devicegroup",
    data: params,
  });
};

// 编辑设备分组
export const editGroup = (params) => {
  return request({
    method: "put",
    url: "/smart-power/api/v1/devicegroup",
    data: params,
  });
};
// 删除设备分组 /smart-power/api/v1/devicegroup/delete/
export const deleteGroup = (id) => {
  return request({
    method: "post",
    url: `/smart-power/api/v1/devicegroup/delete/${id}`,
  });
};

// 获取设备列表 /smart-power/api/v1/power-device/getDeviceList
export const getDeviceList = (params) => {
  return request({
    method: "post",
    url: "/smart-power/api/v1/power-device/getDeviceList",
    data: params,
  });
};
// 移动分组
export const moveGroup = (params) => {
  return request({
    method: "post",
    url: "/smart-power/api/v1/devicegroup/move",
    data: params,
  });
};

// 批量分合闸呼叫 /smart-power/api/v1/power-device/batch/action/execute
export const batchExecute = (params) => {
  return request({
    method: "post",
    url: "/smart-power/api/v1/power-device/batch/action/execute",
    data: params,
  });
};

// 获取所属产品列表
export const getProductList = (param) =>
  request({
    method: "post",
    url: `/device-manager/api/v1/product/page`,
    // url: `/device-manager/v1/product/page`,
    data: param,
  });

// 设备数量统计
export const statisticsData = (data) => {
  return request({
    method: "post",
    url: "/smart-power/api/v1/power-device/statistics",
    data,
  });
};

// 获取产品图片
export const getDevicePicture = (ids) => {
  return request({
    method: "get",
    url: "/iot-product/v1/info/image/list",
    params: ids,
  });
};
