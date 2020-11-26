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
                placeholder="ID 姓名 手机号关键字搜索"
              />
            </div>
            <div class="select-choice clear-fix">
              <span>身份</span>
              <Select
                size="large"
                v-model="search_role"
                class="choice"
                placeholder="请选择身份"
              >
                <Option
                  v-for="item in roles"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
            </div>
            <div class="search-btn">
              <Button type="primary" @click="search" size="large">查询</Button>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <div class="operation-wrap">
          <Button type="success" @click="show_window = true"
            >新增后台账号</Button
          >
        </div>
      </Row>
    </div>

    <Row class="table-wrap">
      <Table :loading="loading" :columns="columns" :data="users_datas"> </Table>
      <div class="page-wrap">
        <Page :total="total" @on-change="page_list" v-if="total != 0" />
      </div>
    </Row>
    <Modal
      v-model="show_window"
      :title="window_title"
      :mask-closable="close"
      @on-ok="add_user"
      @on-cancel="cancel"
    >
      <Form
        :model="user_forms"
        label-position="right"
        :label-width="60"
        ref="form"
        :rules="ruleValidate"
      >
        <FormItem label="姓名" prop="realname">
          <Input v-model="user_forms.realname" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="手机号" prop="phone">
          <Input v-model="user_forms.phone" placeholder="请输入手机号"></Input>
        </FormItem>
        <FormItem label="身份" prop="role">
          <Select v-model="user_forms.role" placeholder="请选择身份">
            <Option
              v-for="item in roles"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { verification } from "@/api/verification";
export default {
  name: "usermanageindex",
  data() {
    return {
      close: false,
      roles: [
        {
          value: "请选择身份",
          label: "请选择身份"
        },
        {
          value: "老师",
          label: "老师"
        },
        {
          value: "管理",
          label: "管理"
        }
      ],
      page: 1,
      total: 0,
      loading: true,
      user_id: "",
      window_title: "新增用户",
      see: false,
      show_window: false,
      search_keyword: "",
      search_role: "",
      columns: [
        {
          title: "姓名",
          key: "realname"
        },
        {
          title: "手机号",
          key: "phone"
        },
        {
          title: "身份",
          key: "role"
        },
        {
          title: "注册时间",
          key: "registration_time"
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
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.user_id = params.row.id;
                      this.get_entity();
                      this.show_window = true;
                      this.window_title = "后台账号信息";
                    }
                  }
                },
                "编辑"
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
        realname: "",
        phone: "",
        role: "请选择身份"
      },
      ruleValidate: {
        realname: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
            validator: verification.validateIsNull
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
            validator: verification.validateIsNull
          },
          {
            required: true,
            message: "请输入正确的手机号",
            trigger: "blur",
            validator: verification.validatePhone
          }
        ],
        role: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (value == "请选择身份") {
                callback(new Error("请选择身份"));
              } else {
                callback();
              }
            }
          },
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value == "请选择身份") {
                callback(new Error("请选择身份"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      init_data: ""
    };
  },
  mounted() {
    this.init_data = JSON.stringify(this.user_forms);
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
      this.$refs["form"].resetFields();
      this.see = false;
      this.window_title = "新增用户";
      this.user_forms = JSON.parse(this.init_data);
    },

    /*
     *新增用户
     *作者：gzt
     *时间：2020-11-22 14:50:34
     */
    add_user() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          var Accounts = this.ParseServer.Object.extend("UserInfo");
          var account = new Accounts();
          if (this.user_id) {
            account.set("id", this.user_id);
          }
          account.set("realname", this.user_forms.realname);
          account.set("phone", this.user_forms.phone);
          account.set("role", this.user_forms.role);
          account.save().then(
            account => {
              this.$Message.success("保存成功");
              this.user_forms = JSON.parse(this.init_data);
              this.$refs["form"].resetFields();
              this.page_list(this.page);
            },
            error => {
              this.$Message.error("保存失败");
            }
          );
        } else {
          this.$Message.error("请检查数据的正确性");
        }
      });
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
                realname: item.get("realname"),
                phone: item.get("phone"),
                role: item.get("role")
              };
              return account;
            });
          }
          this.loading = false;
        },
        error => {
          console.log(error);
          this.$Message.error("保存失败");
        }
      );
    },

    /*
     * 删除用户
     *作者：gzt
     *时间：2020-11-22 08:41:53
     */
    delete(subject_id) {
      let _this = this;
      this.$Modal.confirm({
        title: "删除提示",
        content: "<p>删除用户后，用户将无法使用系统，确定要删除吗？</p>",
        onOk: () => {
          var query = new this.ParseServer.Query("UserInfo");
          query.get(subject_id).then(
            response => {
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
              this.$Message.error("清确保删除的数据真实存在");
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
    width: 40%;
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
    .choice {
      width: 80%;
      float: right;
    }
  }
  .search-btn {
    float: left;
    width: 20%;
    margin: 0 20px;
    button {
      width: 70%;
    }
  }
}
</style>
