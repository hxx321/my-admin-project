//创建pinia全局仓库，用来存储全局响应数据，相当于全局的ref 或者reactive
//导入全局状态仓库
import { defineStore } from "pinia";
import { ref, watch } from "vue";

//定义仓库的初始状态
function initState() {
  return {
    isCollapse: false,
    tags: [
      {
        path: "/home",
        name: "home",
        label: "首页",
        icon: "home",
      },
    ],
    currentMenu: null,
    menuList: [], //登陆后拿到的菜单列表
    token: "", //登陆后拿到的token
    routerList: [], //动态生成的路由列表
  };
}

export const useAllDataStore = defineStore("alldata", () => {
  const state = ref(initState());
  //监听state变化，实现本地持久化
  watch(state, (newObj) => {
    if (!newObj.token) return;
    localStorage.setItem("store", JSON.stringify(newObj), { deep: true });
  });
  //需要有两个方法 1.添加标签  2.删除标签
  //1.添加标签
  function selectMenu(tag) {
    //添加标签 1.判断标签是否存在 ，不存在则添加，存在则不添加
    if (tag.name === "home") {
      state.value.currentMenu = null;
    } else {
      state.value.currentMenu = tag;
      let index = state.value.tags.findIndex((item) => item.name === tag.name);
      index === -1 ? state.value.tags.push(tag) : "";
    }
  }

  //删除标签
  function updateTags(tag) {
    let index = state.value.tags.findIndex((item) => item.name === tag.name);
    state.value.tags.splice(index, 1);
  }

  //更新菜单列表
  function updateMenuList(val) {
    state.value.menuList = val;
  }

  //更新完菜单列表后我们要动态添加路由，因为菜单列表不同，所以不能把路由写死
  function addMenu(router, type) {
    //当页面刷新的时候，从localStorage里把之前存的状态读回来，恢复menuList和token
    //清空routerList,准备重新生成动态路由
    if (type === "refresh") {
      if (JSON.parse(localStorage.getItem("store"))) {
        state.value = JSON.parse(localStorage.getItem("store"));
        state.value.routerList = [];
      } else {
        return;
      }
    }
    //根据菜单列表生成路由配置
    const menu = state.value.menuList;
    const module = import.meta.glob("../views/**/*.vue");
    const routeArr = [];
    /**
     * 1. import.meta.glob(...):鼎泰导入所有.vue组件
     * 2.遍历menuList ,把每个菜单项对应的组件路径赋值给item.component,组装成完整的路由配置
     * 3.不管是一级菜单还是二级菜单，都统一放到routeAtt里
     */
    menu.forEach((item) => {
      if (item.children) {
        item.children.forEach((val) => {
          let url = `../views${val.url}.vue`;
          val.component = module[url];
          routeArr.push(...item.children);
        });
      } else {
        let url = `../views/${item.url}.vue`;
        item.component = module[url];
        routeArr.push(item);
      }
    });

    //清除旧路由防止重复添加
    state.value.routerList = [];
    let routes = router.getRoutes();
    routes.forEach((item) => {
      if (item.name == "main" || item.name == "login" || item.name == "404") {
        return;
      } else {
        router.removeRoute(item.name);
      }
    });
    routeArr.forEach((item) => {
      state.value.routerList.push(router.addRoute("main", item));
    });
  }
  /**
   * 1.退出登陆时调用这个方法
   * 2.清空动态添加的路由
   * 3.把state重置回初始状态（token.menuList都清空）
   * 4.删除localStorage里的持久化数据
   * 5.这样下次访问就会被路由守卫拦截，跳回登录页
   */
  function clean() {
    state.value.routerList.forEach((item) => {
      if (item) item();
    });
    state.value = initState();
    localStorage.removeItem("store");
  }
  return {
    state,
    selectMenu,
    updateTags,
    updateMenuList,
    addMenu,
    clean,
  };
});
