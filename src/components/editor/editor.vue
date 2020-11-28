<template>
  <div class="newsEdit">
    <Upload
        id="iviewUp"
        ref="upload"
      :show-upload-list="false"
      :on-success="handleSingleSuccess"
      :format="['jpg','jpeg','png']"
      :max-size="2048"
      type="drag"
      action="/api/uploadPicFile"
      style="display: none;width:0"
      >
        <div style="width: 0">
          <Icon type="ios-camera" size="50"></Icon>
      </div>
    </Upload>
    <quillEditor
        class="quillEditor"
      v-model="content"
      ref="myQuillEditor"
        :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    ></quillEditor>
  </div>
</template>
<script>
// 富文本编辑器
// import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
// import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  [{ color: ["red", "blue", "black"] }, { background: ["white", "black"] }],
  ["image"],
  ["clean"], // remove formatting button
];
export default {
  name: "NewsEdit",
  components: {
    quillEditor,
  },
  props: {
    value: {
      type: String,
      default: '',
      
    },
    placeholder:{
      type: String,
      default: '',
    }
  },
  data() {
    var self = this
    return {
      //富文本编辑器
      content: '',
      editorOption: {
        placeholder: self.placeholder,
        // 富文本中的一些属性
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function (value) {
                if (value) {
                  document.querySelector("#iviewUp input").click();
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
      console.log("editor change!", editor, html, text);
      this.content = html;
      this.$emit('on-change', html)
    },
    onEditorBlur(editor) {
      //失去焦点事件
      // console.log("editor blur!", editor);
    },
    onEditorFocus(editor) {
      //获得焦点事件
      // console.log("editor focus!", editor);
    },
    onEditorReady(editor) {
      //准备编辑器
      // console.log("editor ready!", editor);
      // this.content = this.value
    },
    //富文本 自定义图片上传 
    handleSingleSuccess(res) {
      console.log(res);
      let vm = this;
      let quill = this.$refs.myQuillEditor.quill;
      console.log("res---", vm.$refs.myQuillEditor.quill.getSelection());
      // 如果上传成功
      if (res.code === 200) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片 res.info为服务器返回的图片地址
        quill.insertEmbed(length, "image", res.msg);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        vm.$Message.error("图片插入失败");
      }
      // loading动画消失
      this.quillUpdateImg = false;
    },
  },
  watch: {
    value(newval){
      this.content = newval
    }
  }
};
</script>
<style>
.newsEdit .quillEditor {
    min-height: 200px;
  }
  .ql-editor{
    min-height: 200px;
  }
.newsEdit .quillEditor img {
      /* height: 300px; */
      width: 400px;
    }

strong{
  font-weight: bold;
}
em{
  font-style: oblique;
}
</style>