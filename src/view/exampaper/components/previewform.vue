<template>
  <Modal v-model="show_windows" :title="window_title" width="700px">
    <Tabs v-if="ready">
      <TabPane label="单选题">
        <SingleQues
          :question="item"
          :number="parseInt((single_page - 1) * 10 + parseInt(index + 1))"
          v-for="(item, index) in singles"
          :key="index"
          @del="del"
        ></SingleQues>
        <Page
          :page-size="page_size"
          :total="questions['1'].length"
          @on-change="switch_value_1"
          v-if="questions['1'].length"
        />
      </TabPane>
      <TabPane label="多选题">
        <Multi
          :question="item"
          :number="parseInt((multis_page - 1) * 10 + parseInt(index + 1))"
          v-for="(item, index) in multis"
          :key="index"
          @del="del"
        ></Multi>
        <Page
          :page-size="page_size"
          :total="questions['2'].length"
          @on-change="switch_value_2"
          v-if="questions['2'].length"
        />
      </TabPane>
      <TabPane label="填空题">
        <FillBlank
          :question="item"
          :number="parseInt((fillblank_page - 1) * 10 + parseInt(index + 1))"
          v-for="(item, index) in fillblanks"
          :key="index"
          @del="del"
        ></FillBlank>
        <Page
          :page-size="page_size"
          :total="questions['3'].length"
          @on-change="switch_value_3"
          v-if="questions['3'].length"
        />
      </TabPane>
      <Button @click="add_window = true" type="primary" slot="extra"
        >添加</Button
      >
    </Tabs>
    <div slot="footer" class="footer-wrap">
      <Button class="save" @click="submit" type="primary" size="large"
        >提交</Button
      >
    </div>
  </Modal>
</template>

<script>
import { verification } from "@/api/verification";
import SingleQues from "./single/index";
import Multi from "./multi/index";
import FillBlank from "./fillblank/index";
export default {
  name: "exam-preview-form",
  props: {
    windows: false,
    examid: "",
    question: {
      type: Object,
      default: function() {
        return null;
      }
    }
  },
  data() {
    return {
      page_size: 10,
      show_windows: false,
      window_title: "预览组卷",
      ready: false,
      add_window: false,
      single_page: 1,
      multis_page: 1,
      fillblank_page: 1,
      questions: {
        1: [],
        2: [],
        3: []
      },
      exam_forms: {
        test_paper_name: "",
        options: [
          {
            type: "单选",
            number: "",
            score: ""
          },
          {
            type: "多选",
            number: "",
            score: ""
          },
          {
            type: "填空",
            number: "",
            score: ""
          }
        ],
        time_count: "",
        score: 0,
        pass_score: "",
        subjects: "",
        range: "请选择范围",
        way: "试题选项顺序全部一致",
        questions: []
      }
    };
  },
  components: {
    SingleQues,
    Multi,
    FillBlank
  },

  watch: {
    windows: function(new_val, old) {
      if (new_val) {
        this.add_window = false;
      }

      this.show_windows = new_val;
    },
    show_windows: function(new_val, old_val) {
      this.$emit("change-window", new_val);
    },
    /*
     *试卷id
     *作者：gzt
     *时间：2020-11-29 00:32:45
     */
    examid: function(new_val, old_val) {
      if (new_val) {
        this.ready = false;
        this.get_entity();
      }
    },
    /*
     *添加窗口
     *作者：gzt
     *时间：2020-11-29 12:06:10
     */
    add_window: function(new_val, old_val) {
      if (new_val) {
        this.$emit("add-window", new_val);
      }
    },
    /*
     *试题
     *作者：gzt
     *时间：2020-11-29 20:13:38
     */
    question: {
      handler: function(new_val, old_dal) {
        this.add_question(new_val);
      },
      deep: true
    }
  },

  computed: {
    /*
     *单选题
     *作者：gzt
     *时间：2020-11-29 03:14:51
     */
    singles() {
      var questions = this.questions["1"];
      if (questions.length > 0) {
        return questions.slice(
          (this.single_page - 1) * this.page_size,
          this.single_page * this.page_size
        );
      }
      return [];
    },
    /*
     *多选
     *作者：gzt
     *时间：2020-11-29 09:40:47
     */
    multis() {
      var questions = this.questions["2"];
      if (questions.length > 0) {
        return questions.slice(
          (this.multis_page - 1) * this.page_size,
          this.multis_page * this.page_size
        );
      }
      return [];
    },
    /*
     *填空题
     *作者：gzt
     *时间：2020-11-29 09:41:28
     */
    fillblanks() {
      var questions = this.questions["3"];
      if (questions.length > 0) {
        return questions.slice(
          (this.fillblank_page - 1) * this.page_size,
          this.fillblank_page * this.page_size
        );
      }
      return [];
    }
  },
  mounted() {
    // this.get_entity();
  },
  methods: {
    switch_value_1(page) {
      this.single_page = page;
    },
    switch_value_2(page) {
      this.multis_page = page;
    },
    switch_value_3(page) {
      this.fillblank_page = page;
    },

    /*
     *提交保存
     *作者：gzt
     *时间：2020-11-29 20:41:39
     */
    submit() {
      let _this = this;
      var Exampaper = _this.ParseServer.Object.extend("ExamPaper");
      var exam_paper = new Exampaper();
      exam_paper.set("id", this.examid);
      Object.keys(this.exam_forms).forEach(key => {
        exam_paper.set(key, this.exam_forms[key]);
      });
      exam_paper.save().then(
        response => {
          _this.$Message.success("提交成功");
          _this.show_windows = false;
        },
        error => {
          _this.$Message.error("提交失败");
        }
      );
    },

    /*
     *添加试题
     *作者：gzt
     *时间：2020-11-29 10:43:35
     */
    add_question(question) {
      if (
        this.exam_forms.questions.findIndex(
          ent => ent == question.question_id
        ) != -1
      ) {
        this.$Message.warning("该套试卷中以存在此题");
        return;
      }
      let _this = this;
      var query = new this.ParseServer.Query("TestQuestions");
      query.get(question.question_id).then(response => {
        _this.questions[response.get("type")].push({
          id: response.id,
          title: response.get("title"),
          images: response.get("images"),
          options: response.get("options"),
          type: response.get("type"),
          comments: response.get("comments")
        });
        _this.exam_forms.questions.push(response.id);
        // 计算分数和题数
        if (question.type == "1") {
          // 单选
          _this.exam_forms.options[0].number += 1;
          _this.exam_forms.score += _this.exam_forms.options[0].score;
        }
        if (question.type == "2") {
          // 多选
          _this.exam_forms.options[1].number += 1;
          _this.exam_forms.score += _this.exam_forms.options[1].score;
        }
        if (question.type == "3") {
          // 填空
          _this.exam_forms.options[2].number += 1;
          _this.exam_forms.score += _this.exam_forms.options[2].score;
        }
      });
    },
    /*
     *查询试题
     *作者：gzt
     *时间：2020-11-29 00:41:01
     */
    get_questions(question_ids) {
      let _this = this;
      question_ids.forEach(id => {
        var query = new this.ParseServer.Query("TestQuestions");
        query.get(id).then(response => {
          _this.questions[response.get("type")].push({
            id: response.id,
            title: response.get("title"),
            images: response.get("images"),
            options: response.get("options"),
            type: response.get("type"),
            comments: response.get("comments")
          });
        });
      });
      this.ready = true;
    },

    /*
     *获取试卷试题
     *作者：gzt
     *时间：2020-11-22 09:21:48
     */
    get_entity() {
      this.questions = {
        1: [],
        2: [],
        3: []
      };
      let _this = this;
      var query = new this.ParseServer.Query("ExamPaper");
      query.get(this.examid).then(
        response => {
          Object.keys(_this.exam_forms).forEach(key => {
            _this.exam_forms[key] = response.get(key);
          });
          _this.get_questions(response.get("questions"));
        },
        error => {
          this.$Message.error("获取失败");
        }
      );
    },

    /*
     *计算删除后的分数
     *作者：gzt
     *时间：2020-11-29 11:26:58
     */
    computed_socre(type) {
      var score = 0;
      if (type == "单选") {
        score = this.exam_forms.options[0].score;
      }
      if (type == "多选") {
        score = this.exam_forms.options[1].score;
      }
      if (type == "填空") {
        score = this.exam_forms.options[2].score;
      }
      var _score = this.exam_forms.score - score;
      if (_score < this.exam_forms.pass_score) {
        return false;
      }
      this.exam_forms.score = _score;
      return true;
    },

    /*
     *试题id
     *作者：gzt
     *时间：2020-11-29 04:14:11
     */
    del(question_id, type) {
      let _this = this;
      this.$Modal.confirm({
        title: "删除提示",
        content: "<p>确定要删除该试题吗？</p>",
        onOk: () => {
          var result = this.computed_socre(type);
          if (!result) {
            this.$Message.error("删除后将低于及格分");
            return;
          }
          Object.keys(_this.questions).forEach(key => {
            _this.questions[key].forEach((item, index) => {
              if (item.id == question_id) {
                _this.questions[key].splice(index, 1);
              }
            });
          });
          _this.exam_forms.questions.forEach((item, index) => {
            if (item == question_id) {
              _this.exam_forms.questions.splice(index, 1);
            }
          });
        },
        onCancel: () => {
          this.$Message.info("取消了操作");
        }
      });
      console.log("------------------");
      console.log(this.exam_forms);
      console.log("------------------");
    }
  }
};
</script>

<style lang="less" scoped>
.footer-wrap {
  text-align: center;
}
</style>
