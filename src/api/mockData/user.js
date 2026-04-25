import Mock from "mockjs";

// get请求从config.url获取参数，post从config.body中获取参数
function param2Obj(url) {
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}',
  );
}

let List = [];
const count = 200;
//模拟200条用户数据
for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: Mock.Random.guid(),
      name: Mock.Random.cname(),
      addr: Mock.mock("@county(true)"),
      "age|18-60": 1,
      birth: Mock.Random.date(),
      sex: Mock.Random.integer(0, 1),
    }),
  );
}

export default {
  /**
   * 获取列表
   * 要带参数 name, page, limt; name可以不填, page,limit有默认值。
   * @param name, page, limit
   * @return {{code: number, count: number, data: *[]}}
   */
  getUserData: (config) => {
    //limit默认是10，因为分页器默认也是一页10个
    //从查询参数里面只拿到了name和page,limit没有是我们定义的默认值
    const { name, page = 1, limit = 10 } = param2Obj(config.url);

    const mockList = List.filter((user) => {
      //如果name存在会，根据name筛选数据
      if (name && user.name.indexOf(name) === -1) return false;
      return true;
    });
    //分页
    //根据传来的page去查询当前页面的用户信息
    const pageList = mockList.filter(
      (item, index) => index < limit * page && index >= limit * (page - 1),
    );
    return {
      code: 200,
      data: {
        list: pageList,
        count: mockList.length, //数据总条数需要返回
      },
    };
  },

  //删除用户的执行逻辑
  deleteUser: (config) => {
    const { id } = param2Obj(config.url);
    if (!id) {
      return {
        code: -999,
        msg: "参数不正确",
      };
    } else {
      List = List.filter((u) => {
        return u.id !== id;
      });
      return {
        code: 200,
        msg: "删除成功",
      };
    }
  },

  addUser: (config) => {
    const { name, age, sex, birth, addr } = JSON.parse(config.body);
    List.unshift({
      id: Mock.Random.guid(),
      name: name,
      age: age,
      sex: sex,
      birth: birth,
      addr: addr,
    });
    return {
      code: 200,
      data: {
        messge: "添加成功",
      },
    };
  },
  updateUser: (config) => {
    const { id, name, age, sex, birth, addr } = JSON.parse(config.body);
    const sex_num = parseInt(sex);
    List.some((u) => {
      if (u.id === id) {
        u.name = name;
        u.age = age;
        u.sex = sex_num;
        u.birth = birth;
        u.addr = addr;
      }
    });
    return {
      code: 200,
      data: {
        messge: "编辑成功",
      },
    };
  },
};
