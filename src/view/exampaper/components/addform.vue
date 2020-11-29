<template>
  <Modal
    v-model="show_windows"
    :title="window_title"
    :footer-hide="footer_hide"
    width="700px"
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
    <div class="content"></div>
  </Modal>
</template>

<script>
export default {
  name: "add-form",
  props: {
    windows: false
  },
  data() {
    return {
      footer_hide: true,
      show_windows: false,
      window_title: "添加试题",
      exam_type: [
        {
          value: "1",
          label: "单选"
        },
        {
          value: "2",
          label: "多选"
        },
        {
          value: "3",
          label: "填空"
        }
      ],
      type: "1",
      exam_name: "",
      questions: []
    };
  },
  watch: {
    windows: function(new_val, old) {
      this.show_windows = new_val;
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
    search() {}
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
  border-top: 1px solid #ddd;
  min-height: 200px;
}
</style>
