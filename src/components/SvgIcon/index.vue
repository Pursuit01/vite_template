<template>
  <div>
    <svg aria-hidden="true">
      <use :href="symbolId" :fill="color" />
    </svg>
  </div>
</template>

<script setup>
const props = defineProps({
  prefix: {
    type: String,
    default: "icon",
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "#333",
  },
  // style: {
  //   type: Object,
  //   default: () => ({
  //     width: "2em",
  //     height: "2em",
  //   }),
  // },
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>

<style lang="less" scoped></style>
