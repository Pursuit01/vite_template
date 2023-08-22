<template>
  <div class="aside_box">
    <el-tabs v-model="activeTab" tab-position="top">
      <el-tab-pane label="设备位置" :name="1">
        <TreeList
          :isShowCheckbox="positionConfigData.isShowCheckbox"
          :isHighlightCurrent="positionConfigData.isHighlightCurrent"
          :treeCurrent="positionConfigData.treeCurrent"
          :treeDefaultExpandedKeys="positionConfigData.treeDefaultExpandedKeys"
          @onCurrentChange="
            (data) => goTo('onTreeCurrentChange', data, 'position')
          "
          :asideStore="positionConfigData.propConfig"
          :showOperate="false"
        ></TreeList>
        <!-- <el-tree :data="positionData"></el-tree> -->
      </el-tab-pane>
      <el-tab-pane label="设备分组" :name="2">
        <TreeList
          :isShowCheckbox="groupConfigData.isShowCheckbox"
          :isHighlightCurrent="groupConfigData.isHighlightCurrent"
          :treeCurrent="groupConfigData.treeCurrent"
          :treeDefaultExpandedKeys="groupConfigData.treeDefaultExpandedKeys"
          @onCurrentChange="
            (data) => goTo('onTreeCurrentChange', data, 'group')
          "
          :asideStore="groupConfigData.propConfig"
          :showOperate="true"
          @deleteNode="deleteNode"
          @addEditNode="addEditNode"
        ></TreeList>
      </el-tab-pane>
    </el-tabs>
    <d-el-dialog
      :title="groupDialogTitle"
      v-model="showGroupDetail"
      width="400px"
      style="height: 260px"
    >
      <div>
        <el-form
          :model="groupDetail"
          :rules="groupRule"
          label-width="100px"
          ref="ruleFormRef"
        >
          <el-form-item label="上级分组">
            <el-input :disabled="true" v-model="groupDetail.supName"></el-input>
          </el-form-item>

          <el-form-item label="分组名称" prop="groupName">
            <el-input
              placeholder="请输入分组名称"
              v-model="groupDetail.groupName"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-footer">
        <el-button
          @click="cancel"
          style="width: 72px; height: 32px; border-radius: 12px"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          style="
            width: 72px;
            height: 32px;
            border-radius: 12px;
            background: #4886ff;
            box-shadow: 0px 6px 12px 0px rgba(63, 140, 255, 0.26);
          "
          @click="saveGroup(ruleFormRef)"
        >
          确定
        </el-button>
      </div>
    </d-el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted } from "vue";
import TreeList from "./TreeList.vue";
import { ElMessageBox, ElMessage } from "element-plus";
import {
  getPositionList,
  getGroupList as getGroupListApi,
  addGroup,
  editGroup,
  deleteGroup,
} from "../api";
const emit = defineEmits([
  "update:modelValue",
  "update:position",
  "update:orgId",
  "getData",
]);
const props = defineProps({
  modelValue: Number,
  position: Object,
  orgId: String,
});
const groupDetail = reactive({
  supId: "",
  supName: "",
  groupName: "",
  id: "",
});
const groupRule = reactive({
  groupName: [
    { required: true, message: "分组名称不能为空", trigger: "change" },
  ],
});
const cancel = () => {
  showGroupDetail.value = false;
  ruleFormRef.value.resetFields();
  ruleFormRef.value.clearValidate();
};
const ruleFormRef = ref(null);
const saveGroup = (ruleFormRef) => {
  ruleFormRef.validate(async (valid, fields) => {
    if (valid) {
      if (groupType.value === "add") {
        const res = await addGroup({
          orgName: groupDetail.groupName,
          supId: groupDetail.supId,
        });
        if (res.success) {
          ElMessage.success("分组添加成功");
          showGroupDetail.value = false;
          getGroupList();
        } else {
          ElMessage.error(res.message);
        }
      } else if (groupType.value == "edit") {
        const res = await editGroup({
          supId: groupDetail.supId,
          orgName: groupDetail.groupName,
          id: groupDetail.id,
        });
        if (res.success) {
          ElMessage.success("分组编辑成功");
          showGroupDetail.value = false;
          getGroupList();
          emit("getData");
        } else {
          ElMessage.error(res.message);
        }
      }
    }
  });
};
const showGroupDetail = ref(false);
const groupDialogTitle = ref("新增分组");
const activeTab = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    if (val == 2) {
      emit("update:position", {
        buildingId: null,
        floorId: null,
        roomId: null,
      });
    } else {
      emit("update:orgId", "");
    }
    emit("update:modelValue", val);
  },
});
const groupType = ref("");
// 设备位置 配置项
const positionConfigData = reactive({
  isShowCheckbox: false,
  isHighlightCurrent: true,
  treeCurrent: undefined,
  treeDefaultExpandedKeys: [],

  // config
  propConfig: {
    config: {
      draggable: false,
    },
    isLoading: false,
    treeCurrent: undefined,
    treeList: [],
  },
});
// 分组 配置项
const groupConfigData = reactive({
  isShowCheckbox: false,
  isHighlightCurrent: true,
  treeCurrent: undefined,
  treeDefaultExpandedKeys: [],
  propConfig: {
    config: {
      draggable: false,
    },
    isLoading: false,
    treeCurrent: undefined,
    treeList: [],
  },
});
const deleteNode = (data) => {
  console.log("delete Item =>", data);
  if (data.node.level === 1) {
    ElMessage({
      type: "warning",
      message: "无法删除根节点",
    });
    return;
  }
  ElMessageBox.confirm(
    `此操作将删除分组 ${data.data.label}，分组下的设备将移动至上一节点，确定要删除吗?`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      const res = await deleteGroup(data.data.value);
      if (res.success) {
        showGroupDetail.value = false;
        getGroupList();
        ElMessage({
          type: "success",
          message: "删除成功",
        });
        console.log(groupConfigData.propConfig);
        emit("update:orgId", "");
        groupConfigData.treeCurrent =
          groupConfigData.propConfig.treeList[0].$treeNodeId;
        emit("getData");
      } else {
        ElMessage.error(res.message);
      }
      // 刷新列表
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
const addEditNode = (key, data) => {
  console.log("addEditNode =>", key, data);
  if (key == "add") {
    // if (data.node.level >= 2) {
    //   ElMessage.warning("最多支持一级分组");
    //   return;
    // }
    groupType.value = "add";
    groupDetail.supId = data.data.value;
    groupDetail.supName = data.data.label;
    groupDetail.groupName = "";
    groupDialogTitle.value = "新增分组";
  } else {
    groupType.value = "edit";
    groupDetail.supId = data.node.parent.data.value; // 父节点value
    groupDetail.supName = data.node.parent.data.label; // 父节点label
    groupDetail.groupName = data.data.label;
    groupDetail.id = data.data.value;
    groupDialogTitle.value = "编辑分组";
  }

  showGroupDetail.value = true;
};

const goTo = (key, data, type = "") => {
  if (key === "onTreeCurrentChange") {
    // console.log("data", data);
    if (type === "position") {
      positionConfigData.treeCurrent = data.data.$treeNodeId;
      let positionObj = {};
      if (data.data.isRoot) {
        positionObj = {
          buildingId: null,
          levelId: null,
          roomId: null,
        };
      } else {
        if (data.data.buildingId == null && data.data.floorId == null) {
          // 点击的是楼栋
          positionObj = {
            buildingId: data.data.value,
            levelId: null,
            roomId: null,
          };
        } else if (data.data.buildingId != null && data.data.floorId == null) {
          // 点击的是楼层
          positionObj = {
            buildingId: data.data.buildingId,
            levelId: data.data.value,
            roomId: null,
          };
        } else {
          // 点击的是房间
          positionObj = {
            buildingId: data.data.buildingId,
            levelId: data.data.floorId,
            roomId: data.data.value,
          };
        }
      }
      emit("update:position", positionObj);
    } else {
      groupConfigData.treeCurrent = data.data.$treeNodeId;
      if (data.data.isRoot) {
        emit("update:orgId", "");
      } else {
        emit("update:orgId", data.data.value);
      }
    }
  }
};
// 获取设备位置树
const getPositionTree = async () => {
  const res = await getPositionList();
  if (res.success) {
    positionConfigData.propConfig.treeList = [
      { label: "全部", value: "", isRoot: true, children: [] },
    ];
    res.data.forEach((building) => {
      let buildingObj = {};
      buildingObj.label = building.name;
      buildingObj.value = building.id;
      if (building.floorNodeList && building.floorNodeList.length > 0) {
        buildingObj.children = [];
        building.floorNodeList.forEach((floor) => {
          let floorObj = {};
          floorObj.label = floor.floor;
          floorObj.value = floor.floorId;
          floorObj.buildingId = building.id;
          if (floor.doorPlateNodes && floor.doorPlateNodes.length > 0) {
            floorObj.children = [];
            floor.doorPlateNodes.forEach((room) => {
              let roomObj = {};
              roomObj.label = room.number;
              roomObj.value = room.id;
              roomObj.buildingId = building.id;
              roomObj.floorId = floor.floorId;
              floorObj.children.push(roomObj);
            });
          }
          buildingObj.children.push(floorObj);
        });
      }
      positionConfigData.propConfig.treeList[0].children.push(buildingObj);
    });
  }
};
// 获取设备分组树
const getGroupList = async () => {
  const res = await getGroupListApi();
  if (res.success) {
    console.log("设备分组列表", res.data);
    groupConfigData.propConfig.treeList = [];
    let groupObj = {};
    groupObj.label = res.data.orgName;
    groupObj.value = res.data.orgId;
    groupObj.isRoot = true;
    groupObj.children = [];
    if (res.data.deviceGroupDTOS.length > 0) {
      res.data.deviceGroupDTOS.forEach((device) => {
        groupObj.children.push({
          label: device.orgName,
          value: device.orgId,
        });
      });
    }
    groupConfigData.propConfig.treeList.push(groupObj);
  }
};

onMounted(() => {
  getPositionTree();
  getGroupList();
});
</script>

<style scoped lang="scss">
.dialog-footer {
  display: flex;
  justify-content: end;
}
.aside_box {
  width: 240px;
  padding: 8px;
  height: 100%;
  overflow-x: hidden;
  text-align: center;
  ::v-deep(.el-tabs) {
    .el-tabs__content {
      // height: 640px;
      overflow-y: auto;
    }
    .el-tabs__nav-scroll {
      display: flex;
      justify-content: center;
    }
    .el-tabs__active-bar {
      // left: 23%;
      background-color: #4886ff;
    }
    .el-tabs__item {
      font-weight: 600;
      color: #262b34;
      &.is-active {
        color: #4886ff;
      }
    }
  }
}
</style>
