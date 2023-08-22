<!--
 * @Author: 钱杰程
 * @Date: 2022-06-20 12:34:42
 * @LastEditTime: 2023-08-22 10:47:28
 * @LastEditors: 孙红日
 * @Description: 
 * @FilePath: \access-control-system\src\views\Device\components\tableList.vue
 * 可以输入预定的版权声明、个性签名、空行等
-->
<template>
  <div class="operate_bar">
    <div class="btns_box">
      <el-radio-group v-model="patchChangeState" @change="batchChange">
        <el-radio
          v-for="(item, index) in btnList"
          :name="item.value"
          :label="item.value"
          :key="index"
          :class="[patchChangeState === item.value ? 'active' : '']"
        >
          <img
            :src="patchChangeState === item.value ? item.active : item.icon"
            alt=""
          />
          {{ item.label }}
        </el-radio>
      </el-radio-group>
      <el-button class="move_btn" @click="moveTo">
        <img
          style="width: 14px; height: 14px; margin-right: 4px"
          :src="move_normal"
          alt=""
        />
        移动
      </el-button>
    </div>
    <div class="mode_box">
      <img
        :src="list_icon"
        @click="changeShowMode(1)"
        :class="[showMode === 1 ? 'active' : '']"
        style="margin-right: 24px"
      />
      <img
        :src="pic_icon"
        @click="changeShowMode(2)"
        :class="[showMode === 2 ? 'active' : '']"
        style="margin-right: 4px"
      />
    </div>
  </div>
  <div class="table_header_box" v-if="patchChangeState !== ''">
    <el-table
      header-row-class-name="head_style"
      height="54px"
      :data="[]"
      style="width: 100%"
    >
      <!-- <el-table-column width="55px"></el-table-column> -->
      <el-table-column>
        <template #header>
          <div>
            <span style="margin-left: 30px">
              已选中
              <span style="color: #4886ff; font-size: 14px">
                {{ tableSelection.length }}
              </span>
              项
            </span>
            <span style="margin-left: 60px">
              <span
                @click="handlePatch"
                style="cursor: pointer; color: #4886ff; font-size: 16px"
              >
                批量{{
                  patchChangeState === CLOSE
                    ? "合闸"
                    : patchChangeState === OPEN
                    ? "分闸"
                    : patchChangeState === CALL
                    ? "呼叫"
                    : ""
                }}操作
              </span>
              （如：如对多个设备进行勾选时，可进行批量{{
                patchChangeState === CLOSE
                  ? "合闸"
                  : patchChangeState === OPEN
                  ? "分闸"
                  : patchChangeState === CALL
                  ? "呼叫"
                  : ""
              }}操作）
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="150px">
        <template #header>
          <div
            @click="cancelOperate"
            style="cursor: pointer; color: #4886ff; font-size: 16px"
          >
            取消批量操作
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 列表 -->
  <div class="table_box" v-show="showMode == 1">
    <el-table
      v-loading="loading"
      ref="deviceTableRef"
      :fit="true"
      :data="tableData"
      class="power-table"
      highlight-current-row
      @selection-change="handleSelectionChange"
      @filter-change="handleFilterChange"
    >
      <el-table-column
        type="selection"
        width="35px"
        fixed="left"
        :selectable="selectEnable"
      ></el-table-column>
      <el-table-column
        v-for="(item, index) in tableConfigArr"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :show-overflow-tooltip="true"
        :filters="item.isFilter && item.filterOptions"
        filter-placement="bottom"
        :filter-multiple="false"
        :column-key="item.isFilter && item.prop"
      >
        <template #default="scope">
          <span
            v-if="item.prop == 'status'"
            :style="{ color: scope.row.status == 1 ? '#6C6E73' : '#FF9F00' }"
          >
            {{ scope.row.status == 1 ? "在线" : "离线" }}
          </span>
          <span
            v-if="item.prop == 'runStatus'"
            :style="{ color: scope.row.runStatus == 1 ? '#F55217' : '#6C6E73' }"
          >
            {{ scope.row.runStatus == 1 ? "告警" : "正常" }}
          </span>
          <span
            v-if="item.prop == 'switchStatus'"
            :style="{
              color: scope.row.switchStatus == 1 ? '#6C6E73' : '#F55217',
            }"
          >
            {{ scope.row.switchStatus == 1 ? "合闸" : "分闸" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180px"
        fixed="right"
        style="background-color: #fff"
      >
        <template #default="scope">
          <span
            class="oper"
            v-if="scope.row.switchStatus == 1"
            @click="handleExecute(0, scope.row.deviceId)"
          >
            分闸
          </span>
          <span
            class="oper"
            v-else
            @click="handleExecute(1, scope.row.deviceId)"
          >
            合闸
          </span>
          <el-divider direction="vertical"></el-divider>
          <span class="oper" @click="handleExecute(2, scope.row.deviceId)">
            呼叫
          </span>
          <el-divider direction="vertical"></el-divider>
          <span @click="goToDetail(scope.row)" class="oper">详情</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        layout="total, prev, pager, next, sizes, jumper"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="tablePageInfo.pageSize"
        :current-page="tablePageInfo.currentPage"
        :total="props.total"
        @current-change="(val) => changePage('table', val)"
        @size-change="(val) => handleSizeChange('table', val)"
      ></el-pagination>
    </div>
  </div>
  <div class="picture_box" v-show="showMode == 2">
    <el-row
      :style="{
        height: patchChangeState !== '' ? '400px' : '440px',
        'overflow-y': 'auto',
        padding: '8px',
      }"
      :gutter="20"
    >
      <el-col v-for="(item, index) in tableData" :key="index" :span="8">
        <el-card :class="[item.runStatus == 1 ? 'alarm_box' : '']">
          <div class="row_header">
            <!-- 在线状态 -->
            <div
              :class="[item.status ? 'live' : 'offline', 'online_state']"
            ></div>
            <div style="display: flex">
              <el-checkbox
                v-model="item.checked"
                :disabled="picSelectEnable(item)"
                @change="changeStatus(item)"
              ></el-checkbox>
              <div class="pic_title">
                <span class="name" :title="item.name">
                  {{ item.name }}
                </span>
                <span class="time">上报时间：{{ item.time }}</span>
              </div>
            </div>
            <div class="oper_btn">
              <el-button
                size="small"
                type="primary"
                style="
                  border-radius: 12px;
                  box-shadow: 0px 6px 12px 0px rgba(63, 140, 255, 0.26);
                "
                @click="goToDetail(item)"
              >
                详情
              </el-button>
              <!-- <el-button
                size="small"
                style="
                  border-radius: 12px;
                  box-shadow: 0px 6px 12px 0px rgba(63, 140, 255, 0.26);
                  margin-left: 4px;
                "
                color="#F55217"
                v-if="item.runStatus == 1"
              >
                处理告警
              </el-button> -->
            </div>
          </div>
          <div class="pic_box">
            <el-image
              style="width: 140px; border-right: 1px solid #eceaef"
              :src="item.src"
              :zoom-rate="1.5"
              fit="scale-down"
              hide-on-click-modal
              :preview-src-list="[item.src]"
            ></el-image>
            <div class="info">
              <el-scrollbar>
                <div class="info_items">
                  <div
                    class="info_item"
                    v-for="(props, index) of item.devicePropertyMapping"
                    :key="index"
                  >
                    <el-tooltip :content="propMapping[props]" placement="top">
                      <span>{{ propMapping[props] }}</span>
                    </el-tooltip>
                    ：
                    <el-tooltip
                      :content="item.deviceProperty[props]"
                      placement="top"
                    >
                      <span>{{ item.deviceProperty[props] }}</span>
                    </el-tooltip>
                  </div>
                </div>
              </el-scrollbar>
              <div class="info_btn">
                <el-button
                  size="small"
                  style="width: 64px; border-radius: 12px"
                  v-if="item.switchStatus == 1"
                  @click="handleExecute(0, item.deviceId)"
                  type="primary"
                >
                  分闸
                </el-button>
                <el-button
                  size="small"
                  style="width: 64px; border-radius: 12px"
                  v-else
                  @click="handleExecute(1, item.deviceId)"
                >
                  合闸
                </el-button>
                <el-button
                  size="small"
                  style="width: 64px; border-radius: 12px"
                  @click="handleExecute(2, item.deviceId)"
                >
                  呼叫
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div class="pagination">
      <el-pagination
        layout="total, prev, pager, next,sizes, jumper"
        :page-size="PicPageInfo.pageSize"
        :page-sizes="[6, 12, 18, 24, 30, 36, 42, 48]"
        :current-page="PicPageInfo.currentPage"
        :total="props.total"
        @current-change="() => changePage('pic', val)"
        @size-change="(val) => handleSizeChange('pic', val)"
      ></el-pagination>
    </div>
  </div>
  <el-dialog
    class="move_dialog"
    title="移动"
    v-model="showMoveModal"
    width="500px"
  >
    <div>
      <TreeList
        :isShowCheckbox="groupConfigData.isShowCheckbox"
        :isHighlightCurrent="groupConfigData.isHighlightCurrent"
        :treeCurrent="groupConfigData.treeCurrent"
        :treeDefaultExpandedKeys="groupConfigData.treeDefaultExpandedKeys"
        @onCurrentChange="onTreeCurrentChange"
        :asideStore="groupConfigData.propConfig"
        :showOperate="false"
      ></TreeList>
    </div>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="() => (showMoveModal = false)">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="confirm">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import TreeList from "./TreeList.vue";
import close_normal from "@/assets/device/close_normal.png";
import close_active from "@/assets/device/close_active.png";
import open_normal from "@/assets/device/open_normal.png";
import open_active from "@/assets/device/open_active.png";
import call_normal from "@/assets/device/call_normal.png";
import call_active from "@/assets/device/call_active.png";
import move_normal from "@/assets/device/move_normal.png";
import move_active from "@/assets/device/move_active.png";
import list_icon from "@/assets/device/list_icon.png";
import pic_icon from "@/assets/device/pic_icon.png";
import {
  getGroupList as getGroupListApi,
  moveGroup,
  batchExecute,
} from "../api";
const propMapping = {
  capacity: "漏检漏保能力",
  current_A: "A相电流",
  electricityConsumption: "采集电量",
  mode: "设备模式",
  powerLevel_A: "A相功率",

  ratedCurrent: "额定电流",
  ratedPower: "空开P数",
  softwareVersion: "软件版本号",
  temperature_A: "A相温度",
  temperature_L: "零线温度",

  turnOnState: "开关状态",
  voltage_A: "A项电压",
};
const btnList = [
  {
    label: "批量合闸",
    value: "CLOSE",
    icon: close_normal,
    active: close_active,
  },
  { label: "批量分闸", value: "OPEN", icon: open_normal, active: open_active },
  { label: "批量呼叫", value: "CALL", icon: call_normal, active: call_active },
  // { label: "移动", value: "MOVE", icon: move_normal, active: move_active },
];
const props = defineProps([
  "tableData",
  "tableConfigArr",
  "showMode",
  "total",
  "loading",
  "filterState",
]);
const emit = defineEmits([
  "update:showMode",
  "getPageParams",
  "getSizeParams",
  "getData",
  "getQueryParams",
]);

// 表头筛选
const handleFilterChange = (column) => {
  Object.keys(column).forEach((key) => {
    column[key] = column[key][0];
  });
  emit("getQueryParams", column);
};
watch(
  () => props.filterState,
  () => {
    deviceTableRef.value.clearFilter(["status", "runStatus", "switchStatus"]);
  }
);

// 移动分组
const groupConfigData = reactive({
  isShowCheckbox: false,
  isHighlightCurrent: true,
  treeCurrent: null,
  treeDefaultExpandedKeys: [],
  propConfig: {
    config: {
      draggable: false,
    },
    isLoading: false,
    treeType: 1,
    treeList: [],
  },
});
onMounted(() => {
  getGroupList();
  // emitter.on("clear", () => {
  //   console.log(123);
  //   deviceTableRef.value.clearFilter(["status", "runStatus", "switchStatus"]);
  // });
  // console.log("props.tableData", props.tableData);
});
// 获取设备分组树
const getGroupList = async () => {
  const res = await getGroupListApi();
  if (res.success) {
    groupConfigData.propConfig.treeList = [];
    let groupObj = {};
    groupObj.label = res.data.orgName;
    groupObj.value = res.data.orgId;
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
// 目标分组
const targetOrgId = ref("");
const onTreeCurrentChange = (data) => {
  groupConfigData.treeCurrent = data.data.$treeNodeId;
  targetOrgId.value = data.data.value;
};
const showMoveModal = ref(false);
const moveTo = () => {
  if (tableSelection.value.length == 0) {
    ElMessage.warning("请先勾选需要移动的设备");
    return;
  }
  getGroupList();
  showMoveModal.value = true;
  // 清空之前选中的分组
  targetOrgId.value = "";
};
const confirm = async () => {
  if (!targetOrgId.value) {
    ElMessage.warning("请先勾选分组");
    return;
  }
  isLoading.value = true;
  const res = await moveGroup({
    targetOrgId: targetOrgId.value,
    groupNodes: tableSelection.value.map((item) => ({
      deviceId: item.deviceId,
      protoOrgId: item.orgId,
    })),
  });
  if (res.success) {
    ElMessage.success("分组移动成功");
    emit("getData");
    isLoading.value = false;
    showMoveModal.value = false;
  } else {
    ElMessage.success(res.message);
  }
};
const isLoading = ref(false);
// 移动分组 End

const router = useRouter();
const tableSelection = ref([]);
const handleSelectionChange = (val) => {
  // if (patchChangeState.value == "") {
  //   ElMessage.warning("请先选择批量操作变更按钮，否则该勾选动作将无效");
  // }
  tableSelection.value = val;
};
const goToDetail = (item) => {
  router.push(`/dms/deviceDetail/deviceInfo`);
  localStorage.setItem("deviceDetail", JSON.stringify(item));
};

// 批量操作
const patchChangeState = ref("");
const CLOSE = "CLOSE";
const OPEN = "OPEN";
const CALL = "CALL";
const batchChange = () => {
  if (props.showMode === 1) {
    deviceTableRef.value.clearSelection();
  } else if (props.showMode === 2) {
    props.tableData.forEach((item) => (item.checked = false));
    tableSelection.value = [];
  }
};
const deviceTableRef = ref();
const cancelOperate = () => {
  if (props.showMode === 1) {
    deviceTableRef.value.clearSelection();
    // tableSelection.value = [];
  } else if (props.showMode === 2) {
    props.tableData.forEach((item) => (item.checked = false));
    tableSelection.value = [];
  }
  patchChangeState.value = "";
};
const picSelectEnable = (item) => {
  // console.log(patchChangeState.value);
  return patchChangeState.value !== "" && !selectEnable(item);
  //
};
const changeStatus = (item) => {
  if (item.checked) {
    tableSelection.value.push(item);
  } else {
    let idx = tableSelection.value.findIndex((list) => item.id === list.id);
    tableSelection.value.splice(idx, 1);
  }
};
const selectEnable = (row, rowIndex) => {
  if (patchChangeState.value === CLOSE) {
    // 离线 或者 在线但合闸 的设备不能批量合闸
    if (row.status == 0 || row.switchStatus == 1) {
      return false;
    }
    return true;
  } else if (patchChangeState.value === OPEN) {
    // 离线 或者 在线但分闸 的设备不能批量分闸
    if (!row.status || row.switchStatus == 0) {
      return false;
    }
    return true;
  } else if (patchChangeState.value === CALL) {
    // 离线 设备不能批量呼叫
    return row.status;
  }
  return true;
};
// 批量分合闸呼叫
const handlePatch = async () => {
  if (tableSelection.value.length == 0) {
    ElMessage.warning("请先勾选需要批量操作的设备");
    return;
  }
  const res = await batchExecute({
    action:
      patchChangeState.value == OPEN
        ? 0
        : patchChangeState.value == CLOSE
        ? 1
        : 2,
    deviceIds: tableSelection.value.map((item) => item.deviceId),
  });
  if (res.success) {
    ElMessage.success("批量操作成功");
    tableSelection.value = [];
    patchChangeState.value = "";
    emit("getData");
  } else {
    ElMessage.error(res.message);
  }
};
// 单独分合闸呼叫
const handleExecute = async (type, id) => {
  const res = await batchExecute({
    action: type,
    deviceIds: [id],
  });
  if (res.success) {
    ElMessage.success("操作成功");
    emit("getData");
  } else {
    ElMessage.error(res.message);
  }
};

//图文切换时，取消已有勾选
const changeShowMode = (type) => {
  emit("update:showMode", type);
  patchChangeState.value = "";
  if (props.showMode === 2) {
    deviceTableRef.value.clearSelection();
  } else if (props.showMode === 1) {
    props.tableData.forEach((item) => (item.checked = false));
    tableSelection.value = [];
  }
};
// 表格分页
const tablePageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});
// 图文分页
const PicPageInfo = reactive({
  currentPage: 1,
  pageSize: 6,
  total: 0,
});
const changePage = (type, val) => {
  if (type === "table") {
    tablePageInfo.currentPage = val;
  } else {
    PicPageInfo.currentPage = val;
  }
  emit("getPageParams", { type, val });
};
const handleSizeChange = (type, val) => {
  if (type === "table") {
    tablePageInfo.pageSize = val;
  } else {
    PicPageInfo.pageSize = val;
  }
  emit("getSizeParams", { type, val });
};
</script>

<style scoped lang="less">
.el-link {
  margin-right: 8px;
}
.table_header_box {
  height: 54px;
  // line-height: 37px;
  overflow: hidden;
  margin-bottom: 10px;
}
.alarm_box {
  animation: alarming 4s infinite;
  .row_header {
    background: linear-gradient(
      279deg,
      rgba(245, 82, 23, 0.1) 0%,
      rgba(245, 82, 23, 0.2) 100%
    );
  }
  // transition: all ;
}
@keyframes alarming {
  0% {
    border: 2px solid #f55217;
    box-shadow: 0px 2px 8px 2px rgba(245, 82, 23, 0.5);
  }
  25% {
    border: 2px solid transparent;
    box-shadow: 0px 2px 8px 2px transparent;
  }
  50% {
    border: 2px solid #f55217;
    box-shadow: 0px 2px 8px 2px rgba(245, 82, 23, 0.5);
  }
  75% {
    border: 2px solid transparent;
    box-shadow: 0px 2px 8px 2px transparent;
  }
  100% {
    border: 2px solid #f55217;
    box-shadow: 0px 2px 8px 2px rgba(245, 82, 23, 0.5);
  }
  // 100% {
  //   border: 2px solid transparent;
  // }
}

.table_box {
  // height: 100%;
  height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  .el-table {
    flex: 1;
  }
}
.el-table {
  ::v-deep(.el-table__column-filter-trigger i:before) {
    font-family: "zr-iconfont" !important;
    font-size: 13px;
    font-style: normal;
    content: "\e69f";
  }
  width: 100%;
  ::v-deep(tr) {
    height: 37px;
    line-height: 37px;
  }
  ::v-deep(.head_style) th {
    background-color: #f5f6fa;
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #9ea1a7;
    line-height: 20px;
  }
  ::v-deep(.el-table__body) tr.current-row > td {
    background-color: rgba(236, 243, 255);
  }
  ::v-deep(.el-table__body) tr:hover {
    td {
      background-color: rgba(236, 243, 255);
      font-weight: bold;
    }
  }
}
.pagination {
  display: flex;
  justify-content: end;
  margin-top: 10px;
  height: 34px;
  .el-pagination {
    ::v-deep(.el-pager) .number.active {
      background-color: #4886ff !important;
      color: #fff;
    }
    ::v-deep(.el-pager) .number {
      background-color: #fff !important;
      border-radius: 6px;
      border: 1px solid #e5e9f2;
      margin: 0 4px;
      width: 32px;
      height: 32px;
      line-height: 32px;
    }
    ::v-deep(.btn-prev),
    ::v-deep(.btn-next) {
      border: 1px solid #e5e9f2;
      border-radius: 6px;
      width: 32px;
      height: 32px;
      line-height: 32px;
      margin: 0 4px;
      padding: 0 10px;
      text-align: center;
    }
  }
}
.operate_bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  height: 32px;
}
.oper {
  cursor: pointer;
  font-weight: 400;
  color: #4886ff;
}
.mode_box {
  display: flex;
  justify-content: end;
  align-items: center;
  height: 32px;

  .active {
    color: rgb(72, 134, 255);
  }
}
.el-card {
  background: #ffffff;
  border-radius: 8px;
  border: 2px solid #e5e9f2;
  ::v-deep(.el-card__body) {
    display: flex;
    // height: 230px;
    flex-direction: column;
    padding: 0;
  }
  margin: 0 0 18px;
}

.el-row {
  flex: 1;
  overflow-y: auto;
}
.row_header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: start;
  height: 60px;
  line-height: 20px;
  padding: 10px 15px 0;
  background: linear-gradient(
    279deg,
    rgba(126, 187, 255, 0.1) 0%,
    rgba(72, 134, 255, 0.2) 100%
  );
  ::v-deep(.el-checkbox) {
    .el-checkbox__inner {
      width: 16px;
      height: 16px;
    }
  }
  .online_state {
    position: absolute;
    right: 5px;
    top: 5px;
    border-radius: 50%;
    width: 8px;
    height: 8px;
    box-shadow: 0px 2px 4px 0px rgba(179, 122, 27, 0.2);
  }
  .live {
    background: #0dc89a;
  }
  .offline {
    background: #ccc;
  }

  ::v-deep(.el-checkbox) {
    width: 30px;
  }
  .pic_title {
    flex: 0 0 220px;
    display: flex;
    flex-direction: column;
    span {
      overflow: hidden;
      width: 220px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .name {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #262b34;
      line-height: 22px;
    }
    .time {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #c0c2c6;
      line-height: 20px;
    }
  }
  .oper_btn {
  }
}
.device_name {
  height: 30px;
  line-height: 30px;
  display: flex;
  justify-content: space-between;
  .alarm {
    color: red;
    cursor: pointer;
  }
}
.pic_box {
  flex: 1;
  display: flex;
  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    .info_items {
      height: 120px;
      overflow-y: scroll;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding-top: 15px;
      .info_item {
        width: 48%;
        line-height: 30px;
        padding-left: 5px;
        height: 30px;
        display: flex;
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #6c6e73;
          line-height: 30px;
        }
        span:nth-child(1) {
          width: 60px;
        }
        span:nth-child(2) {
          flex: 1;
        }
      }
    }
    .info_btn {
      height: 40px;
    }
  }
}
.picture_box {
  height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.btns_box {
  flex: 1;
  display: flex;
  align-items: center;
  color: #6c6e73;
  ::v-deep(.el-radio-group) {
    display: flex;
    height: 32px;
    flex-wrap: nowrap;
    .el-radio__input {
      display: none;
    }
    .el-radio {
      // width: 60%;
      padding: 0 8px;
      max-width: 104px;
      text-align: center;
      height: 32px;
      line-height: 30px;
      // padding: 0;
      margin: 0;
      text-align: center;
      background: rgba(229, 233, 242, 0.5);
      border-radius: 12px;
      display: flex;
      justify-content: center;
      border: 1px solid transparent;
      transition: all 0.2s;
      .el-radio__label {
        display: flex;
        align-items: center;
      }
      img {
        width: 14px;
        height: 14px;
        margin-right: 4px;
      }
      &.active {
        border: 1px solid rgba(72, 134, 255, 0.5);
        color: #4886ff;
      }
      &:hover {
      }
    }
    .el-radio + .el-radio {
      margin-left: 5%;
    }

    .el-radio__label {
      padding: 0 !important;
      font-size: 14px;
    }
  }
  .move_btn {
    width: 9%;
    max-width: 104px;
    background: rgba(229, 233, 242, 0.5);
    border-radius: 12px;
    border: 0px;
    margin-left: 38px;
    color: #6c6e73;
    &:hover {
      color: #6c6e73;
    }
  }
}
.mode_box {
  img {
    width: 32px;
    height: 32px;
    transition: all 0.2s;
    background: #e8eff8;
    border-radius: 5px;
    &:hover {
      box-shadow: 0px 6px 12px 0px rgba(36, 81, 169, 0.2);
    }
    &.active {
      box-shadow: 0px 6px 12px 0px rgba(36, 81, 169, 0.2);
    }
  }
}
.el-dialog.move_dialog {
  height: 400px;
  ::v-deep(.el-dialog__body) {
    padding: 20px;
  }
}
</style>
<style lang="less">
.el-table-filter {
  .el-checkbox {
    border-radius: 4px;
    padding: 1px 8px;
    text-align: center;
    .el-checkbox__label {
      padding: 0;
    }
    &:hover {
      color: #4886ff;
      background-color: rgba(72, 134, 255, 0.2);
      border-radius: 4px;
      padding: 1px 8px;
    }
  }
  .el-checkbox__input {
    display: none;
  }
  .is-checked {
    color: #4886ff;
    background-color: rgba(72, 134, 255, 0.2);
    border-radius: 4px;
    padding: 1px 8px;
  }
  .el-table-filter__list {
    min-width: 0;
    width: 80px;
    max-width: 150px;
    max-height: 360px;
    // padding-bottom: 8px;
    padding: 0 10px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    .el-table-filter__list-item {
      padding-left: 8px;
      padding-right: 8px;
      white-space: nowrap;
      text-align: center;
      line-height: 23px;
      border-radius: 4px;
      font-size: 14px;
      font-family: "PingFangSC-Regular";
      color: #6c6e73;
      margin-top: 8px;
      margin-bottom: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      &.is-active {
        background: rgba(72, 134, 255, 0.2);
        box-shadow: 0px 2px 6px 0px rgba(63, 140, 255, 0.1);
        color: #4886ff;
      }
    }
  }
}
</style>
