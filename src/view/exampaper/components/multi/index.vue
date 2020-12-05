<template>
  <div class="question">
    <div class="title clear-fix">
      <p>{{ number }}. <span>(多选)</span>{{ question.title }}</p>
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
      <p
        class="option"
        v-for="(option, option_index) in question.options"
        :key="option_index"
      >
        <Checkbox v-model="option.value != ''">{{ option.content }}</Checkbox>
      </p>
    </div>
    <div class="parsing clear-fix">
      <p>解析:</p>
      <div v-html="question.comments" class="html"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "multi-question",
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
      this.$emit("del", question_id);
    },
    add_question(question_id) {
      this.$emit("add-question", question_id, "2");
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
      width: 20%;
    }
  }
  .option-wraps {
    margin: 10px 0;
  }
  .option {
    margin: 5px 0;
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
  height: 200px;
  overflow-y: auto;
}
</style>
