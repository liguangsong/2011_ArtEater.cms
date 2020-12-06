<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix">
      <div class="search-wrap clear-fix">
        <div class="search-keyword" style="width:300px">
          <Input v-model="search_keyword" size="large" placeholder="请输入ID/主题" style="width:300px" />
        </div>
        <div class="search-btn">
          <Button type="primary" @click="search" size="large">查询</Button>
        </div>
      </div>

      <div class="operation-wrap clear-fix">
        <Button class="func" type="success" @click="show_window = true">发布消息</Button>
      </div>
    </div>
    <Row class="table-wrap">
      <Table :loading="loading" :columns="columns" :data="message_datas"></Table>
      <div class="page-wrap">
        <Page :total="total" @on-change="page_list" v-if="total != 0" />
      </div>
    </Row>
    <Modal
      v-model="show_window"
      :title="window_title"
      :mask-closable="close"
      @on-ok="add_message"
      @on-cancel="cancel"
    >
      <Form
        :model="message_form"
        label-position="right"
        :label-width="60"
        ref="form"
        :rules="ruleValidate"
      >
        <FormItem label="主题" prop="title">
          <Input v-model="message_form.title" placeholder="请输入主题"></Input>
        </FormItem>
        <FormItem label="内容" prop="content">
          <Input type="textarea" :rows="4" v-model="message_form.content" placeholder="请输入内容"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { tool } from '@/api/tool'
import { verification } from "@/api/verification";
export default {
  name: "messageindex",
  data () {
    return {
      close: false,
      page: 1,
      total: 0,
      loading: true,
      message_id: "",
      window_title: "发布消息",
      show_window: false,
      search_keyword: "",
      columns: [
        { title: "ID",key: "id" },
        { title: "时间",key: "createdAt",
          render:(h, params)=>{
            var txt = tool.dateFormat(params.row.createdAt, 'yyyy-MM-dd HH:mm:ss')
            return h('div', txt)
          } 
        },
        {
          title: "主题",
          key: "title"
        },
        {
          title: "内容",
          key: "content"
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
                      this.message_id = params.row.id;
                      this.get_entity();
                      this.show_window = true;
                      this.window_title = "编辑消息";
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
      message_datas: [],
      message_form: {
        title: "",
        content: ""
      },
      ruleValidate: {
        title: [
          {
            required: true,
            message: "请输入主题",
            trigger: "blur",
            validator: verification.validateIsNull
          }
        ],
        content: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur",
            validator: verification.validateIsNull
          }
        ]
      },
      init_data: ""
    };
  },
  mounted () {
    this.init_data = JSON.stringify(this.message_form);
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
      this.window_title = "法布消息";
      this.message_form = JSON.parse(this.init_data);
    },

    /*
     *发布消息
     *作者：gzt
     *时间：2020-11-22 14:50:34
     */
    add_message () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          var Messages = this.ParseServer.Object.extend("Message");
          var message = new Messages();
          if (this.message_id) {
            message.set("id", this.message_id);
          }
          message.set("title", this.message_form.title);
          message.set("content", this.message_form.content);
          debugger
          message.save().then(
            response => {
              debugger
              this.$Message.success("保存成功");
              this.cancel();
              this.page_list(this.page);
            },
            error => {
              debugger
              this.$Message.error("保存失败");
            }
          );
        } else {
          this.$Message.error("请检查数据的正确性");
        }
      });
    },

    /*
     *获取消息
     *作者：gzt
     *时间：2020-11-22 09:21:48
     */
    get_entity () {
      var query = new this.ParseServer.Query("Message");
      query.get(this.message_id).then(response => {
        Object.keys(this.message_form).forEach(key => {
          this.message_form[key] = response.get(key);
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

      let query1 = new this.ParseServer.Query("Message");
      query1.contains('objectId', this.search_keyword)
      let query2 = new this.ParseServer.Query("Message");
      query2.contains('title', this.search_keyword)
      var query = this.ParseServer.Query.or(query1, query2);
      query.descending("createdAt");
      query.count().then(count => {
        this.total = count;
      });
      query.skip((this.page - 1) * 10);
      query.limit(10);

      query.find().then(
        list => {
          this.message_datas = [];
          if (list && list.length > 0) {
            this.message_datas = list.map(item => {
              var message = {
                id: item.id,
                title: item.get("title"),
                content: item.get("content"),
                createdAt: item.get("createdAt")
              };
              return message;
            });
          }
          this.loading = false;
        },
        error => {
          console.log(error);
          this.$Message.error("获取失败");
        }
      );
    },

    /*
     * 删除消息
     *作者：gzt
     *时间：2020-11-22 08:41:53
     */
    delete (subject_id) {
      let _this = this;
      this.$Modal.confirm({
        title: "删除提示",
        content: "<p>删除消息后将无法恢复，确定要删除吗？</p>",
        onOk: () => {
          var query = new this.ParseServer.Query("Message");
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
  width: 60%;
  .search-keyword {
    float: left;
    width: 35%;
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
    width: 18%;
    margin: 0 20px;
  }
}
.operation-wrap {
  float: right;
  width: 40%;
  .func {
    float: right;
    margin-left: 10px;
  }
}
</style>
