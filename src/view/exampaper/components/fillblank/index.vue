<template>
  <div class="question">
    <div class="title clear-fix">
      <p>{{ number }}. {{ question.title }}</p>
      <div>
        <Button class="save" v-if="add" @click="add_question(question.id)"
          >添加</Button
        >
        <Button class="save" v-else @click="del(question.id)">删除</Button>
      </div>
    </div>

    <div v-if="question.images">
      <Avatar
        shape="square"
        :src="url"
        size="large"
        v-for="(url, i) in question.images.split(',')"
        :key="i"
      />
    </div>
    <div class="option-wraps">
      <div
        class="option"
        v-for="(options_item, option_index) in question.options"
      >
        <p class="answer" v-for="(text, index) in options_item.value">
          <span v-if="index == 0">答案{{ option_index + 1 }}:</span>
          <span v-else>备选答案{{ index + 1 }}:</span>{{ text.txt }}
        </p>
      </div>
    </div>
    <div class="parsing clear-fix">
      <p>解析:</p>
	  <div v-html="question.comments" class="html"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "fillblank-question",
  props: {
    question: {
      type: Object,
      default: function() {
        return {};
      }
    },
    number: {
      type: Number,
      default: 0
    },
    add: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    /*
     *试题id
     *作者：gzt
     *时间：2020-11-29 04:14:11
     */
    del(question_id) {
      this.$emit("del", question_id, "填空");
    },
    add_question(question_id) {
      this.$emit("add-question", question_id, "3");
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
      text-align: center;
      float: left;
      width: 20%;
    }
  }
  .option-wraps {
    margin: 10px 0;
  }
  .option {
    margin: 5px 0;
    .answer {
      margin: 5px;
      span {
        margin-right: 10px;
        color: #666;
      }
    }
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
<<<<<<< .mine
.html{
  width: 580px!important;
  height: 200px;
  overflow-y: auto;
}


















=======
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
>>>>>>> .theirs
</style>
