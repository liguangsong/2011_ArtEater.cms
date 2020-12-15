<template>
  <Modal
    v-model="show_windows"
    :title="window_title"
    :footer-hide="footer_hide"
    width="700px"
    @on-cancel="cancel"
  >
    <div class="header clear-fix">
      <div class="input-choice">
        <span>试题名称:</span>
        <Input
          class="choice"
          v-model="exam_name"
          placeholder="请输入试题名称"
        />
      </div>
      <div class="input-choice">
        <span>类型:</span>
        <Select v-model="type" class="choice">
          <Option
            v-for="item in exam_type"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </div>
      <Button @click="search" type="primary">搜索</Button>
    </div>
    <div class="content">
      <SingleQues
        v-if="type == 1"
        :number="index + 1"
        :examRow ="examRow"
        :question="item"
        v-for="(item, index) in questions"
        :add="true"
        @add-question="add"
        :key="index"
      ></SingleQues>
      <Multi
        v-if="type == 2"
        :number="index + 1"
        :question="item"
        :examRow ="examRow"
        @add-question="add"
        v-for="(item, index) in questions"
        :add="true"
        :key="index"
      ></Multi>

      <FillBlank
        v-if="type == 3"
        :number="index + 1"
        :question="item"
        :examRow ="examRow"
        @add-question="add"
        v-for="(item, index) in questions"
        :add="true"
        :key="index"
      ></FillBlank>
      <MultiCheck
        v-if="type == 4"
        :number="index + 1"
        :question="item"
        :examRow ="examRow"
        @add-question="add"
        v-for="(item, index) in questions"
        :add="true"
        :key="index"
      ></MultiCheck>
    </div>
  </Modal>
</template>

<script>
import SingleQues from "./single/index";
import Multi from "./multi/index";
import FillBlank from "./fillblank/index";
import MultiCheck from "./multicheck/index";
export default {
  name: "add-form",
  components: {
    SingleQues,
    Multi,
    FillBlank,
    MultiCheck
  },
  props: {
    windows: false,
    quesType:{
      type: Number,
      default: 1
    },
    examRow:{
      type: Object,
      default: function(){
        return {}
      }
    }
  },
  data() {
    var self = this
    return {
      footer_hide: true,
      show_windows: false,
      window_title: "添加试题",
      exam_type: [
        {
          value: 1,
          label: "单选"
        },
        {
          value: 2,
          label: "多选"
        },
        {
          value: 3,
          label: "填空"
        },
        {
          value: 4,
          label: "多项选择"
        }
      ],
      type: self.quesType,
      exam_name: "",
      questions: []
    };
  },
  watch: {
    windows: function(new_val, old) {
      this.show_windows = new_val;
      this.questions = [];
    },
    quesType: function(new_val,old){
      this.type = new_val
    },
    show_windows: function(new_val, old_val) {
      this.$emit("change-window", new_val);
    }
  },

  methods: {
    /*
     * 搜索
     *作者：gzt
     *时间：2020-11-29 13:17:40
     */
    search() {
      let _this = this;
      var _subjects = _this.examRow.subjects
      var query = new this.ParseServer.Query("TestQuestions");
      query.containedIn('subjects', _subjects)
      if(this.exam_name){
        query.contains("title", this.exam_name);
      }
      query.equalTo('isImportant', parseInt(this.examRow.rang))
      var equle = new this.ParseServer.Query("TestQuestions");
      equle.equalTo("type", this.type);
      var main_query = this.ParseServer.Query.and(query, equle);
      main_query.find().then(
        response => {
          _this.questions = []
          if (response.length) {
            response.forEach(item => {
              _this.questions.push({
                id: item.id,
                title: item.get("title"),
                images: item.get("images"),
                options: item.get("options"),
                type: item.get("type"),
                comments: item.get("comments")
              });
            });
          }
        },
        error => {
          debugger
        }
      );
    },

    /*
     *增加试题
     *作者：gzt
     *时间：2020-11-29 20:05:02
     */
    add(question_id, type) {
      // this.show_windows = false;
      this.$emit("add-question", { question_id: question_id, type: type });
    },
    cancel(){
      this.$emit("change-window", false);
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  margin: 10px 0;
  .input-choice {
    span {
      margin-right: 10px;
    }
    float: left;
    width: 40%;
    .choice {
      width: 70%;
    }
  }
}

.content {
  padding-top: 20px;
  border-top: 1px solid #ddd;
  min-height: 200px;
}
</style>
