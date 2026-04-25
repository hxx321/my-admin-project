<template>
  <div class="body-login">
    <el-form :model="loginForm" ref="loginRef" class="login-container">
      <h1>欢迎登录</h1>
      <el-form-item label="账号">
        <el-input
          v-model="loginForm.username"
          type="input"
          placeholder="请输入账号"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          v-model="loginForm.password"
          type="input"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { reactive, getCurrentInstance } from "vue";
import { useAllDataStore } from "../stores";
import { useRouter } from "vue-router";
const loginForm = reactive({
  username: "",
  password: "",
});
const { proxy } = getCurrentInstance();
const store = useAllDataStore();
const router = useRouter();
//点击登录后的执行逻辑
const handleLogin = async () => {
  let res = await proxy.$api.getMenuList(loginForm);
  console.log(res);
  //拿到菜单之后在哪里显示呢
  //拿到数据后对菜单列表进行更新
  store.updateMenuList(res.menuList);
  //拿到返回的token
  store.state.token = res.token;
  //根据菜单列表动态生成路由，把我们定义的路由实例传进去
  //必须传入路由实例，因为新增路由，删除旧路由，必须借用router身上的专属方法才行
  /**
   * 1.新增一条路由：router.addRoute()
   * 2.删除一条旧路由：  router.removeRoute()
   * 3.获取当前所有路由 ： router.getRoute()
   */
  store.addMenu(router);
  //最后登录成功后跳转首页
  router.push("./home");
};
</script>
<style scoped lang="less">
.body-login {
  width: 100%;
  height: 100%;
  background-image: url("../assets/images/background.png");
  background-size: 100%;
  overflow: hidden;
}
.login-container {
  width: 400px;
  background-color: #fff;
  border: 1px solid #eaeaea;
  border-radius: 15px;
  padding: 35px 35px 15px 35px;
  box-shadow: 0 0 25px #cacaca;
  margin: 250px auto;
  h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #505450;
  }
  :deep(.el-form-item__content) {
    justify-content: center;
  }
  .el-form-item {
    margin-bottom: 20px;
  }
}
</style>
