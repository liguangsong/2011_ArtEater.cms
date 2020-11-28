<template>
  <!--  -->
  <Modal v-model="show_windows" :title="window_title" width="700px">
    <Form
      :model="exam_forms"
      label-position="right"
      :label-width="80"
      ref="form"
      :rules="ruleValidate"
    >
      <FormItem label="试卷名称" prop="test_paper_name">
        <Input
          v-model="exam_forms.test_paper_name"
          placeholder="请输入试卷名称"
        ></Input>
      </FormItem>

      <FormItem label="考试时间" prop="time_count">
        <Input v-model="exam_forms.time_count" placeholder="请输入考试时长">
          <span slot="append">分钟</span>
        </Input>
      </FormItem>
      <FormItem label="科目" prop="subjects">
        <selectTree
          id="mySelectTree"
          v-model="exam_forms.subjects"
          multiple
          :treeData="subjectTreeData"
        ></selectTree>
      </FormItem>
      <FormItem label="选择范围" prop="range">
        <Select v-model="exam_forms.range" placeholder="请选择范围">
          <Option
            v-for="item in ranges"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="出题方式" prop="way">
        <Select v-model="exam_forms.way" placeholder="请选择出题方式">
          <Option
            v-for="item in draw_ways"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="及格分数" prop="pass_score">
        <Input
          v-model="exam_forms.pass_score"
          placeholder="请输入及格分数"
        ></Input>
      </FormItem>
      <div class="options-wrap">
        <p class="title">题目</p>
        <div
          class="options clear-fix"
          v-for="(item, index) in exam_forms.options"
          :key="index"
        >
          <div class="question-label">
            <span>选择类型</span>
            <span>{{ item.type }}</span>
          </div>
          <div class="question-info">
            <FormItem
              label="题数"
              :prop="'options.' + index + '.number'"
              :rules="
                ({ required: true, trigger: 'blur', message: '请输入题数' },
                {
                  type: 'string',
                  pattern: /^\d+$/,
                  message: '请输入数字',
                  trigger: 'blur'
                })
              "
            >
              <Input
                class="input"
                v-model="item.number"
                placeholder="请输入题目数量"
              ></Input
            ></FormItem>
          </div>
          <div class="question-info">
            <FormItem
              label="每题分数"
              :prop="'options.' + index + '.score'"
              :rules="
                ({ required: true, trigger: 'blur', message: '请输入题数' },
                {
                  type: 'string',
                  pattern: /^\d+$/,
                  message: '请输入数字',
                  trigger: 'blur'
                })
              "
            >
              <Input
                class="input"
                v-model="item.score"
                placeholder="请输入分值"
              ></Input>
            </FormItem>
          </div>
        </div>
        <div style="font-size:18px;margin-top:20px;">
          满分:{{ total_score }}
        </div>
      </div>
    </Form>
    <div slot="footer" class="footer-wrap">
      <Button class="save" @click="save" type="primary" size="large"
        >保存并预览</Button
      >
    </div>
  </Modal>
</template>

<script>
import { verification } from "@/api/verification";
import selectTree from "@/components/iview-select-tree";
export default {
  name: "examform",
  props: {
    windows: false,
    examid: 0
  },
  components: {
    selectTree
  },
  data() {
    return {
      close: false,
      show_windows: false,
      window_title: "添加组卷",
      subjectTreeData: [],
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
      draw_ways: [
        {
          value: "试题选项顺序全部一致",
          label: "试题选项顺序全部一致"
        },
        {
          value: "选项顺序随机",
          label: "选项顺序随机"
        },
        {
          value: "试题顺序随机",
          label: "试题顺序随机"
        },
        {
          value: "试题选项顺序全部随机",
          label: "试题选项顺序全部随机"
        }
      ],
      exam_forms: {
        test_paper_name: "",
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
        time_count: 0,
        score: 0,
        pass_score: 0,
        subjects: "",
        range: "请选择范围",
        way: "试题选项顺序全部一致",
        questions: []
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

        pass_score: [
          { required: true, message: "请输入及格分数", trigger: "blur" },
          {
            type: "string",
            pattern: /^\d+$/,
            message: "请输入数字",
            trigger: "blur"
          }
        ],
        subjects: [
          { required: true, message: "请选择考试科目", trigger: "blur" }
        ],
        range: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value == "请选择范围") {
                callback(new Error("请选择范围"));
              } else {
                callback();
              }
            }
          },
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (value == "请选择范围") {
                callback(new Error("请选择范围"));
              } else {
                callback();
              }
            }
          }
        ],
        time_count: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value == 0) {
                callback(new Error("请输入考试时长"));
              } else {
                callback();
              }
            }
          },
          {
            type: "string",
            pattern: /^\d+$/,
            message: "请输入数字",
            trigger: "blur"
          }
        ],
        number: [
          { required: true, message: "请输入试题数", trigger: "blur" },
          {
            type: "string",
            pattern: /^\d+$/,
            message: "请输入数字",
            trigger: "blur"
          }
        ],
        score: [
          { required: true, message: "请输入试题数", trigger: "blur" },
          {
            type: "string",
            pattern: /^\d+$/,
            message: "请输入数字",
            trigger: "blur"
          }
        ]
      },
      init_data: ""
    };
  },
  computed: {
    /*
     * 满分
     *作者：gzt
     *时间：2020-11-22 14:42:57
     */
    total_score() {
      var score = 0;
      this.exam_forms.options.forEach((item, index) => {
        score += parseInt(item.number) * parseInt(item.score);
      });
      this.score = score;
      return score;
    }
  },

  watch: {
    windows: function(new_val, old) {
      this.show_windows = new_val;
    },
    show_windows: function(new_val, old_val) {
      this.$emit("change-window", new_val);
    }
  },
  mounted() {
    // this.bindSubjectTree();
    if (this.examid) {
      this.get_entity();
    }
    this.init_data = JSON.stringify(this.exam_forms);
  },
  methods: {
    show_window(show) {
      this.show_windows = show;
    },
    /*
     * 加载科目的树形结构
     *作者：gzt
     *时间：2020-11-22 14:42:57
     */
    bindSubjectTree() {
      var self = this;
      var query = new this.ParseServer.Query("Subjects");
      query.find().then(res => {
        this.subjects = res;
        var tree = self.initSubjectTree(res, "0");
        self.subjectTreeData = tree;
      });
    },
    /*
     *取消操作
     *作者：gzt
     *时间：2020-11-22 14:42:57
     */
    cancel() {
      this.$refs["form"].resetFields();
      this.window_title = "添加组卷";
      this.exam_forms = JSON.parse(this.init_data);
      this.$emit("preview", true);
    },
    /*
     *新增试卷
     *作者：gzt
     *时间：2020-11-22 14:50:34
     */
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          var Exampaper = this.ParseServer.Object.extend("ExamPaper");
          var exam_paper = new Exampaper();
          if (this.examid) {
            exam_paper.set("id", this.examid);
          }
          Object.keys(this.exam_forms).forEach(key => {
            exam_paper.set(key, this.exam_forms[key]);
          });
          exam_paper.save().then(
            account => {
              this.$Message.success("保存成功");
              this.cancel();
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
      var query = new this.ParseServer.Query("ExamPaper");
      query.get(this.examid).then(response => {
        Object.keys(this.exam_forms).forEach(key => {
          this.exam_forms[key] = response.get(key);
        });
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
.footer-wrap {
  text-align: center;
}
</style>
