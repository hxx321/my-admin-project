//mock=模拟，假数据，虚拟街廓：在指示后端接口没写完，没部署，不可用时，用代码/工具栏拦截请求，返回预设的假数据
//核心原理：

import Mock from "mockjs";
import homeApi from "./mockData/home";
import userApi from "./mockData/user";
import permissionApi from "./mockData/permission";
//1 拦截的路径 2 方法  3 制造出的假数据
Mock.mock(/api\/home\/getTableData/, "get", homeApi.getTableData);
//首页count数据的获取
Mock.mock(/api\/home\/getCountData/, "get", homeApi.getCountData);
Mock.mock(/api\/home\/getChartData/, "get", homeApi.getChartData);
Mock.mock(/api\/user\/getUserData/, "get", userApi.getUserData);
Mock.mock(/api\/user\/deleteUser/, "get", userApi.deleteUser);
Mock.mock(/api\/user\/addUser/, "post", userApi.addUser);
Mock.mock(/api\/user\/updateUser/, "post", userApi.updateUser);
Mock.mock(/api\/permission\/getMenu/, "post", permissionApi.getMenu);
