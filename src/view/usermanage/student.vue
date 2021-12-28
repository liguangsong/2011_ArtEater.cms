<template>
  <div class="container-wrap">
    <div class="header-wrap">
      <div class="search-wrap clear-fix">
        <div class="search-keyword" style="width: 200px">
          <Input
            v-model="search_keyword"
            size="large"
            style="width: 200px"
            placeholder="请输入ID/昵称/姓名"
          />
        </div>
        <div class="select-choice clear-fix" style="width: 300px">
          <span>标签</span>
          <div class="search-keyword" style="width: 200px">
            <Input
              v-model="label"
              size="large"
              style="width: 200px"
              placeholder="请输入标签"
            />
          </div>
        </div>
        <div class="select-choice clear-fix" style="width: 500px">
          <span>注册时间</span>
          <div class="date-picker-wrap clear-fix" style="width: 400px">
            <div class="date-picker" style="width: 180px">
              <DatePicker
                v-model="search_start_date"
                size="large"
                type="date"
                placeholder="请输入开始时间"
              ></DatePicker>
            </div>
            <div class="label-split" style="height: 36px; line-height: 36px">
              -
            </div>
            <div class="date-picker" style="width: 180px">
              <DatePicker
                v-model="search_end_date"
                size="large"
                type="date"
                placeholder="请输入结束时间"
              ></DatePicker>
            </div>
          </div>
        </div>
        <div class="search-btn">
          <Button type="primary" @click="search" size="large">查询</Button>
        </div>
        <Button type="info" @click="exports">全部导出</Button>
      </div>
    </div>
    <Row class="table-wrap">
      <Table :loading="loading" :columns="columns" :data="users_datas"></Table>
      <div class="page-wrap">
        <Page :total="total" @on-change="pagechange" v-if="total > 0" />
      </div>
    </Row>

    <Modal
      v-model="isShowEdit"
      :title="window_title"
      mask
      width="450"
      scrollable
      @on-ok="edit"
    >
      <Form label-position="left" :label-width="45">
        <FormItem label="标签:">
          <Input v-model="user_forms.label" placeholder="请输入标签"></Input>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="show_window" :title="window_title" @on-ok="cancel">
      <div
        class="form"
        :model="user_forms"
        label-position="right"
        :label-width="120"
      >
        <div class="myFormShow">
          <div class="head">头像</div>
          <div class="cont">
            <Avatar
              shape="circle"
              icon="ios-person"
              size="large"
              v-if="user_forms.avatarUrl == ''"
            />
            <img
              v-else
              :src="user_forms.avatarUrl"
              style="width: 50px; height: 50px; border-radius: 50%"
            />
          </div>
        </div>
        <div class="myFormShow">
          <div class="head">昵称</div>
          <div class="cont">{{ user_forms.nickName }}</div>
        </div>
        <div class="myFormShow">
          <div class="head">姓名</div>
          <div class="cont">{{ user_forms.realname }}</div>
        </div>
        <div class="myFormShow">
          <div class="head">标签</div>
          <div class="cont">{{ user_forms.label }}</div>
        </div>
        <div class="myFormShow">
          <div class="head">手机号</div>
          <div class="cont">{{ user_forms.phone }}</div>
        </div>
        <div class="myFormShow">
          <div class="head">报考专业</div>
          <div class="cont">{{ user_forms.speciality }}</div>
        </div>
        <div class="myFormShow">
          <div class="head">目标院校</div>
          <div class="cont">{{ user_forms.university }}</div>
        </div>
        <div class="myFormShow">
          <div class="head">所在地区</div>
          <div class="cont">
            {{ user_forms.proviceName + "-" + user_forms.cityName }}
          </div>
        </div>
        <div class="myFormShow">
          <div class="head">消费金额(元)</div>
          <div class="cont">{{ user_forms.amount }}</div>
        </div>
        <div class="myFormShow">
          <div class="head">积分</div>
          <div class="cont">{{ user_forms.score }}</div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { tool } from "@/api/tool";
import excelUtil from "../../utils/dealwithExcelUtil";
export default {
  name: "studentindex",
  data() {
    return {
      page: 1,
      total: 0,
      loading: true,
      isShowEdit: false,
      user_id: "",
      window_title: "用户信息",
      show_window: false,
      search_keyword: "",
      search_start_date: "",
      search_end_date: "",
      label: "",
      columns: [
        { title: "ID", key: "id" },
        { title: "昵称", key: "nickName" },
        { title: "标签", key: "label" },
        { title: "姓名", key: "realname" },
        { title: "手机号", key: "phone" },
        {
          title: "注册时间",
          key: "createdAt",
          sortable: true,
          // render: (h, params) => {
          //   var txt = tool.dateFormat(
          //     params.row.createdAt,
          //     "yyyy-MM-dd HH:mm:ss"
          //   );
          //   return h("div", txt);
          // },
        },
        { title: "消费金额", key: "amount" },
        { title: "积分", key: "score", sortable: true },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            var button = [
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.isShowEdit = true;
                      this.user_forms.label = params.row.label;
                      this.user_id = params.row.id;
                      this.window_title = "标签编辑";
                    },
                  },
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.window_title = "用户信息";
                      this.user_id = params.row.id;
                      this.show_window = true;
                      this.get_entity();
                    },
                  },
                },
                "用户信息"
              ),
            ];
            return h("div", button);
          },
        },
      ],
      users_datas: [],
      users_datas2: [],
      user_forms: {
        nickName: "",
        label: "",
        realname: "",
        phone: "",
        amount: "",
        score: "",
        speciality: "",
        university: "",
        cityName: "",
        proviceName: "",
        registration_time: "",
        avatarUrl: "",
      },
    };
  },
  mounted() {
    this.page_list(this.page);
    this.page_list2();
  },
  methods: {
    edit() {
      console.log(this.user_forms.label);
      var query = new this.ParseServer.Query(this.ParseServer.User);
      query.get(this.user_id).then((item) => {
        item.set("label", this.user_forms.label);
        item.save().then(
          () => {
            this.page_list();
            this.$Message.success("编辑成功");
            this.isShowEdit = false;
            // this.cancel();
          },
          (error) => {
            this.$Message.error("编辑失败");
          }
        );
      });
      console.log("sdecwe");
    },
    /*
     *取消操作
     *作者：gzt
     *时间：2020-11-22 14:42:57
     */
    cancel() {
      this.show_window = false;
    },

    /*
     *获取用户
     *作者：gzt
     *时间：2020-11-22 09:21:48
     */
    get_entity() {
      var self = this;
      var query = new this.ParseServer.Query(this.ParseServer.User);
      query.get(self.user_id).then((response) => {
        Object.keys(self.user_forms).forEach((key) => {
          self.user_forms[key] = response.get(key);
        });
      });
    },

    /*
     *搜索数据
     *作者：gzt
     *时间：2020-11-21 23:30:19
     */
    search() {
      this.page = 1;
      this.page_list(this.page);
      this.page_list2();
    },

    pagechange(e) {
      this.page = e;
      this.page_list();
    },
    /*
     *分页加载数据
     *作者：gzt
     *时间：2020-11-21 23:30:27
     */
    page_list(page_index) {
      this.loading = true;

      let user1 = new this.ParseServer.Query(this.ParseServer.User);
      user1.contains("realname", this.search_keyword);
      user1.equalTo("role", "student");
      let user6 = new this.ParseServer.Query(this.ParseServer.User);
      if (this.label) {
        user6.contains("label", this.label);
        user6.equalTo("role", "student");
      }
      let user2 = new this.ParseServer.Query(this.ParseServer.User);
      user2.contains("phone", this.search_keyword);
      user2.equalTo("role", "student");
      let user3 = new this.ParseServer.Query(this.ParseServer.User);
      user3.contains("nickName", this.search_keyword);
      user3.equalTo("role", "student");
      let user4 = new this.ParseServer.Query(this.ParseServer.User);
      if (this.search_start_date) {
        user4.greaterThan("createdAt", this.search_start_date);
      }
      let user5 = new this.ParseServer.Query(this.ParseServer.User);
      if (this.search_end_date) {
        user5.lessThan("createdAt", tool.addDays(this.search_end_date, 1));
      }
      var query = this.ParseServer.Query.and(
        this.ParseServer.Query.or(user1, user2, user3),
        user4,
        user5,
        user6
      );
      query.count().then((count) => {
        this.total = count;
      });
      query.descending("createdAt");
      query.skip((this.page - 1) * 10);
      query.limit(10);
      query.find().then(
        (list) => {
          this.users_datas = [];
          if (list && list.length > 0) {
            this.users_datas = list.map((item) => {
              var account = {
                id: item.id,
                label: item.get("label"),
                nickName: item.get("nickName"),
                realname: item.get("realname"),
                phone: item.get("phone"),
                amount: item.get("amount"),
                score: item.get("score"),
                avatarUrl: item.get("avatarUrl"),
                createdAt: tool.dateFormat(
                  item.createdAt,
                  "yyyy-MM-dd HH:mm:ss"
                ),
              };
              return account;
            });
          }
          this.loading = false;
        },
        (error) => {
          this.$Message.error("用户列表获取失败");
        }
      );
    },

    async page_list2() {
      console.log("sc");
      let counts = 0;
      let user1 = new this.ParseServer.Query(this.ParseServer.User);
      user1.contains("realname", this.search_keyword);
      user1.equalTo("role", "student");
      let user6 = new this.ParseServer.Query(this.ParseServer.User);
      if (this.label) {
        user6.contains("label", this.label);
        user6.equalTo("role", "student");
      }
      let user2 = new this.ParseServer.Query(this.ParseServer.User);
      user2.contains("phone", this.search_keyword);
      user2.equalTo("role", "student");
      let user3 = new this.ParseServer.Query(this.ParseServer.User);
      user3.contains("nickName", this.search_keyword);
      user3.equalTo("role", "student");
      let user4 = new this.ParseServer.Query(this.ParseServer.User);
      if (this.search_start_date) {
        user4.greaterThan("createdAt", this.search_start_date);
      }
      let user5 = new this.ParseServer.Query(this.ParseServer.User);
      if (this.search_end_date) {
        user5.lessThan("createdAt", tool.addDays(this.search_end_date, 1));
      }
      var query = this.ParseServer.Query.and(
        this.ParseServer.Query.or(user1, user2, user3),
        user4,
        user5,
        user6
      );
      await query.count().then((count) => {
        counts = count;
      });
      query.limit(counts);
      query.descending("createdAt");
      query.find().then(
        (list) => {
          this.users_datas2 = [];
          if (list && list.length > 0) {
            this.users_datas2 = list.map((item) => {
              var account = {
                id: item.id,
                label: item.get("label"),
                nickName: item.get("nickName"),
                realname: item.get("realname"),
                phone: item.get("phone"),
                amount: item.get("amount"),
                score: item.get("score"),
                avatarUrl: item.get("avatarUrl"),
                createdAt: tool.dateFormat(
                  item.createdAt,
                  "yyyy-MM-dd HH:mm:ss"
                ),
              };
              return account;
            });
          }
          console.log(this.users_datas2);
        },
        (error) => {
          this.$Message.error("用户列表获取失败");
        }
      );
    },

    /*
     *删除用户
     *作者：gzt
     *时间：2020-11-25 23:17:56
     */
    delete(user_id) {
      this.$Modal.confirm({
        title: "删除提示",
        content: "<p>删除用户后，用户将无法使用系统，确定要删除吗？</p>",
        onOk: () => {
          var query = new this.ParseServer.Query(this.ParseServer.User);
          query.get(user_id).then(
            (response) => {
              // 删除用户
              response.destroy().then(
                (delete_result) => {
                  this.$Message.success("删除成功");
                  this.page = 1;
                  this.page_list(this.page);
                },
                (error) => {
                  this.$Message.error("删除失败");
                }
              );
            },
            (error) => {
              this.$Message.error("删除的用户不存在");
            }
          );
        },
        onCancel: () => {
          this.$Message.info("取消了操作");
        },
      });
    },

    // 全部导出
    async exports() {
      console.log(this.users_datas2);
      setTimeout(() => {
        const initColumn = [
          {
            title: "ID",
            dataIndex: "id",
            key: "id",
          },
          {
            title: "昵称",
            dataIndex: "nickName",
            key: "nickName",
          },
          {
            title: "姓名",
            dataIndex: "realname",
            key: "realname",
          },
          {
            title: "标签",
            dataIndex: "label",
            key: "label",
          },
          {
            title: "手机号",
            dataIndex: "phone",
            key: "phone",
          },
          {
            title: "注册时间",
            dataIndex: "createdAt",
            key: "createdAt",
          },
          {
            title: "消费金额",
            dataIndex: "amount",
            key: "amount",
          },

          {
            title: "积分",
            dataIndex: "score",
            key: "score",
          },
        ];
        excelUtil.exportExcel(
          initColumn,
          this.users_datas2,
          "学生管理数据记录.xlsx"
        );
      }, 3000);
    },
  },
};
</script>

<style lang="less" scoped>
.search-wrap {
  .search-keyword {
    float: left;
    width: 20%;
  }
  .select-choice {
    float: left;
    width: 40%;
    span {
      width: 20%;
      display: block;
      float: left;
      box-sizing: border-box;
      line-height: 36px;
      padding: 0 10px;
      text-align: right;
    }

    .choice {
      width: 80%;
      float: right;
    }
  }
  .search-btn {
    float: left;
    width: 10%;
    margin: 0 20px;
  }
}

.date-picker-wrap {
  float: left;
  width: 80%;
  .date-picker {
    float: left;
    width: 45%;
  }
  .label-split {
    // margin: 0 10px;
    padding: 0 10px;
    width: 10%;
    box-sizing: border-box;
    display: block;
    float: left;
    text-align: center;
  }
}
.form .myFormShow {
  min-height: 30px;
  line-height: 30px;
  display: flex;
}

.myFormShow .head {
  width: 230px;
  text-align: right;
  font-size: 14px;
  font-weight: bold;
  padding-right: 10px;
  display: inline-block;
  vertical-align: middle;
}
.myFormShow .cont {
  flex: 1;
  text-align: left;
  font-size: 14px;
  padding-left: 10px;
}
.form .myFormShow:first-child .head {
  line-height: 50px;
}
</style>
