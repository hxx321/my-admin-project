<template>
  <!-- 在home这个模块中，我们主要使用的是Layout布局 -->
  <el-row :gutter="20" class="home">
    <el-col :span="8" style="margin-top: 10px">
      <el-card shadow="hover">
        <div class="user">
          <img :src="getImageUrl('user')" class="user" />
          <div class="user-info">
            <p class="user-info-admin">Admin</p>
            <p class="user-info-p">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间 <span>2024-06-30</span></p>
          <p>上次登录地点 <span>北京</span></p>
        </div>
      </el-card>
      <el-card shadow="hover" class="user-table">
        <el-table :data="tableData">
          <el-table-column
            v-for="(val, key) in tableLabel"
            :label="val"
            :prop="key"
            :key="key"
          ></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 10px">
      <div class="num">
        <el-card
          v-for="item in countData"
          :key="item.name"
          :body-style="{ display: 'flex', padding: 0 }"
        >
          <component
            :is="item.icon"
            class="icons"
            :style="{ background: item.color }"
          ></component>
          <div class="detail">
            <p class="number">￥{{ item.value }}</p>
            <p class="txt">￥{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <el-card class="top-echart">
        <div ref="echart" style="height: 240px"></div>
      </el-card>
      <div class="graph">
        <el-card>
          <div ref="userEchart" style="height: 200px" class="bar"></div>
        </el-card>
        <el-card>
          <div ref="videoEchart" style="height: 200px"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted, reactive } from "vue";
import * as echarts from "echarts";
const { proxy } = getCurrentInstance();

const getImageUrl = (user) => {
  return new URL(`../assets/images/${user}.png`, import.meta.url).href;
};

const tableData = ref([
  {
    name: "Java",
    todayBuy: 100,
    monthBuy: 200,
    totalBuy: 300,
  },
  {
    name: "Python",
    todayBuy: 100,
    monthBuy: 200,
    totalBuy: 300,
  },
]);

const tableLabel = ref({
  name: "课程",
  todayBuy: "今日购买",
  monthBuy: "本月购买",
  totalBuy: "总购买",
});
const countData = ref([]);
const getTableData = async () => {
  const data = await proxy.$api.getTableData();
  tableData.value = data.tableData;
};
const getCountData = async () => {
  const data = await proxy.$api.getCountData();
  countData.value = data;
  console.log(countData.value);
};
const echart = ref(null);
const userEchart = ref(null);
const videoEchart = ref(null);
//折线图和柱状图公用的图标设置
const xOptions1 = reactive({
  // 图例文字颜色
  textStyle: {
    color: "#333",
  },
  //图例
  legend: {},
  //图标网格（控制图标容器的内边距）
  grid: {
    left: "10%", //图标距离容器左侧20%宽度
    top: "10%",
  },
  // 提示框
  tooltip: {
    //当鼠标移动到某一X轴位置时，高州所有系列的数据都会同时显示
    trigger: "axis",
  },
  xAxis: {
    type: "category", // 类目轴
    data: [],
    //轴线样式
    axisLine: {
      lineStyle: {
        color: "#17b3a3",
      },
    },
    //轴线的文字样式
    axisLabel: {
      //强制显示所有轴标签，不自动隐藏
      interval: 0,
      color: "#333",
    },
  },
  yAxis: [
    {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#17b3a3",
        },
      },
    },
  ],
  //全局颜色数组
  //为series自动分配颜色，多个系列会一次循环使用这些颜色
  color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
  series: [],
});

const xOptions2 = reactive({
  // 图例文字颜色
  textStyle: {
    color: "#333",
  },
  //图例
  legend: {
    top: "0%",
    left: "center",
  },
  //图标网格（控制图标容器的内边距）
  grid: {
    left: "10%", //图标距离容器左侧20%宽度
    top: "20%",
  },
  // 提示框
  tooltip: {
    //当鼠标移动到某一X轴位置时，高州所有系列的数据都会同时显示
    trigger: "axis",
  },
  xAxis: {
    type: "category", // 类目轴
    data: [],
    //轴线样式
    axisLine: {
      lineStyle: {
        color: "#17b3a3",
      },
    },
    //轴线的文字样式
    axisLabel: {
      //强制显示所有轴标签，不自动隐藏
      interval: 0,
      color: "#333",
    },
  },
  yAxis: [
    {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "#17b3a3",
        },
      },
    },
  ],
  //全局颜色数组
  //为series自动分配颜色，多个系列会一次循环使用这些颜色
  color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
  series: [],
});

const pieOptions = reactive({
  tooltip: {
    trigger: "item",
  },
  //修改图里位置的代码，给legend加上位置配置
  legend: {
    top: "0", //距离顶部0%，也就是贴着顶部
    left: "center", //水平居中
    orient: "horizontal", //图例横向排列（默认就是横向，可加可不加）
  },
  color: [
    "#0f78f4",
    "#dd536b",
    "#9462e5",
    "#a6a6a6",
    "#e1bb22",
    "#39c362",
    "#3ed1cf",
  ],

  series: [],
});
const getChartData = async () => {
  const { orderData, userData, videoData } = await proxy.$api.getChartData();
  //设置第一个图表
  xOptions1.xAxis.data = orderData.date;
  xOptions1.series = Object.keys(orderData.data[0]).map((val) => ({
    name: val,
    data: orderData.data.map((item) => item[val]),
    type: "line",
  }));

  const oneChart = echarts.init(echart.value);
  oneChart.setOption(xOptions1);
  //对第二个表格进行渲染
  xOptions2.xAxis.data = userData.map((item) => item.date);
  xOptions2.series = [
    {
      name: "新增用户",
      data: userData.map((item) => {
        return item.new;
      }),
      type: "bar",
    },
    {
      name: "活跃用户",
      data: userData.map((item) => item.active),
      type: "bar",
    },
  ];
  const twoChart = echarts.init(userEchart.value);
  twoChart.setOption(xOptions2);

  //第三个图表

  pieOptions.series = [
    {
      data: videoData,
      type: "pie",
    },
  ];
  const threeChart = echarts.init(videoEchart.value);
  threeChart.setOption(pieOptions);
  //对页面进行监听，当页面尺寸发生变化的时候，图标自动改变自身尺寸
  window.addEventListener("resize", function () {
    oneChart.resize();
    twoChart.resize();
    threeChart.resize();
  });
};

onMounted(() => {
  getTableData();
  getCountData();
  getChartData();
});
</script>
<style scoped lang="less">
.home {
  height: 100%;
  overflow: hidden;
  .user {
    display: flex;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    align-items: center;
    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }
    .user-info {
      p {
        line-height: 40px;
      }
      .user-info-p {
        color: #999;
      }
      .user-info-admin {
        font-size: 35px;
      }
    }
  }
  .login-info {
    p {
      line-height: 30px;
      font-size: 14px;
      color: #999;
      span {
        color: #666;
        margin-left: 60px;
      }
    }
  }
  .user-table {
    margin-top: 20px;
  }
  .num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-card {
      width: 32%;
      margin-bottom: 20px;
    }
    .icons {
      width: 50px;
      height: 50px;
      font-size: 20px;
      text-align: center;
      line-height: 80px;
      color: #fff;
    }
    .detail {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .number {
        font-size: 20px;
        margin-bottom: 5px;
      }
      .txt {
        font-size: 10px;
        text-align: center;
      }
    }
  }
  .graph {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .el-card {
      width: 48%;
      height: 260px;
    }
  }
}
</style>
