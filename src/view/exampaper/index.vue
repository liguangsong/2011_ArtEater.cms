<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix">
      <div class="search-wrap clear-fix">
        <div class="search-keyword">
          <span>名称</span>
          <Input class="keyword-input" v-model="search_keyword" size="large" placeholder="请输入科目名称" />
        </div>
        <div class="search-keyword">
          <span>组卷名称</span>
          <Input class="keyword-input" v-model="search_keyword" size="large" placeholder="请输入组卷名称" />
        </div>
        <div class="search-btn">
          <Button type="primary" @click="search" size="large">查询</Button>
        </div>
      </div>
      <div class="operation-wrap">
        <Button class="func" type="success" @click="show_window = true">新增组卷</Button>
      </div>
    </div>
    <Row class="table-wrap">
      <Table :loading="loading" :columns="columns" :data="exam_datas"></Table>
      <div class="page-wrap">
        <Page :total="total" @on-change="page_list" v-if="total != 0" />
      </div>
    </Row>
    <Modal
      v-model="show_window"
      :title="window_title"
      :mask-closable="close"
      width="700px"
      @on-ok="add_user"
      @on-cancel="cancel"
    >
      <Form
        :model="exam_forms"
        label-position="right"
        :label-width="80"
        ref="form"
        :rules="ruleValidate"
      >
        <FormItem label="试卷名称" prop="test_paper_name">
          <Input v-model="exam_forms.test_paper_name" placeholder="请输入试卷名称"></Input>
        </FormItem>

        <FormItem label="考试时间" prop="time_count">
          <Input v-model="exam_forms.time_count" placeholder="请输入考试时长">
            <span slot="append">分钟</span>
          </Input>
        </FormItem>
        <FormItem label="科目" prop="subjects">
          <Select v-model="exam_forms.subjects" placeholder="请选择科目">
            <Option v-for="item in ranges" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="选择范围" prop="range">
          <Select v-model="exam_forms.range" placeholder="请选择范围">
            <Option v-for="item in ranges" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="出题方式" prop="range">
          <Select v-model="exam_forms.range" placeholder="请选择范围">
            <Option v-for="item in ranges" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="及格分数" prop="time_count">
          <Input v-model="exam_forms.time_count" placeholder="请输入及格分数"></Input>
        </FormItem>
        <div class="options-wrap">
          <p class="title">题目</p>
          <div class="options clear-fix" v-for="(item,index) in exam_forms.options" :key="index">
            <div class="question-label">
              <span>选择类型</span>
              <span>{{item.type}}</span>
            </div>
            <div class="question-info">
              <span>题数</span>
              <Input class="input" v-model="item.number" placeholder="请输入题目数量"></Input>
            </div>
            <div class="question-info">
              <span>每题分数</span>
              <Input class="input" v-model="item.score" placeholder="请输入分值"></Input>
            </div>
          </div>
          <div style="font-size:18px;margin-top:20px;">满分:{{exam_forms.score}}</div>
        </div>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { verification } from "@/api/verification";
export default {
  name: "exampaperindex",
  data () {
    return {
      close: false,
      ranges: [
        {
          value: "请选择范围",
          label: "请选择范围"
        },
        {
          value: "普通试题",
          label: "普通试题"
        },
        {
          value: "重点试题",
          label: "重点试题"
        }
      ],
      page: 1,
      total: 0,
      loading: true,
      paper_id: "",
      window_title: "添加组卷",
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
                      this.paper_id = params.row.id;
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
      exam_datas: [],
      exam_forms: {
        test_paper_name: "",
        phone: "",
        role: "请选择身份",
        options: [
          {
            type: "单选",
            number: 0,
            score: 0
          },
          {
            type: "多选",
            number: 0,
            score: 0
          },
          {
            type: "填空",
            number: 0,
            score: 0
          }
        ],
        score: 0
      },
      ruleValidate: {
        test_paper_name: [
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
  mounted () {
    this.init_data = JSON.stringify(this.exam_forms);
    this.page_list(this.page);
  },
  methods: {
    /*
     *取消操作
     *作者：gzt
     *时间：2020-11-22 14:42:57
     */
    cancel () {
      this.show_window = false;
      this.$refs["form"].resetFields();
      this.see = false;
      this.window_title = "新增用户";
      this.exam_forms = JSON.parse(this.init_data);
    },

    /*
     *新增用户
     *作者：gzt
     *时间：2020-11-22 14:50:34
     */
    add_user () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          var Accounts = this.ParseServer.Object.extend("UserInfo");
          var account = new Accounts();
          if (this.paper_id) {
            account.set("id", this.paper_id);
          }
          account.set("realname", this.exam_forms.realname);
          account.set("phone", this.exam_forms.phone);
          account.set("role", this.exam_forms.role);
          account.save().then(
            account => {
              this.$Message.success("保存成功");
              this.cancel()
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
    get_entity () {
      var query = new this.ParseServer.Query("UserInfo");
      query.get(this.paper_id).then(response => {
        Object.keys(this.exam_forms).forEach(key => {
          this.exam_forms[key] = response.get(key);
        });
      });
    },

    /*
     *搜索数据
     *作者：gzt
     *时间：2020-11-21 23:30:19
     */
    search () {
      this.page = 1;
      this.page_list(this.page);
    },
    /*
     *分页加载数据
     *作者：gzt
     *时间：2020-11-21 23:30:27
     */
    page_list (page_index) {
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
          this.exam_datas = [];
          if (list && list.length > 0) {
            this.exam_datas = list.map(item => {
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
    delete (subject_id) {
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
  float: left;
  width: 75%;
  .search-keyword {
    float: left;
    width: 40%;
    span {
      width: 65px;
      text-align: right;
      padding-right: 10px;
      box-sizing: border-box;
    }
    .keyword-input {
      width: 85%;
    }
  }
  .search-btn {
    float: left;
    margin: 0 15px;
  }
}

.operation-wrap {
  width: 25%;
  float: left;
  .func {
    float: right;
    margin-left: 10px;
  }
}

.options-wrap {
  .title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 20px;
  }
  .options {
    span {
      margin-right: 10px;
      line-height: 36px;
      font-weight: 500;
    }
    .question-label {
      width: 22%;
      float: left;
    }
    .question-info {
      width: 36%;
      float: left;

      .input {
        width: 72%;
      }
    }
  }
}
</style>
