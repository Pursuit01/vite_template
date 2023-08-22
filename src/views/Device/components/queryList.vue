<!--
 * @Author: 钱杰程
 * @Date: 2022-06-20 12:31:42
 * @LastEditTime: 2023-08-22 10:46:35
 * @LastEditors: 孙红日
 * @Description: 
 * @FilePath: \access-control-system\src\views\Device\components\queryList.vue
 * 可以输入预定的版权声明、个性签名、空行等
-->
<template>
  <el-form :inline="true">
    <el-row>
      <el-col :span="6">
        <el-form-item label="设备名称">
          <el-input
            placeholder="请输入设备名称"
            v-model="state.name"
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="设备编码">
          <el-input
            placeholder="请输入设备编码"
            v-model="state.code"
            clearable
          />
        </el-form-item>
      </el-col>
      <!-- <el-col :span="6">
        <el-form-item label="所属产品">
          <el-select
            v-model="state.type"
            placeholder="请输入所属产品"
            clearable
          >
            <el-option
              v-for="item in deviceTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col> -->
      <el-col :span="6">
        <el-form-item label="上级设备">
          <el-input
            placeholder="请输入上级设备"
            v-model="state.parentDeviceName"
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col :span="6" style="padding-left: 25px">
        <el-form-item>
          <el-button @click="clear">重置</el-button>
          <el-button
            style="
              background: #4886ff;
              box-shadow: 0px 6px 12px 0px rgba(63, 140, 255, 0.26);
            "
            type="primary"
            @click="search"
          >
            查询
          </el-button>
          <!-- <el-button type="primary" @click="deviceAdd('add')">新增</el-button> -->
        </el-form-item>
      </el-col>
    </el-row>
    <!-- <el-row>
      <el-col :span="6">
        <el-form-item label="在离线状态">
          <el-select v-model="state.status" clearable>
            <el-option label="全部" value="" />
            <el-option label="在线" value="1" />
            <el-option label="离线" value="0" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="运行状态" clearable>
          <el-select v-model="state.runStatus">
            <el-option label="全部" value="" />
            <el-option label="正常" value="0" />
            <el-option label="告警" value="1" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="分合闸状态" clearable>
          <el-select v-model="state.switchStatus">
            <el-option label="全部" value="" />
            <el-option label="分闸" value="0" />
            <el-option label="合闸" value="1" />
          </el-select>
        </el-form-item>
      </el-col>
      
    </el-row> -->
  </el-form>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getProductList } from "../api";

const state = reactive({
  name: "", //设备名称
  code: "", //设备编码
  type: "", //所属产品
  status: "", //在离线状态
  parentDeviceName: "", //上级设备名称
  runStatus: "", //运行状态   0：正常，1：告警
  switchStatus: "",
});
const deviceTypes = ref([]);
onMounted(async () => {
  const res = await getProductList({
    pageSize: 1000,
    pageIndex: 1,
  });
  if (res.success) {
    deviceTypes.value = [];
    res.data.forEach((item) => {
      deviceTypes.value.push({
        label: item.productName,
        value: item.iotId,
      });
    });
  }
});
const routers = useRouter();

const emits = defineEmits(["getQueryParams"]);

const props = defineProps({
  query: Object,
});
watch(
  () => props.query,
  (val) => {
    Object.keys(val).forEach((key) => {
      state[key] = val[key];
    });
  }
);

const search = () => {
  let item = {
    name: state.name,
    code: state.code,
    type: state.type,
    parentDeviceName: state.parentDeviceName,
    status: state.status,
    runStatus: state.runStatus,
    switchStatus: state.switchStatus,
  };
  emits("getQueryParams", item);
};

const clear = () => {
  let item = {
    name: (state.name = ""),
    code: (state.code = ""),
    type: (state.type = ""),
    parentDeviceName: (state.parentDeviceName = ""),
    status: (state.status = ""),
    runStatus: (state.runStatus = ""),
    switchStatus: (state.switchStatus = ""),
  };
  // emitter.emit("clear", { a: 123 });
  emits("getQueryParams", item, "clear");
};
</script>
<style scoped lang="scss">
.el-form {
  ::v-deep(label) {
    width: 90px;
  }
  ::v-deep(.el-form-item) {
    width: 100%;
    .el-form-item__content {
      .el-select {
        width: 100%;
      }
    }
  }
  ::v-deep(.el-input) {
    // width: 100%;
    // width: 199px;
  }
  ::v-deep(.el-select) {
    // width: 199px;
  }
  ::v-deep(.el-button) {
    width: 30%;
    border-radius: 12px;
  }
}
</style>
