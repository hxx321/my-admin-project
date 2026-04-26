// 创建路由
//1.引入模块
import { createRouter, createWebHashHistory } from "vue-router";
import Main from "@/views/Main.vue";
import Home from "@/views/Home.vue";
import User from "@/views/User.vue";
import Mail from "@/views/Mail.vue";
import Login from "@/views/Login.vue";
import Error from "@/views/404.vue";
//2.创建路由器
const routes = [
  {
    path: "/",
    component: Main,
    name: "main",
    redirect: "/home",
    children: [
      // {
      //   path: "/home",
      //   name: "home",
      //   component: Home,
      // },
      // {
      //   path: "/user",
      //   name: "user",
      //   component: User,
      // },
      // {
      //   path: "/mail",
      //   name: "mail",
      //   component: Mail,
      // },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/404",
    name: "404",
    component: Error,
  },
];

//3.创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

//4.把路由暴露出去
export default router;
