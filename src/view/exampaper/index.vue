<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix">
      <div class="search-wrap clear-fix">
        <div class="search-keyword" style="width:250px">
          <span>名称</span>
          <Input class="keyword-input" v-model="search_subject_name" size="large" placeholder="请输入科目名称"  style="width:200px"/>
        </div>
        <div class="search-keyword" style="width:280px">
          <span>组卷名称</span>
          <Input class="keyword-input" v-model="search_paper_name" size="large" placeholder="请输入组卷名称" style="width:200px" />
        </div>
        <div class="search-btn">
          <Button type="primary" @click="search" size="large">查询</Button>
        </div>
      </div>
      <div class="operation-wrap">
        <Button class="func" type="primary" @click="show_window = true">新增组卷</Button>
      </div>
    </div>
    <Row class="table-wrap">
      <Table :loading="loading" :columns="columns" :data="exam_datas">
        <template slot-scope="{ row }" slot="subjects">
          <strong v-for="(_sub, _idx) in row.subjects">{{
            getSubjectName(_sub) + (_idx == row.subjects.length - 1 ? "" : "；")
          }}</strong>
        </template>
      </Table>
      <div class="page-wrap">
        <Page :total="total" @on-change="pagechange"  v-if="total!=0" />
      </div>
    </Row>
    <ExalForm
      :windows="show_window"
      :examid="paper_id"
      @change-window="change_window"
      @preview="preview_window"
    ></ExalForm>
    <PreviewForm
      :windows="preview_form"
      :examid="exam_id"
      :question="question"
      @change-window="close_preview"
      @add-window="change_add_window"
    >
    </PreviewForm>
    <AddForm
      :windows="add_window"
      @change-window="close_add_window"
      @add-question="add_question"
    >
    </AddForm>
  </div>
</template>

<script>
import { verification } from "@/api/verification";
import ExalForm from "./components/examform";
import PreviewForm from "./components/previewform";
import AddForm from "./components/addform";
import { tool } from "@/api/tool";
export default {
  name: "exampaperindex",
  data() {
    return {
      page: 1,
      total: 0,
      loading: true,
      exam_id: "",
      paper_id: "",
      show_window: false,
      add_window: false,
      preview_form: false,
      search_paper_name: "",
      search_subject_name:'',
      search_role: "",
      subject_name: "",
      columns: [
        {
          title: "ID",
          key: "id"
        },
        {
          title: "科目名称",
          key: "subjects",
          slot: "subjects"
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
          title: "时间",
          key: "create_date"
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
                      this.exam_id = params.row.id;
                      this.preview_form = true;
                    }
                  }
                },
                "预览"
              ),
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

                      this.show_window = true;
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
      subjectTreeData: [],
      subjects: [],
      question: {
        question_id: "",
        type: ""
      }
    };
  },
  components: {
    ExalForm,
    PreviewForm,
    AddForm
  },
  mounted() {
    this.bindSubjectTree();
    this.page_list(this.page);
  },
  methods: {
    /*
     *添加试题
     *作者：gzt
     *时间：2020-11-29 20:08:00
     */

    add_question(question) {
      this.question = question;
    },

    close_add_window(value) {
      if (!value) {
        this.preview_form = true;
      }
      this.add_window = value;
    },
    close_preview(value) {
      if (!value) {
        this.preview_form = value;
        console.log("********************");
        this.paper_id = "";
        if (!this.add_window) {
          console.log("----------------");
          this.exam_id = "";
        }
        this.page_list();
      }
    },
    change_add_window(value) {
      this.preview_form = false;
      this.add_window = value;
    },
    change_window(value) {
      if (!value) {
        this.paper_id = "";
      }
      this.show_window = value;
    },
    preview_window(value, exam_id) {
      this.show_window = false;
      this.preview_form = value;
      this.exam_id = exam_id;
    },

    getSubjectName(id) {
      var subject = this.subjects.find(item => {
        return item.id == id;
      });
      return subject ? subject.get("subject_name") : "";
    },
    /** 加载树形科目 */
    bindSubjectTree() {
      var self = this;
      var query = new this.ParseServer.Query("Subjects");
      query.ascending('createdAt')
      query.find().then(res => {
        this.subjects = res;
        var tree = self.initSubjectTree(res, "0");
        self.subjectTreeData = tree;
      });
    },
    /** 构造树形科目 */
    initSubjectTree(subjects, parentId) {
      var self = this;
      var treeValue = [];
      let _subjects = subjects.filter(_item => {
        return _item.get("parent_ID") == parentId;
      });
      _subjects.forEach((_subject, _index) => {
        let subject = {
          title: _subject.get("subject_name"),
          value: _subject.id
        };
        let childrens = subjects.filter(_item => {
          return _item.get("parent_ID") == _subject.id;
        });
        if (childrens.length > 0) {
          subject.children = self.initSubjectTree(subjects, _subject.id);
        }
        treeValue.push(subject);
      });
      return treeValue;
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
    pagechange(e){
      this.page = e
      this.page_list()
    },
    /*
     *分页加载数据
     *作者：gzt
     *时间：2020-11-21 23:30:27
     */
    page_list(page_index) {
      var self = this
      this.loading = true;
      
      let query1 = new this.ParseServer.Query("ExamPaper");
      query1.contains("test_paper_name", this.search_paper_name);


      let query2 = new this.ParseServer.Query("ExamPaper");
      if(this.search_subject_name){
        let subjectIds = []
        this.subjects.forEach((sub,idx)=>{
          if(sub.get('subject_name').indexOf(self.search_subject_name)!=-1){
            subjectIds.push(sub.id)
          }
        })
        query2.containedIn("subjects", subjectIds); // 科目名称
      }

      var query = this.ParseServer.Query.and(query1, query2);
      query.descending("createdAt");
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
                pass_score: item.get("pass_score"),
                create_date: tool.dateFormat(
                  item.updatedAt,
                  "yyyy-MM-dd HH:mm:ss"
                )
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
