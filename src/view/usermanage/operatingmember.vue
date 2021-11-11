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

        <div class="operation-wrap">
          <Button class="func" type="primary" @click="handleShowAddForm"
            >新增</Button
          >
        </div>
      </div>
    </div>
    <Row class="table-wrap">
      <Table :loading="loading" :columns="columns2" :data="users_datas2">
        <template slot-scope="{ row }" slot="action">
          <Button
            type="error"
            size="small"
            style="margin-right: 5px"
            @click="deletes(row.id)"
            >删除</Button
          >
        </template>
      </Table>
      <div class="page-wrap">
        <Page :total="total" @on-change="pagechange" v-if="total > 0" />
      </div>
    </Row>

    <Modal
      width="750"
      v-model="show_window"
      :title="window_title"
      :loading="modalLoading"
      @on-ok="add_MemberList"
    >
      <div class="header-wrap">
        <div class="search-wrap clear-fix">
          <div class="search-keyword" style="width: 200px">
            <Input
              v-model="search_keywords"
              size="large"
              style="width: 200px"
              placeholder="请输入/昵称/手机号搜索"
            />
          </div>
          <div class="search-btn">
            <Button type="primary" @click="searchs" size="large">查询</Button>
          </div>
        </div>
      </div>
      <Table
        :loading="loading"
        :columns="columns"
        :data="users_datas"
        style="margin-top: 10px"
      >
        <template slot-scope="{ row }" slot="check">
          <div>
            <span>
              <input type="checkbox" v-model="addMember" :value="row" />
            </span>
          </div>
        </template>
      </Table>
      <div class="page-wrap" style="margin-top: 10px">
        <Page :total="totals" @on-change="pagechanges" v-if="totals > 0" />
      </div>
    </Modal>
  </div>
</template>

<script>
import { tool } from "@/api/tool";
export default {
  name: "studentindex",
  data() {
    return {
      page: 1,
      pages: 1,
      total: 0,
      totals: 0,
      modalLoading: true,
      loading: true,
      users_datas2: [],
      user_id: "",
      window_title: "用户信息",
      show_window: false,
      search_keyword: "",
      search_keywords: "",
      search_start_date: "",
      search_end_date: "",
      columns2: [
        { title: "ID", key: "id" },
        { title: "昵称", key: "nickName" },
        { title: "姓名", key: "realName" },
        { title: "手机号", key: "phone" },
        {
          title: "会员截止时间",
          key: "endTime",
        },

        {
          title: "操作",
          key: "action",
          align: "center",
          slot: "action",
        },
      ],

      columns: [
        { title: "ID", key: "id" },
        { title: "昵称", key: "nickName" },
        { title: "手机号", key: "phone" },
        {
          title: "注册时间",
          key: "createdAt",
        },

        {
          title: "操作",
          key: "action",
          align: "center",
          slot: "check",
        },
      ],
      addMember: [],
      users_datas: [],
      user_forms: {
        nickName: "",
        realName: "",
        phone: "",
      },
    };
  },
  mounted() {
    this.page_list(this.page);
  },
  methods: {
    users() {
      let user1 = new this.ParseServer.Query(this.ParseServer.User);
      user1.equalTo("role", "student");
      let user2 = new this.ParseServer.Query(this.ParseServer.User);
      let user3 = new this.ParseServer.Query(this.ParseServer.User);
      if (this.search_keywords) {
        user2.contains("nickName", this.search_keywords);
        user3.contains("phone", this.search_keywords);
      }
      var query = this.ParseServer.Query.and(
        this.ParseServer.Query.or(user2, user3),
        user1
      );
      query.count().then((count) => {
        this.totals = count;
      });
      query.descending("createdAt");
      query.skip((this.pages - 1) * 10);
      query.limit(10);

      query.find().then(
        (list) => {
          this.users_datas = [];
          if (list && list.length > 0) {
            this.users_datas = list.map((item) => {
              var account = {
                id: item.id,
                nickName: item.get("nickName"),
                realName: item.get("realname"),
                phone: item.get("phone"),
                openId: item.get("openid"),
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

    handleShowAddForm() {
      this.addMember = [];
      this.users();
      this.show_window = true;
    },

    //新增会员
    add_MemberList() {
      let openId = "";
      if (this.addMember == "") {
        this.$Message.error("请选择要添加的会员");
        this.modalLoading = false;
        setTimeout(() => {
          this.modalLoading = true;
        }, 100);
        return false;
      } else {
        let newDates = Date.now() + 1000 * 60 * 60 * 24 * 366;

        for (const key in this.addMember) {
          let openId = this.addMember[key].openId;

          var query = new this.ParseServer.Query("MemberList");
          query.equalTo("openId", openId);
          query.limit(10000);
          query.find().then((response) => {
            if (response && response.length > 0) {
              response.forEach((data) => {
                data.set("memberType", "0");
                data.set("endTime", newDates);
                data.set("phone", this.addMember[key].phone);
                data.set("nickName", this.addMember[key].nickName);
                data.set("realName", this.addMember[key].realName);
                data.save().then(
                  () => {
                    this.page_list();

                    this.modalLoading = false;
                    this.show_window = false;
                    this.$Message.success("修改成功");
                  },
                  (error) => {
                    this.$Message.error("修改失败");
                  }
                );
              });
            } else {
              var members = this.ParseServer.Object.extend("MemberList");
              var member = new members();
              member.set("memberType", "0");
              member.set("endTime", newDates);
              member.set("openId", this.addMember[key].openId);
              member.set("phone", this.addMember[key].phone);
              member.set("nickName", this.addMember[key].nickName);
              member.set("realName", this.addMember[key].realName);
              member.save().then(
                (member) => {
                  this.modalLoading = false;
                  this.show_window = false;
                  this.$Message.success("保存成功");
                  this.page_list();
                },
                (error) => {
                  this.$Message.error("保存失败");
                }
              );
            }
          });
        }
      }
    },

    get_entity() {
      var self = this;
      var query = new this.ParseServer.Query(this.ParseServer.User);
      query.get(self.user_id).then((response) => {
        Object.keys(self.user_forms).forEach((key) => {
          self.user_forms[key] = response.get(key);
        });
      });
    },

    search() {
      this.page = 1;
      this.page_list(this.page);
    },

    searchs() {
      this.page = 1;
      this.users(this.page);
    },

    pagechange(e) {
      this.page = e;
      this.page_list();
    },

    pagechanges(e) {
      this.pages = e;
      this.users();
    },

    page_list(page_index) {
      this.loading = true;
      let user1 = new this.ParseServer.Query("MemberList");
      let user2 = new this.ParseServer.Query("MemberList");
      let user3 = new this.ParseServer.Query("MemberList");
      let user6 = new this.ParseServer.Query("MemberList");
      if (this.search_keyword) {
        user1.contains("realName", this.search_keyword);
        user2.contains("nickName", this.search_keyword);
        user3.contains("objectId", this.search_keyword);
      }
      user6.notEqualTo("phone", "");
      let user4 = new this.ParseServer.Query("MemberList");
      if (this.search_start_date) {
        user4.greaterThan("createdAt", this.search_start_date);
      }
      let user5 = new this.ParseServer.Query("MemberList");
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
          this.users_datas2 = [];
          if (list && list.length > 0) {
            this.users_datas2 = list.map((item) => {
              console.log(item);
              var account = {
                id: item.id,
                nickName: item.get("nickName"),
                realName: item.get("realName"),
                phone: item.get("phone"),
                openId: item.get("openid"),
                endTime: new Date(item.get("endTime"))
                  .toLocaleDateString()
                  .split("/")
                  .join("-"),
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

    deletes(user_id) {
      this.$Modal.confirm({
        title: "删除提示",
        content: "<p>删除用户后,用户将不存在，确定要删除吗？</p>",
        onOk: () => {
          var query = new this.ParseServer.Query("MemberList");
          query.get(user_id).then((response) => {
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
          });
        },
        onCancel: () => {
          this.$Message.info("取消了操作");
        },
      });
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
