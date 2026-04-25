import { createApp } from "vue";
import App from "./App.vue";
import "@/assets/less/index.less";
//引入路由
import router from "./router/index";
//引入element-plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
//注册图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
//挂载pinia
import { createPinia } from "pinia";
import api from "@/api/api";
import "@/api/mock.js";
import { useAllDataStore } from "./stores";
const pinia = createPinia();
const app = createApp(App);
//1.路由匹配函数
function isRoute(to) {
  //先获取当前页面中已经注册的路由列表
  let res = router.getRoutes();
  let resFil = res.filter((item) => item.path === to.path);
  return resFil.length > 0;
}

//2.设置全局路由守卫
router.beforeEach((to, from) => {
  if (to.path !== "/login" && !store.state.token) {
    return { name: "login" };
  }
  if (!isRoute(to)) {
    return { name: "404" };
  }
});
//挂载路由
app.use(router);
app.use(ElementPlus);
app.use(pinia);
const store = useAllDataStore();
store.addMenu(router, "refresh");

app.config.globalProperties.$api = api;
app.mount("#app");
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
