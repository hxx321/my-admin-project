<template>
  <div class="header">
    <div class="l-content">
      <el-button size="small" @click="handleCollapse">
        <el-icon class="icons"><Menu /></el-icon>
      </el-button>
      <!-- 面包屑 -->
      <el-breadcrumb separator="/" class="bread pointer">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="current" :to="current.path">{{
          current.label
        }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img :src="getImageUrl('user-default')" class="user" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLoginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import { useAllDataStore } from "../stores";
import { useRouter } from "vue-router";
import { computed } from "vue";
const getImageUrl = (user) => {
  return new URL(`../assets/images/${user}.png`, import.meta.url).href;
};
const store = useAllDataStore();
const handleCollapse = () => {
  store.state.isCollapse = !store.state.isCollapse;
};
const router = useRouter();
const handleLoginOut = () => {
  store.clean();
  router.push("login");
};
const current = computed(() => {
  return store.state.currentMenu;
});
</script>
<style scoped>
.header {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
}
.icons {
  width: 20px;
  height: 20px;
}
.l-content {
  display: flex;
  align-items: center;
  .el-button {
    margin-right: 20px;
  }
}
.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  :deep(.bread span) {
    cursor: pointer;
  }
}
:deep(.el-breadcrumb-item) {
  cursor: pointer;
}
</style>
