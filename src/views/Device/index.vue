<template>
  <div class="device_box">
    <h2>设备列表</h2>
    <div class="body">
      <aside>
        <device-aside
          v-model="activeTab"
          v-model:position="searchForm.position"
          v-model:orgId="searchForm.orgId"
          @getData="getData"
        ></device-aside>
      </aside>
      <main>
        <div class="header">
          <div class="search">
            <deviceQuery
              @getQueryParams="getParams"
              :query="searchForm"
            ></deviceQuery>
          </div>
          <div class="total_count">
            <div
              v-for="(item, index) in totalCount"
              class="total_item"
              :key="index"
            >
              <img :src="item.icon" alt="" />
              <div class="total_info">
                <span>{{ item.count }}</span>
                <span>{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="table-container">
          <deviceTable
            :loading="loading"
            :tableData="tableData"
            :tableConfigArr="tableConfigArr"
            @getPageParams="getPageInfo"
            @getSizeParams="getPageSizeInfo"
            @getData="getData"
            v-model:showMode="showMode"
            :total="tableDataTotal"
          ></deviceTable>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import total_count from "@/assets/device/total_count.png";
import live_count from "@/assets/device/live_count.png";
import offline_count from "@/assets/device/offline_count.png";
import alarm_count from "@/assets/device/alarm_count.png";
import { ref, reactive, computed, nextTick, onMounted, watch } from "vue";
import DeviceAside from "./components/DeviceAside.vue";
import deviceQuery from "./components/queryList.vue";
import deviceTable from "./components/tableList.vue";

// import { useStore } from "pinia";
import { getDeviceList, statisticsData, getDevicePicture } from "./api";

const activeTab = ref(1);
// const store = useStore();
// 筛选条件
const searchForm = reactive({
  position: {
    buildingId: "", //楼栋id
    levelId: "", //楼层id
    roomId: "", //房间id
  },
  orgId: "",
  name: "", //设备名称
  code: "", //设备编码
  type: "", //所属产品
  status: "", //在离线状态
  parentDeviceName: "", //上级设备名称
  runStatus: "", //运行状态   0：正常，1：告警
  switchStatus: "",
});
const getParams = (item) => {
  Object.assign(searchForm, item);
  // getData();
};

watch(
  () => searchForm,
  (val) => {
    getData();
  },
  {
    deep: true,
  }
);

const totalCount = ref([
  { label: "设备总数", count: 0, icon: total_count },
  { label: "在线设备", count: 0, icon: live_count },
  { label: "告警设备", count: 0, icon: alarm_count },
  { label: "离线设备", count: 0, icon: offline_count },
]);
const loading = ref(false);
const tableData = ref([]);
// 列表数据总数
const tableDataTotal = ref(0);
const tableConfigArr = [
  {
    prop: "name",
    label: "设备名称",
    width: "100px",
  },
  {
    prop: "code",
    label: "设备编码",
  },
  {
    prop: "nodeTypeName",
    label: "设备类型",
    width: "100px",
  },
  {
    prop: "typeName",
    label: "所属产品",
    width: "100px",
  },
  {
    prop: "position",
    label: "设备位置",
    width: "100px",
  },
  {
    prop: "parentDeviceName",
    label: "上级设备",
    width: "100px",
  },
  {
    prop: "groupName",
    label: "设备分组",
    width: "100px",
  },
  {
    prop: "status",
    label: "在离线状态",
    width: "100px",
  },
  {
    prop: "runStatus",
    label: "运行状态",
    width: "100px",
  },
  {
    prop: "switchStatus",
    label: "分合闸状态",
    width: "100px",
  },
  {
    prop: "time",
    label: "上报时间",
    width: "150px",
  },
];
const getPageInfo = ({ type, val }) => {
  getData(val, null);
};
const getPageSizeInfo = ({ type, val }) => {
  getData(null, val);
};
//  1列表 / 2图文
const showMode = ref(1);
const getData = async (currentPage, pageSize) => {
  loading.value = true;
  const query = {};
  if (activeTab.value === 1) {
    // 设备位置筛选
    query.positionCmd = searchForm.position;
  } else {
    // 设备分组筛选
    query.orgId = searchForm.orgId;
  }
  // 获取表格数据
  if (showMode.value === 1) {
    query.pageSize = pageSize || 10;
    query.currentPage = currentPage || 1;
  } else if (showMode.value === 2) {
    query.pageSize = pageSize || 6;
    query.currentPage = currentPage || 1;
  }
  query.name = searchForm.name;
  //设备名称
  query.code = searchForm.code;
  //设备编码
  query.type = searchForm.type;
  //所属产品
  query.status = searchForm.status;
  //在离线状态
  query.parentDeviceName = searchForm.parentDeviceName;
  //上级设备名称
  query.runStatus = searchForm.runStatus;
  //运行状态   0：正常，1：告警
  query.switchStatus = searchForm.switchStatus;
  // console.log("query", query);
  // 发请求
  const res = await getDeviceList(query);
  let ids = [];
  if (res.success) {
    loading.value = false;
    tableData.value = [];
    tableDataTotal.value = res.totalCount;
    res.data.forEach((item) => {
      item.checked = false;
      ids.push(item.type);
      item.devicePropertyMapping = Object.keys(item.deviceProperty);
      tableData.value.push(item);
    });
  }

  // 获取产品图片
  if (showMode.value == 2) {
    const picUrls = await getDevicePicture({ ids: ids.join(",") });
    if (picUrls.code === "0000000") {
      tableData.value.forEach((item, i) => {
        item.src = picUrls.data[i].imageUrl;
      });
    }
    // console.log(picUrls);
  }

  // 获取统计数据
  const statisticsQuery = query;
  delete statisticsQuery.pageSize;
  delete statisticsQuery.currentPage;
  // console.log("statisticsQuery", statisticsQuery);
  const statisticsRes = await statisticsData(statisticsQuery);
  if (statisticsRes.success) {
    totalCount.value[0].count = statisticsRes.data.total;
    totalCount.value[1].count = statisticsRes.data.onLine;
    totalCount.value[2].count = statisticsRes.data.alarm;
    totalCount.value[3].count = statisticsRes.data.offLine;
  }
};
watch(
  () => showMode.value,
  () => {
    getData();
  }
);
onMounted(() => {
  getData();
});
</script>

<style scoped lang="less">
.device_box {
  display: flex;
  flex-direction: column;
  height: 100%;
  // flex: 1;
  background-color: #fff;
  border-radius: 8px;
  h2 {
    height: 33px;
    font-size: 24px;
    font-weight: 500;
    color: #6c6e73;
    line-height: 33px;
    padding-left: 24px;
    margin: 15px 0;
    font-family: PingFangSC-Medium, PingFang SC;
  }
  .body {
    width: 100%;
    display: flex;
    flex: 1;
    width: 100%;
  }

  aside {
    width: 240px;
    height: calc(100% - 12px);
    overflow-x: hidden;
    border-radius: 8px;
    border: 2px solid #ebedf4;
    background-color: #fff;
    // margin: 0 24px;
    margin-left: 24px;
  }
  main {
    width: calc(100% - 330px);
    height: 100%;
    padding-left: 24px;
  }
}
.header {
  flex: 1;
  width: 100%;
}
.total_count {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #eaecef;
  margin: 0px 0 15px;
  height: 88px;
  background: linear-gradient(122deg, #f2f8ff 0%, #f1f7ff 100%);
  border-radius: 5px;
  .total_item {
    display: flex;
    align-items: center;
    img {
      width: 56px;
      height: 56px;
      margin-right: 19px;
    }
    .total_info {
      display: flex;
      flex-direction: column;
      color: #6c6e73;
      span:nth-child(1) {
        font-size: 24px;
        height: 33px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
      }
      span:nth-child(2) {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
      }
    }
  }
}
.table-container {
  padding: 0 !important;
  overflow: hidden;
}
</style>
