<template>
  <div class="newsEdit">
    <input
      id="iviewUp"
      @change="handleUploadComplate()"
      ref="uploader"
      type="file"
      class="ivu-upload-input"
      style="display: none"
    />
    <quillEditor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
      @ready="onEditorReady($event)"
    ></quillEditor>
  </div>
</template>
<script>
// 富文本编辑器
// import "quill/dist/quill.core.css";
import myUpload from "@/components/myUpload";
import "quill/dist/quill.snow.css";
// import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
  [{ list: "ordered" }, { list: "bullet" }], //列表
  [{ script: "sub" }, { script: "super" }], // 上下标
  [{ indent: "-1" }, { indent: "+1" }], // 缩进
  [{ direction: "rtl" }], // 文本方向
  [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
  [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
  [{ align: [] }], //对齐方式
  ["image"],
  ["clean"], // remove formatting button
];
export default {
  name: "NewsEdit",
  components: {
    myUpload,
    quillEditor,
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  data() {
    var self = this;
    return {
      //富文本编辑器
      content: "",
      editorOption: {
        placeholder: self.placeholder,
        // 富文本中的一些属性
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function (value) {
                if (value) {
                  document.querySelector("#iviewUp").click();
                } else {
                  this.quill.format("image", false);
                }
              },
            },
          },
        },
      },
    };
  },
  methods: {
    //富文本 方法
    onEditorChange({ editor, html, text }) {
      //内容改变事件
      this.content = html;
      this.$emit("on-change", html);
    },
    onEditorBlur(editor) {
      //失去焦点事件
    },
    onEditorFocus(editor) {
      //获得焦点事件
    },
    onEditorReady(editor) {
      //准备编辑器
      this.content = this.value;
    },
    //富文本 自定义图片上传
    handleUploadComplate(e) {
      let self = this;
      var files = this.$refs.uploader.files;
      var name = "photo.jpg";
      var parseFile = new this.ParseServer.File(name, files[0]);
      parseFile.save().then((res) => {
        if (res._url) {
          let quill = self.$refs.myQuillEditor.quill;
          // 如果上传成功

          // 获取光标所在位置
          let length = quill.getSelection().index;
          // 插入图片 res.info为服务器返回的图片地址
          quill.insertEmbed(length, "image", res._url);
          // 调整光标到最后
          quill.setSelection(length + 1);
          // loading动画消失
          self.quillUpdateImg = false;
        } else {
          self.$Message.error("上传失败");
        }
      });
    },
  },
  watch: {
    value(newval) {
      this.content = newval;
    },
  },
};
</script>
<style>

.ql-editor {
  min-height: 300px;
}

.ql-container {
  max-height: 70vh;
  overflow-y: auto;
}

.newsEdit .quillEditor img {
  /* height: 300px; */
  width: 400px;
}

strong {
  font-weight: bold;
}
em {
  font-style: oblique;
}

</style>