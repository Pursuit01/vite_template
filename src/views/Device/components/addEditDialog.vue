<!--
 * @Author: 钱杰程
 * @Date: 2022-06-20 12:39:12
 * @LastEditTime: 2022-08-03 18:10:00
 * @LastEditors: 钱杰程
 * @Description: 
 * @FilePath: \smartpower\src\views\dms\device\components\addEditDialog.vue
 * 可以输入预定的版权声明、个性签名、空行等
-->
<template>
  <el-dialog
    v-model="isShow"
    :title="title"
    width="440px"
    :before-close="cancel"
  >
    <el-form
      label-width="120px"
      style="height:300px; overflow:auto;padding:24px;"
      ref="ruleFormRef"
      :model="state"
      :rules="rules"
    >
      <el-row>
        <el-col :span="20">
          <el-form-item
            label="组织Id"
            prop="orgId"
          >
            <!-- <el-input v-model="state.org_id" /> -->
            <el-select
              v-model="state.orgId"
              @change="get_OrgId"
            >
              <el-option
                v-for="item in areaOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <!--            areaOptions-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item
            label="设备名称"
            prop="name"
          >
            <el-input v-model="state.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item
            label="设备类型"
            prop="type"
          >
            <el-select v-model="state.type">
              <el-option
                v-for="item in deviceTypes"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="注册Id">
            <el-input v-model="state.registerId" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="公司名称">
            <el-input v-model="state.company"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="IP地址">
            <el-input v-model="state.address" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="厂商名称">
            <el-select v-model="state.manufacturer">
              <el-option
                v-for="item in manufactures"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="注册模式">
            <el-select v-model="state.registerMood">
              <el-option
                v-for="item in registerModes"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="20">
          <el-form-item label="网关Id">
            <el-input v-model="state.gatwayId"></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="20">
          <el-form-item label="用户名">
            <el-input v-model="state.userName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="密码">
            <el-input
              v-model="state.password"
              type="password"
              show-password
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button
          type="primary"
          @click="save(ruleFormRef)"
        >保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from "vue";
import { addDeviceApi, updateDeviceApi } from "../api";
import { ElMessage } from "element-plus";
import { getList as getAreaListAPI } from "@/views/sms/area/api";
import { useStore } from "vuex";
const store = useStore();

let systemCode = computed(() => store.getters.systemCode);
const state = reactive({
  address: "", //地址
  company: "", //公司名称
  gatwayId: "",
  manufacturer: "", //厂商
  registerId: "", //注册id
  name: "", //名称
  org_id: "", //所属组织id
  userName: "", //用户名
  password: "", //密码
  type: "", //类型
  registerMood: 0, //通信模式
  orgId: "",
});

const props = defineProps([
  "userId",
  "modelValue",
  "title",
  "rowValue",
  "communicationModes",
  "deviceTypes",
  "manufactures",
  "registerModes",
  "getDeviceList",
]);

const title = computed(() => props.title);

const rules = reactive({
  orgId: [{ required: true, message: "组织id不能为空", trigger: "change" }],
  name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
  type: [
    {
      required: true,
      message: "请选择设备类型",
      trigger: "change",
    },
  ],
});

const emits = defineEmits(["update:modelValue"]);

const isShow = computed({ // 重新定义
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value),
})




watch(
  () => props.rowValue,
  () => {
    console.log("props.rowValue", props.rowValue);
    state.name = props.rowValue.name;
    state.registerId = props.rowValue.registerId;
    state.company = props.rowValue.company;
    state.address = props.rowValue.address;
    state.manufacturer = props.rowValue.manufacturer;
    // state.type = props.rowValue.type;
    state.registerMood = props.rowValue.registerMode;
    // state.gatwayId = props.rowValue.gatewayId;
    state.userName = props.rowValue.username;
    state.password = props.rowValue.password;
    state.orgId = props.rowValue.orgId;

    if (props.rowValue.type) {
      let _type = props.deviceTypes.filter((item) => {
        return item.name === props.rowValue.type;
      });
      if (_type.length !== 0) {
        state.type = _type[0].value;
      } else {
        state.type = "";
      }
    } else {
      state.type = ""; //点击添加，type置空
    }

    //将 设备类型的中文name 转为 字母的type bug:新增了huayi的两个设备，但是后端给的列表中只有大华的设备
    // if (props.rowValue.type) {
    //   state.type = props.deviceTypes.filter((item) => {
    //     return item.name === props.rowValue.type;
    //   })[0].value;
    // } else {
    //   state.type = ""; //点击添加，type置空
    // }
  }
);

const get_OrgId = (val) => {
  console.log("val", val);
};

const ruleFormRef = ref();
const save = async (formEl) => {
  let pubParams = {
    address: state.address,
    company: state.company,
    // gatewayId: state.gatwayId,
    manufacturer: state.manufacturer,
    name: state.name,
    orgId: state.orgId,
    password: state.password,
    registerID: state.registerId,
    registerMode: state.registerMood,
    type: state.type,
    username: state.userName,
  };

  const addParams = {
    ...pubParams,
  };

  const editParams = {
    ...pubParams,
    id: props.rowValue.id,
  };

  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (title.value == "添加") {
        addDeviceApi(addParams).then((res) => {
          if (res.code == "0000000") {
            ElMessage({
              message: "添加成功",
              type: "success",
            });
            props.getDeviceList();
            emits("update:modelValue", false);
          }
        });
      }
      if (title.value == "编辑") {
        console.log("编辑");
        let id = props.rowValue.id;
        updateDeviceApi(id, editParams).then((res) => {
          if (res.code == "0000000") {
            ElMessage({
              message: "修改成功",
              type: "success",
            });
            props.getDeviceList();
            emits("update:modelValue", false);
          }
        });
      }
    }
  });
};

const areaOptions = ref([]);

const getAreaList = () => {
  let _listQuery = {
    pageSize: 500,
    pageNo: 1,
    systemCode: systemCode.value,
    tree: 0, // 是否树状查询,1是，0否
  };

  getAreaListAPI(_listQuery)
    .then(
      (res) => {
        console.log("区域列表", res);
        if (res.code == "0000000") {
          let _list = [];
          _list = res?.data?.list || [];
          areaOptions.value = _list.map((item) => {
            return {
              label: item.orgName,
              value: item.id,
            };
          });
        }
      },
      (err) => {}
    )
    .finally((fin) => {});
};
getAreaList();

const cancel = () => {
  emits("update:modelValue", false);
};
</script>

<style scoped lang="less">
// ::v-deep(.el-dialog__body) {
// }
// ::v-deep(.el-dialog__body) {
//   border: 1px solid green !important;
//   height: 300px;
//   overflow: auto;
// }

.el-dialog .el-dialog__body {
  border: 1px solid green !important;
  height: 300px;
  overflow: auto;
}
</style>