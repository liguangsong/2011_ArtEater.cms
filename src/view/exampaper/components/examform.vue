<template>
  <Modal v-model="show_windows" :title="window_title" width="600px">
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
        <selectTree  v-if="show_windows"
          id="mySelectTree"
          v-model="exam_forms.subjects"
          multiple
          :treeData="subjectTreeData"
        ></selectTree>
      </FormItem>
      <FormItem label="选择范围" prop="rang">
        <Select v-model="exam_forms.rang" placeholder="请选择范围">
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
        <div class="options clear-fix" v-for="(item, index) in exam_forms.options" :key="index">
          <div class="question-label" style="display:flex;height:33px;line-height:33px">
            <div style="flex:1;text-align:right"><label>选择类型</label></div>
            <div style="width:60px;text-align:right"><label>{{item.title}}</label></div>
          </div>
          <div class="question-info">
            <FormItem
              label="题数"
              :prop="'options.' + index + '.number'"
              :rules="
                ({ required: true, trigger: 'blur', message: '请输入题数' },
                {
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
                ({ required: true, trigger: 'blur', message: '请输入每题分数' },
                {
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
    examid: ""
  },
  components: {
    selectTree
  },
  data() {
    var self = this;
    return {
      close: false,
      show_windows: false,
      window_title: "添加组卷",
      subjectTreeData: [],
      ranges: [
        {
          value: "-1",
          label: "全部试题"
        },
        {
          value: "0",
          label: "普通试题"
        },
        {
          value: "1",
          label: "重点试题"
        }
      ],
      draw_ways: [
        {
          value: "1",
          label: "试题选项顺序全部一致"
        },
        {
          value: "2",
          label: "选项顺序随机"
        },
        {
          value: "3",
          label: "试题顺序随机"
        },
        {
          value: "4",
          label: "试题选项顺序全部随机"
        }
      ],
      exam_forms: {
        test_paper_name: "",
        options: [
          { title:'单选', type: "1", number: "", score: ""},
          { title: '多选', type: "2", number: "", score: "" },
          { title:'填空', type: "3", number: "", score: "" },
          { title:'多项选择', type: "4", number: "", score: "" }
        ],
        time_count: 0,
        score: 0,
        pass_score: 0,
        subjects: [],
        rang: "请选择范围",
        way: "1",
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
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              let _val = parseInt(value);
              if (_val > self.total_score) {
                callback(new Error("及格分数不能大于总分"));
              } else if (_val == 0) {
                callback(new Error("请输入及格分数"));
              } else {
                callback();
              }
            }
          },
          {
            pattern: /^\d+$/,
            message: "请输入数字",
            trigger: "blur"
          }
        ],
        subjects: [
          {
            required: true,
            message: "请选择科目/章节",
            trigger: "change",
            validator: (rule, value, callback) => {
              if (value.length == 0) {
                callback(new Error("请选择科目/章节"));
              } else {
                callback();
              }
            }
          }
        ],
        rang: [
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
              } else if (value > 999) {
                callback(new Error("考试时长最多为999分钟"));
              } else {
                callback();
              }
            }
          },
          {
            pattern: /^\d+$/,
            message: "请输入数字",
            trigger: "blur"
          }
        ],
        score: [
          { required: true, message: "请输入试题数", trigger: "blur" },
          {
            pattern: /^\d+$/,
            message: "请输入数字",
            trigger: "blur"
          }
        ]
      },
      init_data: {
        test_paper_name: "",
        options: [
          { title:'单选', type: "1", number: "", score: ""},
          { title: '多选', type: "2", number: "", score: "" },
          { title:'填空', type: "3", number: "", score: "" },
          { title:'多项选择', type: "4", number: "", score: "" }
        ],
        time_count: 0,
        score: 0,
        pass_score: 0,
        subjects: [],
        rang: "请选择范围",
        way: "1",
        questions: []
      }
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
        var _score = parseInt(item.number) * parseInt(item.score);
        if (_score) {
          score += _score;
        }
      });
      this.exam_forms.score = score;
      return score;
    }
  },

  watch: {
    windows: function(new_val, old) {
      this.show_windows = new_val;
    },
    show_windows: function(new_val, old_val) {
      if (!new_val) {
        this.exam_forms = JSON.parse(JSON.stringify(this.init_data));
      }
      this.$emit("change-window", new_val);
    },
    examid: function(new_val, old_val) {
      if (new_val) {
        this.get_entity();
      }
    }
  },
  mounted() {
    this.bindSubjectTree();
  },
  methods: {
    /*
     *构造树形结构
     *作者：gzt
     *时间：2020-11-28 21:09:50
     */
    initSubjectTree(subjects, parentId) {
      var self = this
      var treeValue = []
      let _subjects = subjects.filter((_item)=>{
          return _item.get('parent_ID') == parentId
      })
      _subjects.forEach((_subject, _index)=> {
          let subject = {
              title: _subject.get('subject_name'),
              value: _subject.id,
          }
          let childrens = subjects.filter(_item=>{
              return _item.get('parent_ID') == _subject.id
          })
          if(childrens.length>0){
              subject.children = self.initSubjectTree(subjects, _subject.id)
          }
          treeValue.push(subject)
      })
      return treeValue
    },
    /*
     * 加载科目的树形结构
     * 作者：gzt
     * 时间：2020-11-22 14:42:57
     */
    bindSubjectTree() {
      var self = this
      var query = new this.ParseServer.Query("Subjects")
      query.ascending('createdAt')
      query.limit(10000)
      query.find().then(res=>{
          this.subjects = res
          var tree = self.initSubjectTree(res,'0')
          self.subjectTreeData = tree
      })
    },
    /*
     *取消操作
     *作者：gzt
     *时间：2020-11-22 14:42:57
     */
    cancel(exam_id) {
      this.$refs["form"].resetFields();
      this.window_title = "添加组卷";
      this.exam_forms = JSON.parse(JSON.stringify(this.init_data));
      this.$emit("preview", true, exam_id);
    },

    get_random_array_elements(arr, count) {
      if (arr.length <= count) {
        return arr;
      }
      var shuffled = arr.slice(0),
        i = arr.length,
        min = i - count,
        temp,
        index;
      while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
      }
      return shuffled.slice(min);
    },

    /*
     *创建问题
     *作者：gzt
     *时间：2020-11-29 01:18:08
     */
    create_questions() {
      let _this = this;
      var query = new this.ParseServer.Query("TestQuestions");
      query.select("objectId", "type");
      if(this.exam_forms.rang!='-1'){
        query.equalTo('isImportant', parseInt(this.exam_forms.rang))
      }
      query.containedIn("subjects", this.exam_forms.subjects);
      var reuqestions = {
        1: [],
        2: [],
        3: [],
        4: []
      };
      var reuqestion_ids = [];
      query.find().then(
        response => {
          if (response.length > 0) {
            response.forEach((item, index) => {
              reuqestions[item.get("type")].push(item.id);
            });
          }
          // var total_score = 0;
          var right = true;
          var exam_type = 0;
          // 随机计算试题
          Object.keys(reuqestions).forEach(key => {
            var random_questions = this.get_random_array_elements(
              reuqestions[key],
              this.exam_forms.options[parseInt(key) - 1].number
            );
            // total_score +=
            //   this.exam_forms.options[parseInt(key) - 1].score *
            //   random_questions.length;
            // this.exam_forms.options[parseInt(key) - 1].number =
            //   random_questions.length;
            if (
              random_questions.length <
              parseInt(_this.exam_forms.options[parseInt(key) - 1].number)
            ) {
              right = false;
              exam_type = key;
            }
            random_questions.forEach(item => {
              reuqestion_ids.push(item);
            });
          });
          if (!right) {
            var msg = "";
            if (exam_type == 1) {
              msg = "单选题试题数量不足";
            }
            if (exam_type == 2) {
              msg = "多选题试题数量不足";
            }
            if (exam_type == 3) {
              msg = "填空题试题数量不足";
            }
            if (exam_type == 4) {
              msg = "多项选择试题数量不足";
            }
            this.$Message.error(msg);
            return;
          }
          var Exampaper = _this.ParseServer.Object.extend("ExamPaper");
          var exam_paper = new Exampaper();
          debugger
          if (_this.examid) {
            exam_paper.set("id", _this.examid);
          }
          if (_this.exam_forms.score < _this.exam_forms.pass_score) {
            _this.exam_forms.pass_score = _this.exam_forms.score;
          }
          // _this.exam_forms.score = total_score;
          _this.exam_forms.questions = reuqestion_ids;
          // 试卷的生成
          _this.exam_forms.time_count = parseInt(_this.exam_forms.time_count);
          _this.exam_forms.pass_score = parseInt(_this.exam_forms.pass_score);
          Object.keys(_this.exam_forms).forEach(key => {
            exam_paper.set(key, _this.exam_forms[key]);
          });
          exam_paper.save().then(
            response => {
              _this.$Message.success("保存成功");
              _this.cancel(response.id);
            },
            error => {
              debugger
              _this.$Message.error("保存失败");
            }
          );
        },
        error => {
          this.$Message.error("试题生成过程中出错");
        }
      );
    },

    /*
     *新增试卷
     *作者：gzt
     *时间：2020-11-22 14:50:34
     */
    save() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.create_questions();
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
      var self = this
      var query = new this.ParseServer.Query("ExamPaper");
      query.get(self.examid).then(response => {
        Object.keys(self.exam_forms).forEach(key => {
          self.exam_forms[key] = response.get(key);
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
      width: 150px;
      float: left;
    }
    .question-info {
      width: 180px;
      float: left;

      .input {
        width: 100px;
      }
    }
  }
}
.footer-wrap {
  text-align: center;
}
</style>
