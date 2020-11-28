<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix">
      <div class="search-wrap clear-fix">
        <div class="search-keyword">
          <span>名称</span>
          <Input
            class="keyword-input"
            v-model="search_keyword"
            size="large"
            placeholder="请输入科目名称"
          />
        </div>
        <div class="search-keyword">
          <span>组卷名称</span>
          <Input
            class="keyword-input"
            v-model="search_keyword"
            size="large"
            placeholder="请输入组卷名称"
          />
        </div>
        <div class="search-btn">
          <Button type="primary" @click="search" size="large">查询</Button>
        </div>
      </div>
      <div class="operation-wrap">
        <Button class="func" type="success" @click="show_window = true"
          >新增组卷</Button
        >
      </div>
    </div>
    <Row class="table-wrap">
      <Table :loading="loading" :columns="columns" :data="exam_datas"></Table>
      <div class="page-wrap">
        <Page :total="total" @on-change="page_list" v-if="total != 0" />
      </div>
    </Row>
    <ExalForm
      :windows="show_window"
      @change-window="change_window"
      @preview="preview_window"
    ></ExalForm>
    <PreviewForm
      :windows="preview_form"
      :examid="paper_id"
      @change-window="close_preview"
    >
    </PreviewForm>
  </div>
</template>

<script>
import { verification } from "@/api/verification";
import ExalForm from "./components/examform";
import PreviewForm from "./components/previewform";
export default {
  name: "exampaperindex",
  data() {
    return {
      page: 1,
      total: 0,
      loading: true,
      paper_id: "",
      show_window: false,
      preview_form: false,
      search_keyword: "",
      search_role: "",
      columns: [
        {
          title: "科目名称",
          key: "subjects"
        },
        {
          title: "组卷名称",
          key: "test_paper_name"
        },
        {
          title: "满分",
          key: "score"
        },
        {
          title: "及格分",
          key: "pass_score"
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
      init_data: ""
    };
  },
  components: {
    ExalForm,
    PreviewForm
  },
  mounted() {
    this.init_data = JSON.stringify(this.exam_forms);
    // this.page_list(this.page);
  },
  methods: {
    close_preview(value) {
      this.preview_form = value;
    },
    change_window(value) {
      this.show_window = value;
    },
    preview_window(value) {
      console.log(value);
      this.show_window = false;
      this.preview_form = value;
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
      let query = new this.ParseServer.Query("ExamPaper");
      query.descending("createdAt");
      if (this.search_keyword) {
        query.startWith("test_paper_name", this.search_keyword);
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
              var exam = {
                id: item.id,
                subjects: item.get("subjects"),
                test_paper_name: item.get("test_paper_name"),
                score: item.get("score"),
                pass_score: item.get("pass_score")
              };
              return exam;
            });
          }
          this.loading = false;
        },
        error => {
          this.$Message.error("获取失败");
        }
      );
    },

    /*
     * 删除试卷
     *作者：gzt
     *时间：2020-11-22 08:41:53
     */
    delete(exam_id) {
      this.$Modal.confirm({
        title: "删除提示",
        content: "<p>确定要删除该套试卷吗？</p>",
        onOk: () => {
          var query = new this.ParseServer.Query("ExamPaper");
          query.get(exam_id).then(
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

.save {
  margin: 0 auto;
}
</style>
