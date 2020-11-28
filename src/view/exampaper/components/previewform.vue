<template>
  <Modal v-model="show_windows" :title="window_title" width="700px">
    <Tabs v-if="ready">
      <TabPane label="单选题">
        <div v-for="(item, index) in singles" :key="index" class="question">
          <div class="title clear-fix">
            <p>
              {{ parseInt((single_page - 1) * 10 + parseInt(index + 1)) }}.
              <span>(单选)</span>{{ item.title }}
            </p>
            <div>
              <Button class="save" @click="del">删除</Button>
            </div>
          </div>

          <div v-if="item.images">
            <Avatar
              shape="square"
              :src="url"
              size="large"
              v-for="(url, i) in item.images.split(',')"
              :key="i"
            />
          </div>
          <div class="option-wraps">
            <p
              class="option"
              v-for="(option, option_index) in item.options"
              :key="option_index"
            >
              <Radio v-model="option.value != ''" disable>{{
                option.content
              }}</Radio>
            </p>
          </div>
          <div class="parsing clear-fix">
            <p>解析:</p>
            <div v-html="item.comments"></div>
          </div>
        </div>
        <Page
          :page-size="page_size"
          :total="questions['1'].length"
          @on-change="switch_value_1"
          v-if="questions['1'].length"
        />
      </TabPane>
      <TabPane label="多选题"></TabPane>
      <TabPane label="填空题"></TabPane>
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
export default {
  name: "exam-preview-form",
  props: {
    windows: false,
    examid: ""
  },
  data() {
    return {
      page_size: 3,
      show_windows: false,
      window_title: "预览组卷",
      ready: false,
      single_page: 1,
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
  computed: {},

  watch: {
    windows: function(new_val, old) {
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
          (this.single_page - 1) * 3,
          this.single_page * 3
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

    submit() {},

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
     *试题id
     *作者：gzt
     *时间：2020-11-29 04:14:11
     */
    del(question_id) {
      console.log(question_id);
    }
  }
};
</script>

<style lang="less" scoped>
.question {
  margin: 20px 5px;
  color: #666;
  font-size: 16px;
  .title {
    margin-bottom: 20px;
    p {
      float: left;
      width: 80%;
    }
    div {
      float: left;
      width: 20%;
    }

    .option {
      margin: 10px;
    }
  }
  .option-wraps {
    margin: 10px 0;
  }
  .parsing {
    margin: 10px 0;
    p {
      float: left;
      width: 7%;
      color: #333;
    }
    div {
      float: left;
      width: 93%;
    }
  }
}

.footer-wrap {
  text-align: center;
}
</style>
