//该文件主要是提前写好不同环境下，真实接口和mock接口分别是什么
let env = import.meta.env.MODE || "pro";
let EnvConfig = {
  development: {
    //baseApi和mockApi都只是请求地址的前缀
    baseApi: "/api",
    mockApi: "https://apifoxmock.com/m/4068509-0-default/api",
  },
  test: {
    baseApi: "//test.future.com/api",
    mockApi: "https://apifoxmock.com/m/4068509-0-default/api",
  },
  prod: {
    baseApi: "//future.com/api",
    mockApi: "https://apifoxmock.com/m/4068509-0-default/api",
  },
};
export default {
  env,
  ...EnvConfig[env],
};
