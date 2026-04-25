<template>
  <!-- collapse:这个属性用于控制垂直菜单(mode="vertical") 是否折叠，设为true时菜单首位窄栏
   仅显示图标，悬浮式展示文字提示，false 则正常展开-->
  <el-menu
    background-color="#545c64"
    text-color="#fff"
    :collapse="isCollapse"
    :collapse-transition="false"
    :default-active="activeMenu"
  >
    <!-- collapse-transition:用于控制菜单在进行collapse切换的时候是否启用过渡动画 -->
    <h4 v-show="!isCollapse">后台管理系统</h4>
    <h4 v-show="isCollapse">后台</h4>
    <el-menu-item
      v-for="item in noChildren"
      :key="item.path"
      :index="item.path"
      @click="handleMenu(item)"
    >
      <el-icon>
        <component :is="item.icon" class="icon"></component>
      </el-icon>
      <span>{{ item.label }}</span>
    </el-menu-item>
    <el-sub-menu
      v-for="item in hasChildren"
      :key="item.path"
      :index="item.path"
    >
      <template #title>
        <el-icon>
          <component :is="item.icon" class="icon"></component>
        </el-icon>
        <span>{{ item.label }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item
          v-for="t in item.children"
          :key="t.path"
          :index="t.path"
          @click="handleMenu(t)"
        >
          <el-icon>
            <component :is="t.icon" class="icon"></component>
          </el-icon>
          <span>{{ t.label }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
  </el-menu>
</template>
<script setup>
import { ref, computed } from "vue";
import { useAllDataStore } from "../stores";
import { useRoute, useRouter } from "vue-router";
// const list = ref([
//   {
//     path: "/home",
//     name: "home",
//     label: "首页",
//     icon: "house",
//     url: "Home",
//   },
//   {
//     path: "/mail",
//     name: "mail",
//     label: "商品管理",
//     icon: "video-play",
//     url: "Mail",
//   },
//   {
//     path: "/user",
//     name: "user",
//     label: "用户管理",
//     icon: "user",
//     url: "User",
//   },
//   {
//     path: "other",
//     label: "其他",
//     icon: "location",
//     children: [
//       {
//         path: "/page1",
//         name: "page1",
//         label: "页面1",
//         icon: "setting",
//         url: "Page1",
//       },
//       {
//         path: "/page2",
//         name: "page2",
//         label: "页面2",
//         icon: "setting",
//         url: "Page2",
//       },
//     ],
//   },
// ]);
const noChildren = computed(() => list.value.filter((item) => !item.children));
const hasChildren = computed(() => list.value.filter((item) => item.children));
const store = useAllDataStore();
const list = computed(() => store.state.menuList);
const route = useRoute();
const router = useRouter();
const isCollapse = computed(() => {
  return store.state.isCollapse;
});
const activeMenu = computed(() => route.path);
const handleMenu = (item) => {
  router.push(item.name);
  store.selectMenu(item);
};
</script>
<style scoped>
:deep(.el-menu) {
  background-color: #545c64;
  border-right: none;
  height: 100%;
}
:deep(.icon) {
  width: 18px;
  height: 18px;
  margin-right: 5px;
}
h4 {
  text-align: center;
  line-height: 48px;
  color: #fff;
}
</style>
