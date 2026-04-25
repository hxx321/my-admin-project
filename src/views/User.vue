<template>
  <!-- 顶部搜索框 -->
  <!-- 作用：页面最上方，提供‘新增用户和搜索用户’的入口 -->

  <div class="user-header">
    <!-- type=primary 表示蓝色主题 -->
    <el-button type="primary" @click="handleAdd">+新增</el-button>
    <!-- inline=true 表示所有的表单项在一行显示 -->
    <el-form :inline="true" :model="formInline">
      <el-form-item label="请输入">
        <el-input
          placeholder="请输入用户名"
          v-model="formInline.keyWord"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <!-- 触发handleSearch准备发起网络请求 -->
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 表格区域 -->
  <div class="table">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        v-for="item in tableLabel"
        :key="item.prop"
        :width="item.width ? item.width : 125"
        :prop="item.prop"
        :label="item.label"
      ></el-table-column>

      <el-table-column fixed="right" label="Operations" min-width="120">
        <template #default="scoped">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scoped.row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scoped.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- 通过：1.v-model:current-page="config.page" 2.@current-change="getUserData" 这两个属性相互配合，实现分页功能 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="config.total"
      class="pager"
      v-model:current-page="config.page"
      @current-change="getUserData"
    />
  </div>

  <!-- 设置弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    :title="action === 'add' ? '添加用户' : '编辑用户'"
    :before-close="handleClose"
    width="35%"
  >
    <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="formUser.name"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="age" label="年龄">
            <el-input
              v-model="formUser.age"
              placeholder="请输入年龄"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item class="select-clearn" label="性别" prop="sex">
            <el-select v-model="formUser.sex" placeholder="请选择">
              <el-option label="男" value="1" />
              <el-option label="女" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birth">
            <el-date-picker
              v-model="formUser.birth"
              type="date"
              placeholder="请输入"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="formUser.addr" placeholder="请输入地址"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button type="primary" @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确认</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted, reactive, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
const tableData = ref([]);
const { proxy } = getCurrentInstance(); //获取当前组件的实例
const userForm = ref(null);
const config = reactive({
  name: "",
  total: 0,
  page: 1,
});
//获取用户列表数据
const getUserData = async () => {
  let data = await proxy.$api.getUserData(config);
  console.log(data);
  //map后面如果返回的是对象要用()把它们包裹起来
  tableData.value = data.list.map((item) => ({
    ...item,
    sexLabel: item.sex == "1" ? "男" : "女",
  }));
  config.total = data.count;
};
const tableLabel = reactive([
  {
    prop: "name",
    label: "姓名",
  },
  {
    prop: "age",
    label: "年龄",
  },
  {
    prop: "sexLabel",
    label: "性别",
  },
  {
    prop: "birth",
    label: "出生日期",
    width: 200,
  },
  {
    prop: "addr",
    label: "地址",
    width: 400,
  },
]);
const formInline = reactive({
  keyWord: "",
});
//模糊查询
const handleSearch = () => {
  config.name = formInline.keyWord;
  getUserData();
};
//删除功能
//这段代码的作用：用户点击“删除”按钮时，弹出确认框，确认后调用删除接口，刷新列表
const handleDelete = (val) => {
  ElMessageBox.confirm("你确定要删除吗？").then(async () => {
    await proxy.$api.deleteUser({ id: val.id });
    ElMessage({ showClose: true, message: "删除成功", type: "success" });
    getUserData();
  });
};

//新增模块
//控制弹窗的显示或者隐藏
let dialogVisible = ref(false);
//设置弹窗的标题
let action = ref("add");
const formUser = reactive({
  name: "",
  age: "",
  sex: "1",
  birth: "",
  addr: "",
});
const handleAdd = () => {
  action = "add";
  dialogVisible.value = true;
};

//点击取消按钮关闭弹窗
const handleCancel = () => {
  dialogVisible.value = false;
  proxy.$refs["userForm"].resetFields();
};
//先制定表单规则
const rules = reactive({
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  age: [{ required: true, message: "年龄是必填项", trigger: "blur" }],
  sex: [{ required: true, message: "性别是必填项", trigger: "change" }],
  birth: [{ required: true, message: "出生日期是必选项" }],
  addr: [{ required: true, message: "地址是必填项" }],
});
//点击确认按钮提交数据并添加用户信息
//同时进行表单的校验，校验通过才能提交
const handleClose = () => {
  dialogVisible.value = false;
  proxy.$refs["userForm"].resetFields();
};
const onSubmit = () => {
  proxy.$refs["userForm"].validate(async (vaild) => {
    if (vaild) {
      let res = null;
      console.log("222");
      console.log(formUser);
      if (action === "add") {
        res = await proxy.$api.addUser(formUser);
        console.log(res);
        console.log("111");
      } else {
        res = await proxy.$api.updateUser(formUser);
      }
      if (res) {
        dialogVisible.value = false;
        proxy.$refs["userForm"].resetFields();
        getUserData();
      }
    } else {
      ElMessage({
        showClose: true,
        message: "请输入正确内容",
        type: "error",
      });
    }
  });
};
//编辑用户
const handleEdit = (val) => {
  dialogVisible.value = true;
  action = "edit";
  //sex:""+val.sex  强制将输入的sex转化成字符串型
  Object.assign(formUser, { ...val, sex: "" + val.sex });
};
onMounted(() => {
  getUserData();
});
</script>
<style scoped lang="less">
.user-header {
  display: flex;
  justify-content: space-between;
}
.table {
  position: relative;
  height: 520px;
  .pager {
    position: absolute;
    right: 10px;
    bottom: 30px;
  }
  .el-table {
    width: 100%;
    height: 500px;
  }
}
.select-clearn {
  display: flex;
  width: 200px;
}
</style>
