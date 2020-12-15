<template>
  <div class="question">
    <div class="title clear-fix">
      <p>{{ number }}. <span>(多项选择)</span>{{ question.title }}</p>
      <div>
        <Button class="save" v-if="add" @click="add_question(question.id)">添加</Button>
        <Button class="save" v-else @click="del(question.id)">删除</Button>
      </div>
    </div>

    <!-- <div v-if="question.images">
      <Avatar
        shape="square"
        :src="url"
        size="large"
        v-for="(url, i) in question.images"
        :key="i"
      />
    </div> -->
    <div class="option-wraps">
        <template v-for="(_option,_idx) in question.options">
            <div>
                <label style="padding-right:20px">选择项{{_idx+1}}</label>
                <p class="option" v-for="(option, option_index) in _option.options" :key="option_index">
                    <Radio :disabled="true" v-model="option.value != ''" disable>{{ option.content }}</Radio>
                </p>
            </div>
        </template>
    </div>
    <div class="parsing  clear-fix">
      <p>解析:</p>
      <div v-html="question.comments" class="html"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "single-question",
  props: {
    question: {
        type: Object,
        default: function() {
            return {}
        }
    },
    number: {
      type: Number,
      default: 0
    },
    add: {
      type: Boolean,
      default: false
    },
    examRow:{
      type: Object,
      default:function(){
        return {}
      }
    }
  },
  data() {
    return {};
  },
  components: {},
  methods: {
    /*
     *试题id
     *作者：gzt
     *时间：2020-11-29 04:14:11
     */
    del(question_id) {
      this.$emit("del", question_id, "单选");
    },

    add_question(question_id) {
      this.$emit("add-question", question_id, "1");
    }
  }
};
</script>

<style lang="less" scoped>
.question {
  margin: 20px 5px;
  margin-top: 0;
  color: #666;
  font-size: 16px;
  .title {
    margin-bottom: 10px;
    p {
      float: left;
      width: 80%;
    }
    div {
      float: left;
      text-align: center;
      width: 20%;
    }
  }
  .option-wraps {
    margin: 10px 0;
  }
  .option {
    margin: 5px 0;
    display: inline-block;
    padding-right: 10px;
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
.html{
  width: 580px!important;
  max-height: 200px;
  margin-bottom: 5px;
  overflow-y: auto;
}

.scroll-wrap {
  width: 600px;
  height: 200px;
  // border: 1px solid #d9d9d9;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d8d8d8;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }
}
.parsing-wrap {
  width: 600px;
  height: 200px;
  p {
    width: 100%;
  }
}
</style>
