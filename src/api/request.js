//二次封装axios的引入

//收到接口层的请求，真正发起HTTP GET请求到/api/home/getTableData
//而这个请求原本是要发到后台服务器的，但是被mock拦截，拦截之后返回了假数据，
//这一步的原因是我没没有后台服务器，去让mock.js充当一个假后台
//相当于后厨
import axios from "axios";
import { ElMessage } from "element-plus";
import config from "@/config";
const service = axios.create({
  //数据交互添加
  baseURL: config.baseApi,
});
const NETWORK_ERROR = "网络错误";
// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 添加响应拦截器
service.interceptors.response.use((res) => {
  const { code, data, msg } = res.data;
  if (code == 200) {
    return data;
  } else {
    ElMessage.error(msg || NETWORK_ERROR);
    return Promise.reject(msg || NETWORK_ERROR);
  }
});

function request(options) {
  options.method = options.method || "get";
  //数据交互添加的数据
  //begin
  //关于get请求参数的调整
  if (options.method.toLowerCase() === "get") {
    options.params = options.data;
  }
  //对mock的开关做一个处理
  let isMock = config.mock;
  if (typeof options.mock !== "undefined") {
    isMock = options.mock;
  }

  //针对环境做一个处理
  if (config.env === "prod") {
    //不能用mock
    service.defaults.baseURL = config.baseApi;
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
  }
  //end
  return service(options);
}

export default request;
