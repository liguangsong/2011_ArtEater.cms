<template>
  <Modal v-model="show_windows" :title="window_title" width="700px">
    <Tabs>
      <TabPane label="单选题"></TabPane>
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
    examid: 0
  },
  data() {
    return {
      show_windows: false,
      window_title: "预览组卷"
    };
  },
  computed: {},

  watch: {
    windows: function(new_val, old) {
      this.show_windows = new_val;
    },
    show_windows: function(new_val, old_val) {
      this.$emit("change-window", new_val);
    }
  },
  mounted() {
    this.get_questions();
  },
  methods: {
    submit() {},

    get_questions() {}
  }
};
</script>

<style lang="less" scoped>
.footer-wrap {
  text-align: center;
}
</style>
