//这段代码的整体作用：
/**
 * 1.代替真实后端，接收前端的登录请求（账号，密码）
 * 验证账号密码，返回对应的菜单列表和token
 * 实现不同角色的菜单权限控制
 */

import Mock from "mockjs";
export default {
  getMenu: (config) => {
    let info = JSON.parse(config.body);
    const { username, password } = info;
    //角色权限设置
    //管理员账号
    if (username === "admin" && password === "admin") {
      return {
        code: 200,
        data: {
          menuList: [
            {
              path: "/home",
              name: "home",
              label: "首页",
              icon: "house",
              url: "Home",
            },
            {
              path: "/mail",
              name: "mail",
              label: "商品管理",
              icon: "video-play",
              url: "Mail",
            },
            {
              path: "/user",
              name: "user",
              label: "用户管理",
              icon: "user",
              url: "User",
            },
            {
              path: "other",
              label: "其他",
              icon: "location",
              children: [
                {
                  path: "/page1",
                  name: "page1",
                  label: "页面1",
                  icon: "setting",
                  url: "Page1",
                },
                {
                  path: "/page2",
                  name: "page2",
                  label: "页面2",
                  icon: "setting",
                  url: "Page2",
                },
              ],
            },
          ],
          //token:相当于登录通行证（买的门票）
          token: Mock.Random.guid(),
          message: "获取成功",
        },
      };
    } else if (username === "xiaoxiao" && password === "xiaoxiao") {
      return {
        code: 200,
        data: {
          menuList: [
            {
              path: "/home",
              name: "home",
              label: "首页",
              icon: "house",
              url: "Home",
            },
            {
              path: "/user",
              name: "user",
              label: "用户管理",
              icon: "user",
              url: "User",
            },
          ],
          token: Mock.Random.guid(),
          message: "获取成功",
        },
      };
    } else {
      return {
        code: -999,
        data: {
          message: "密码错误",
        },
      };
    }
  },
};
