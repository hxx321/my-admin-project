<template>
  <!-- 分析主页面的结构 -->
  <!-- 1.用一个大盒子包裹住整体，然后用el-container的左右结构设置出测边框，头部和主体部分 -->
  <div class="common-layout">
    <el-container class="lay-container">
      <!-- 自定义侧边框插件 -->
      <el-aside :width="Width" :collapse="isCollapse">
        <common-aside />
      </el-aside>
      <el-container>
        <el-header>
          <!-- 自定义头部插件 -->
          <common-header />
        </el-header>
        <common-tag />
        <el-main class="rightmain">
          <!-- 路由出口 -->

          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import CommonAside from "@/components/CommonAside.vue";
import CommonHeader from "@/components/CommonHeader.vue";
import CommonTag from "@/components/CommonTag.vue";
import { computed } from "vue";
import { useAllDataStore } from "../stores";
const store = useAllDataStore();
const Width = computed(() => {
  return store.state.isCollapse ? "51px" : "180px";
});
const isCollapse = computed(() => {
  return store.state.isCollapse;
});
</script>
<style scoped>
.common-layout,
.lay-container {
  height: 100%;
}
:deep(.el-header) {
  background-color: #333;
}
:deep(.el-aside) {
  background-color: #545c64;
  height: 100vh;
}
</style>
