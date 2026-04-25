/**
 * 整个项目api的统一管理
 */

//接口(用来把前端和后端建立联系)，相当于一个服务员
import request from "./request";

//请求管理首页左侧的表格的数据

export default {
  getTableData() {
    //接口层不直接发送请求，而是把请求参数（地址，方法）交给request.js里面的axios
    //相当于前台服务员把你的点单需求交给了后厨
    return request({
      //数据交互添加数据
      //start
      //线上mock地址
      // url: "https://apifoxmock.com/m1/4068509-0-default/api/home/getTable",
      //本地mock地址
      url: "/home/getTableData",
      //end
      method: "get",
      //数据交互添加数据
      //start
      // mock: false,
      //end
    });
  },

  //首页count获取
  getCountData() {
    return request({
      url: "/home/getCountData",
      method: "get",
    });
  },

  //请求获取echarts数据
  getChartData() {
    return request({
      url: "/home/getChartData",
      method: "get",
    });
  },
  getUserData(data) {
    return request({
      url: "/user/getUserData",
      method: "get",
      data,
    });
  },
  deleteUser(data) {
    return request({
      url: "/user/deleteUser",
      method: "get",
      data,
    });
  },
  addUser(data) {
    return request({
      url: "/user/addUser",
      method: "post",
      data,
    });
  },
  updateUser(data) {
    return request({
      url: "/user/updateUser",
      method: "post",
      data,
    });
  },
  getMenuList(data) {
    return request({
      url: "/permission/getMenu",
      method: "post",
      data,
    });
  },
};
