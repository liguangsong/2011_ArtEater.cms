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
            <div class="label-split" style="height: 36px; line-height: 36px">-</div>
            <div class="date-picker" style="width: 180px">
              <DatePicker v-model="search_end_date" size="large" type="date" placeholder="请输入结束时间"></DatePicker>
            </div>
          </div>
        </div>
        <div class="select-choice clear-fix" style="width:300px">
          <span style="width:100px">会员类型</span>
          <Select
            size="large"
            v-model="search_type"
            class="choice"
            :clearable="true"
            placeholder="全部类型"
            style="width:200px"
          >
            <Option v-for="item in roles" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="search-btn">
          <Button type="primary" @click="search" size="large">查询</Button>
        </div>
        <Button type="info" @click="exports">全部导出</Button>
      </div>
    </div>
    <Row class="table-wrap">
      <Table :loading="loading" :columns="columns" :data="users_datas">
        <template slot-scope="{ row }" slot="memberType">
          <span v-if="row.memberType == '0'">黑金</span>
          <span v-if="row.memberType == '1'">铂金</span>
          <span v-if="row.memberType == '2'">白银</span>
        </template>
      </Table>
      <div class="page-wrap">
        <Page :total="total" @on-change="pagechange" v-if="total > 0" />
      </div>
    </Row>

    <Modal v-model="show_window" :title="window_title" @on-ok="cancel">
      <div class="form" :model="user_forms" label-position="right" :label-width="120">
        <div class="myFormShow">
          <div class="head">昵称</div>
          <div class="cont">{{ user_forms.nickName }}</div>
        </div>
        <div class="myFormShow">
          <div class="head">姓名</div>
          <div class="cont">{{ user_forms.realName }}</div>
        </div>
        <div class="myFormShow">
          <div class="head">手机号</div>
          <div class="cont">{{ user_forms.phone }}</div>
        </div>
        <div class="myFormShow">
          <div class="head">会员类型</div>
          <div class="cont">{{ user_forms.memberType }}</div>
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
          <div class="cont">{{ user_forms.proviceName + "-" + user_forms.cityName }}</div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { tool } from "@/api/tool";
import excelUtil from "../../utils/dealwithExcelUtil";
export default {
  name: "memberindex",
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
      roles: [
        { value: "", label: "全部类型" },
        { value: "0", label: "黑金" },
        { value: "1", label: "铂金" },
        { value: "2", label: "白银" }
      ],
      search_type: "",
      columns: [
        { title: "ID", key: "id" },
        { title: "昵称", key: "nickName" },
        { title: "姓名", key: "realName" },
        { title: "手机号", key: "phone" },
        { title: "会员类型", key: "memberType", slot: "memberType" },
        {
          title: "注册时间",
          key: "createdAt",
          sortable: true
          // render: (h, params) => {
          //   var txt = tool.dateFormat(
          //     params.row.createdAt,
          //     "yyyy-MM-dd HH:mm:ss"
          //   );
          //   return h("div", txt);
          // },
        },
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
                    type: "error",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.delete(params.row);
                    }
                  }
                },
                "删除"
              )
            ];
            return h("div", button);
          }
        }
      ],
      users_datas: [],
      users_datas2: [],
      user_forms: {
        nickName: "",
        realName: "",
        phone: "",
        memberType: "",
        speciality: "",
        university: "",
        cityName: "",
        proviceName: "",
        registration_time: ""
      }
    };
  },
  mounted() {
    this.page_list(this.page);
    this.page_list2();
  },
  methods: {
    /*
     *取消操作
     *作者：gzt
     *时间：2020-11-22 14:42:57
     */
    cancel() {
      this.show_window = false;
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

      let user1 = new this.ParseServer.Query("MemberList");
      user1.contains("realName", this.search_keyword);
      let user2 = new this.ParseServer.Query("MemberList");
      user2.contains("objectId", this.search_keyword);
      let user3 = new this.ParseServer.Query("MemberList");
      user3.contains("nickName", this.search_keyword);
      let user4 = new this.ParseServer.Query("MemberList");
      if (this.search_start_date) {
        user4.greaterThan("createdAt", this.search_start_date);
      }
      let user5 = new this.ParseServer.Query("MemberList");
      if (this.search_end_date) {
        user5.lessThan("createdAt", tool.addDays(this.search_end_date, 1));
      }
      let user6 = new this.ParseServer.Query("MemberList");
      if (this.search_type) {
        user6.equalTo("memberType", this.search_type);
      }
      var query = this.ParseServer.Query.and(
        this.ParseServer.Query.or(user1, user2, user3),
        user4,
        user5,
        user6
      );
      query.count().then(count => {
        this.total = count;
      });
      query.descending("createdAt");
      query.skip((this.page - 1) * 10);
      query.limit(10);
      query.find().then(
        list => {
          this.users_datas = [];
          if (list && list.length > 0) {
            this.users_datas = list.map(item => {
              var account = {
                id: item.id,
                openId: item.get("openId"),
                nickName: item.get("nickName"),
                realName: item.get("realName"),
                phone: item.get("phone"),
                memberType: item.get("memberType"),
                createdAt: tool.dateFormat(
                  item.createdAt,
                  "yyyy-MM-dd HH:mm:ss"
                )
              };
              return account;
            });
          }
          this.loading = false;
        },
        error => {
          this.$Message.error("用户列表获取失败");
        }
      );
    },

    async page_list2() {
      let counts = 0;
      let user1 = new this.ParseServer.Query("MemberList");
      user1.contains("realName", this.search_keyword);
      let user2 = new this.ParseServer.Query("MemberList");
      user2.contains("objectId", this.search_keyword);
      let user3 = new this.ParseServer.Query("MemberList");
      user3.contains("nickName", this.search_keyword);
      let user4 = new this.ParseServer.Query("MemberList");
      if (this.search_start_date) {
        user4.greaterThan("createdAt", this.search_start_date);
      }
      let user5 = new this.ParseServer.Query("MemberList");
      if (this.search_end_date) {
        user5.lessThan("createdAt", tool.addDays(this.search_end_date, 1));
      }
      let user6 = new this.ParseServer.Query("MemberList");
      if (this.search_type) {
        user6.equalTo("memberType", this.search_type);
      }
      var query = this.ParseServer.Query.and(
        this.ParseServer.Query.or(user1, user2, user3),
        user4,
        user5,
        user6
      );
      await query.count().then(count => {
        counts = count;
      });
      query.limit(counts);
      query.descending("createdAt");
      query.find().then(
        list => {
          this.users_datas2 = [];
          if (list && list.length > 0) {
            this.users_datas2 = list.map(item => {
              var account = {
                id: item.id,
                nickName: item.get("nickName"),
                realName: item.get("realName"),
                phone: item.get("phone"),
                memberType: item.get("memberType"),
                createdAt: tool.dateFormat(
                  item.createdAt,
                  "yyyy-MM-dd HH:mm:ss"
                )
              };
              return account;
            });
          }
        },
        error => {
          this.$Message.error("用户列表获取失败");
        }
      );
    },

    /*
     *删除用户
     *作者：gzt
     *时间：2020-11-25 23:17:56
     */
    delete(rowDate) {
      let user_id = rowDate.id;
      let openId = rowDate.openId;
      this.$Modal.confirm({
        title: "删除提示",
        content: "<p>删除用户后，用户将取消会员身份，确定要删除吗？</p>",
        onOk: () => {
          var query = new this.ParseServer.Query("MemberList");
          query.get(user_id).then(
            response => {
              // 删除用户
              response.destroy().then(
                delete_result => {
                  // 刪除成功后，user表里相应的id memberType改为空
                  this.removeMember(openId);
                },
                error => {
                  this.$Message.error("删除失败");
                }
              );
            },
            error => {
              this.$Message.error("删除的用户不存在");
            }
          );
        },
        onCancel: () => {
          this.$Message.info("取消了操作");
        }
      });
    },
    removeMember(openId) {
      var query = new this.ParseServer.Query(this.ParseServer.User);
      query.equalTo("openid", openId);
      query.find().then(items => {
        let item = items[0];
        item.set("memberType", -1);
        item.save().then(
          item => {
            this.$Message.success("删除成功");
            this.page = 1;
            this.page_list(this.page);
          },
          error => {
            this.$Message.error("修改失败");
          }
        );
      });
    },

    // 全部导出
    async exports() {
      var format_data = this.users_datas2;
      format_data.forEach(item => {
        item.memberType =
          item.memberType == "0"
            ? "黑金"
            : item.memberType == "0"
            ? "铂金"
            : "白银";
      });
      setTimeout(() => {
        const initColumn = [
          {
            title: "ID",
            dataIndex: "id",
            key: "id"
          },
          {
            title: "昵称",
            dataIndex: "nickName",
            key: "nickName"
          },
          {
            title: "姓名",
            dataIndex: "realName",
            key: "realName"
          },
          {
            title: "手机号",
            dataIndex: "phone",
            key: "phone"
          },
          {
            title: "会员类型",
            dataIndex: "memberType",
            key: "memberType"
          },
          {
            title: "注册时间",
            dataIndex: "createdAt",
            key: "createdAt"
          }
        ];
        excelUtil.exportExcel(initColumn, format_data, "学生管理数据记录.xlsx");
      }, 3000);
    }
  }
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
.search-wrap .search-btn {
  width: unset;
}
</style>
