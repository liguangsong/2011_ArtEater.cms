<template>
  <div class="container-wrap">
    <div class="header-wrap">
      <Row>
        <Col span="20">
          <div class="search-wrap clear-fix">
            <div class="search-keyword">
              <Input
                v-model="search_keyword"
                size="large"
                placeholder="ID 昵称 姓名和关键字查询"
              />
            </div>
            <div class="select-choice clear-fix">
              <span>注册时间</span>
              <DatePicker
                :value="search_start_date"
                type="date"
                placeholder="请输入开始时间"
                style="width: 200px"
              ></DatePicker>
              <label class="label-split">~</label>
              <DatePicker
                :value="search_end_date"
                type="date"
                placeholder="请输入结束时间"
                style="width: 200px"
              ></DatePicker>
            </div>
            <div class="search-btn">
              <Button type="primary" @click="search" size="large">查询</Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <Row class="table-wrap">
      <Table :loading="loading" :columns="columns" :data="users_datas"> </Table>
      <div class="page-wrap">
        <Page :total="total" @on-change="page_list" v-if="total != 0" />
      </div>
    </Row>
    <Modal v-model="show_window" :title="window_title" @on-ok="cancel">
      <Form :model="user_forms" label-position="right" :label-width="80">
        <FormItem label="头像">
          <Avatar
            icon="ios-person"
            size="large"
            v-if="user_forms.avatarUrl != ''"
          />
          <Avatar v-else :src="user_forms.avatarUrl" size="large" />
        </FormItem>
        <FormItem label="昵称">
          <div>{{ user_forms.nickName }}</div>
        </FormItem>
        <FormItem label="姓名">
          <div>{{ user_forms.realname }}</div>
        </FormItem>
        <FormItem label="手机号">
          <div>{{ user_forms.phone }}</div>
        </FormItem>
        <FormItem label="报考专业">
          <div>{{ user_forms.speciality }}</div>
        </FormItem>
        <FormItem label="目标院校">
          <div>{{ user_forms.university }}</div>
        </FormItem>
        <FormItem label="所在地区">
          <div>{{ user_forms.proviceName }}</div>
        </FormItem>
        <FormItem label="消费金额(元)">
          <div>{{ user_forms.amount }}</div>
        </FormItem>
        <FormItem label="积分">
          <div>{{ user_forms.score }}</div>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "studentindex",
  data() {
    return {
      page: 1,
      total: 0,
      loading: true,
      user_id: "",
      window_title: "用户信息",
      show_window: false,
      search_keyword: "",
      search_start_date: "",
      search_end_date: "",
      columns: [
        {
          title: "昵称",
          key: "nickName"
        },
        {
          title: "姓名",
          key: "realname"
        },
        {
          title: "手机号",
          key: "phone"
        },
        {
          title: "注册时间",
          key: "registration_time"
        },
        {
          title: "消费金额",
          key: "amount"
        },
        {
          title: "积分",
          key: "score"
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
                    type: "info",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.user_id = params.row.id;
                      this.show_window = true;
                      this.get_entity();
                    }
                  }
                },
                "用户信息"
              ),
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
                      this.delete(params.row.id);
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
      user_forms: {
        nickName: "",
        realname: "",
        phone: "",
        amount: "",
        score: "",
        avatarUrl: "",
        speciality: "",
        university: "",
        proviceName: "",
        registration_time: ""
      }
    };
  },
  mounted() {
    this.page_list(this.page);
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
     *获取用户
     *作者：gzt
     *时间：2020-11-22 09:21:48
     */
    get_entity() {
      var query = new this.ParseServer.Query("UserInfo");
      query.get(this.user_id).then(response => {
        Object.keys(this.user_forms).forEach(key => {
          this.user_forms[key] = response.get(key);
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
    },
    /*
     *分页加载数据
     *作者：gzt
     *时间：2020-11-21 23:30:27
     */
    page_list(page_index) {
      this.loading = true;
      let query = new this.ParseServer.Query("UserInfo");
      query.descending("createdAt");
      if (this.search_keyword) {
        query.startWith("realname", this.search_keyword);
      }
      query.count().then(count => {
        this.total = count;
      });
      query.skip((this.page - 1) * 10);
      query.limit(10);

      query.find().then(
        list => {
          this.users_datas = [];
          if (list && list.length > 0) {
            this.users_datas = list.map(item => {
              var account = {
                id: item.id,
                nickName: item.get("nickName"),
                realname: item.get("realname"),
                phone: item.get("phone"),
                amount: item.get("amount"),
                score: item.get("score"),
                registration_time: item.get("registration_time")
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
          var query = new this.ParseServer.Query("UserInfo");
          query.get(user_id).then(
            response => {
              // 删除用户
              response.destroy().then(
                delete_result => {
                  this.$Message.success("删除成功");
                  this.page_list(this.page);
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
    width: 35%;
    span {
      width: 20%;
      display: inline-block;
      box-sizing: border-box;
      line-height: 36px;
      padding: 0 10px;
      text-align: right;
    }
    .label-split {
      margin: 0 10px;
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
</style>
