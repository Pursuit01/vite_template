<template>
  <div class="aside-tree-container" v-loading="asideStore.isLoading">
    <el-tree
      ref="asideTreeRef"
      class="aside-tree"
      icon="Plus"
      :indent="0"
      :draggable="asideStore.config.draggable"
      :data="asideStore.treeList"
      :props="treeProps"
      :default-expand-all="false"
      :current-node-key="treeCurrent"
      @current-change="(data, node) => goTo('currentChange', { data, node })"
      :node-key="treeNodeKey"
      :highlight-current="isHighlightCurrent"
      :show-checkbox="isShowCheckbox"
      @check-change="
        (item, isChecked, hasChildrenChecked) =>
          goTo('checkChange', { item, isChecked, hasChildrenChecked })
      "
      @check="(check, checks) => goTo('onCheck', { check, checks })"
    >
      <template #default="{ node, data }">
        <div
          class="tree-item"
          :class="{ isShow: true, isCurrent: data.$treeNodeId == treeCurrent }"
        >
          <!-- {{ data.id }}---{{ treeCurrent }} -->
          <div class="tree-item-label">
            <el-tooltip
              style="display: flex"
              placement="top-start"
              :content="node.label"
            >
              <span class="tooltip-content">{{ node.label }}</span>
            </el-tooltip>
          </div>

          <el-button-group v-if="showOperate" class="tree-item-btns">
            <template v-for="(item, index) in treeBtnList" :key="index">
              <el-button
                text
                class="tree-item-btn"
                :icon="item.icon"
                @click.stop="goTo(item.key, { data, node, item })"
                v-if="
                  (item.key === 'add' && node.level == 1) ||
                  (item.key === 'delete' && node.level != 1) ||
                  (item.key === 'edit' && node.level != 1)
                "
              ></el-button>
            </template>
          </el-button-group>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import {
  ref,
  watch,
  computed,
  reactive,
  nextTick,
  onMounted,
  toRefs,
} from "vue";
import { useRoute } from "vue-router";
const props = defineProps({
  asideStore: Object,
  showOperate: {
    type: [Boolean],
    default: true,
  },
  // treeType 1 部门列表树
  treeType: {
    type: [Number],
    default: 1,
  },
  isOrganizationTree: {
    type: [Boolean],
  },

  isFilter: {
    type: [Boolean],
    default: true,
  },

  treeNodeKey: {
    type: [String],
    default: "id",
  },
  treeCurrent: {
    type: [String, Number],
  },
  treeDefaultExpandedKeys: {
    type: [Array],
  },
  treeProps: {
    type: Object,
    default: () => {
      return {
        label: "label",
      };
    },
  },
  treeList: {
    type: [Array],
  },
  isTreeLoading: {
    type: [Boolean],
  },
  isShowCheckbox: {
    type: [Boolean],
  },
  isHighlightCurrent: {
    type: [Boolean],
    default: true,
  },
});
const treeFilterFormRef = ref();

// 当前tree 的ref
const asideTreeRef = ref();
const asideStore = computed(() => props.asideStore);
const treeList = computed(() => asideStore.treeList);
const route = useRoute();

watch(
  () => props.isTreeLoading,
  (isTreeLoading, preIsTreeLoading) => {
    asideStore.isLoading = isTreeLoading ? isTreeLoading : false;
  },
  {
    deep: true,
  }
);

watch(
  () => props.treeCurrent,
  (treeCurrent, preTreeCurrent) => {
    // console.log("watch-treeCurrent", treeCurrent);
    nextTick(() => {
      setCurrentKey(treeCurrent);
    });
  },
  {
    deep: true,
    immediate: true,
  }
);
const setCurrentKey = (id) => {
  // console.log(props.treeNodeKey, id);
  asideTreeRef.value?.setCurrentKey(id, true);
};
const setCheckedKeys = (id) => {
  asideTreeRef.value?.setCheckedKeys([id], false);
};

//    let _leafKeys = asideTreeRef.value?.getCheckedKeys(true,false);
// let _leafNodes = asideTreeRef.value?.getCheckedNodes(true);
const getCheckedKeys = (leafOnly) => {
  // (leafOnly) 接收一个布尔类型参数，默认为 false. 如果参数是 true, 它只返回当前选择的子节点数组。
  return asideTreeRef.value?.getCheckedKeys(leafOnly)
    ? asideTreeRef.value?.getCheckedKeys(leafOnly)
    : [];
};
const getCheckedNodes = (leafOnly, includeHalfChecked) => {
  //(leafOnly, includeHalfChecked) 接收两个布尔类型参数:
  // 1. 默认值为 false. 若参数为 true, 它将返回当前选中节点的子节点
  // 2. 默认值为 false. 如果参数为 true, 返回值包含半选中节点数据
  return asideTreeRef.value?.getCheckedNodes(leafOnly, includeHalfChecked);
};

const getCurrentKey = () => {
  return asideTreeRef.value?.getCurrentKey();
};
const getCurrentNode = () => {
  return asideTreeRef.value?.getCurrentNode();
};

// 根据 data 或者 key 拿到 Tree 组件中的 node
const getNode = (key) => {
  return asideTreeRef.value?.getNode(key);
};
const emits = defineEmits([
  "onClick",
  "onCurrentChange",
  "onCheck",
  "deleteNode",
  "addEditNode",
]);

const treeBtnList = [
  {
    label: "编辑",
    icon: "EditPen",
    key: "edit",
  },
  {
    label: "删除",
    icon: "Delete",
    key: "delete",
  },
  {
    label: "添加",
    icon: "CirclePlus",
    key: "add",
  },
];

// section goTo
const goTo = (key, data) => {
  if (key == "add" || key == "edit") {
    emits("addEditNode", key, data);
  }
  if (key == "delete") {
    emits("deleteNode", data);
  }

  if (key == "currentChange") {
    emitsOnCurrentChange(data);
  }
};
const emitsOnCurrentChange = (data) => {
  emits("onCurrentChange", data);
};
</script>

<style lang="scss" scoped>
.aside-tree-container {
  display: flex;
  flex-direction: column;

  box-sizing: border-box;
  //padding-top: 80px;
  position: relative;
  // width: 288px;
  background: #fff;
  flex-shrink: 0;
  //margin-right: 10px;
  //background:rgba(4,165,249,0.1);
  // border-radius: 8px;
  // border: 2px solid #ebedf4;

  /*//滚动条的宽度*/
  //::-webkit-scrollbar {
  //  width: 6px;
  //  height: 6px;
  //}

  ///*//滚动条的滑块*/
  //::-webkit-scrollbar-thumb {
  //  background-color: rgba(144, 147, 153, 0.3);
  //  border-radius: 3px;
  //}

  .aside-filter {
    flex-shrink: 0;
    overflow: hidden;
    //position: absolute;
    //top: 40px;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    min-height: 45px;
    padding: 25px 20px;

    //&:first-child {
    //  padding-top: 10px;
    //}
  }

  :deep(.aside-tree) {
    --el-tree-node-hover-bg-color: rgba(72, 134, 255, 0.1);
    --el-color-primary-light-9: transparent;
    --el-tree-node-current-bg: rgba(72, 134, 255, 0.1);
    --el-tree-node-icon-width: 16px;
    --el-tree-node-border-left: 1px dashed rgba(72, 134, 255, 0.5);
    --el-tree-node__content-height: 40px;
    --el-tree-transition: all 0.2s ease-in-out;
    padding: 0px 0 12px 0;
    //width: 100%;
    flex: 1;
    overflow-y: auto;
    background: transparent;

    // 左边虚线部分 ↓↓↓↓↓↓↓↓↓↓↓↓
    .el-tree-node {
      padding-left: 24px;
      position: relative;

      &:before {
        content: "";
        height: calc(100%);
        //width: 1px;
        position: absolute;
        left: calc(24px + var(--el-tree-node-icon-width) / 2);
        top: 0;
        border-left: var(--el-tree-node-border-left);
      }

      &:first-child:before {
        height: calc(100% - var(--el-tree-node__content-height) / 2);
        top: calc(var(--el-tree-node__content-height) / 2);
      }

      &:last-child:before {
        height: calc(100% - var(--el-tree-node__content-height) / 2);
        top: calc(0 + var(--el-tree-node__content-height) / 1);
      }
      &:only-child:before {
        height: calc(100% - var(--el-tree-node__content-height) / 2);
        top: calc(0 + var(--el-tree-node__content-height) / 1);
        opacity: 0;
      }

      .el-tree-node__content {
        overflow: hidden;
      }

      .el-tree-node__content {
        height: var(--el-tree-node__content-height);

        .el-icon.el-tree-node__expand-icon {
          width: var(--el-tree-node-icon-width);
          height: var(--el-tree-node-icon-width);
          background: #4886ff;
          border-radius: 2px;
          box-sizing: border-box;
          position: relative;
          transform: unset;

          svg {
            display: none;
          }

          &:before {
            transition: var(--el-tree-transition);
            content: " ";
            display: block;
            width: 10px;
            height: 2px;
            background: #ffffff;
            position: absolute;
            top: calc(50% - 1px);
            left: calc(50% - 5px);
            transform: rotate(0);
          }

          &:after {
            transition: var(--el-tree-transition);
            content: " ";
            display: block;
            width: 2px;
            height: 10px;
            background: #ffffff;
            position: absolute;
            top: calc(50% - 5px);
            left: calc(50% - 1px);
            transform: rotate(0);
          }

          &.is-leaf {
            //opacity: 0;
            opacity: 0.5;
            cursor: not-allowed;
          }

          &.expanded {
            &:before {
              transform: rotate(-180deg);
            }

            &:after {
              transform: rotate(90deg);
            }
          }
        }
      }
    }

    // 去掉最外层最后一个 多余的部分
    > .el-tree-node {
      &:before {
        opacity: 0;
      }
    }

    // 左边虚线部分 ↑↑↑↑↑↑↑↑↑↑

    .tree-item {
      //width: 100%;
      display: flex;
      align-items: center;
      flex: 1;
      overflow: hidden;
      height: 100%;
      box-sizing: border-box;
      line-height: 1;
      padding-left: 8px;
      padding-right: 20px;
      position: relative;
      //&:before{
      //  position: absolute;
      //  content:" ";
      //  display: block;
      //  height:100%;
      //  border-left: 2px solid rgba(72,134,255,0.5);
      //  left:0;
      //  top:0;
      //}

      .tree-item-label {
        display: flex;
        align-items: center;
        //flex: 1;
        height: 100%;
        padding-right: 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #6c6e73;

        .tooltip-default {
          padding: 0;
          height: unset;
          transition: var(--el-tree-transition);
        }

        .tree-item-label-text {
        }
      }

      .tree-item-btns {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        opacity: 0;
        transition: var(--el-tree-transition);

        pointer-events: none;
        width: 0;
        overflow: hidden;
        transform: scale(0);
        transform-origin: left;
        //&.isShow {
        //  width: auto;
        //  opacity: 1;
        //  pointer-events: auto;
        //}

        .tree-item-btn {
          border: 0;
          background-color: transparent;
          padding: 0 9px;
          margin: 0;
          //color:#4f6d95;
          color: #12294d;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;

          &:hover {
            color: #4886ff;
          }
        }
      }
    }

    .tree-item {
      &:hover {
        .tree-item-btns {
          width: auto;
          opacity: 1;
          pointer-events: auto;
          transform: scale(1);
        }
      }
    }

    .tree-item {
      &.isCurrent {
        // background: var(--el-tree-node-current-bg);
        // border-radius: 4px;
        // padding: 3px 20px 3px 4px;
        .tooltip-default {
        }
      }
    }

    .el-tree-node__content:has(.isCurrent) {
      background: var(--el-tree-node-current-bg);
      border-radius: 4px;
      padding: 3px 20px 3px 4px;
    }
  }
}
</style>
