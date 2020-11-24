<template>
  <div class="hello">
    <!-- 你不需要担心一个页面中过多vue-ueditor-wrap组件会导致混乱,或者重复引用JS(打开控制台瞄一眼),每个组件都保证拥有一个独立的UEditor实例,你可以尝试把数字改成99(根据自己电脑自行斟酌),但依然稳定可用 -->
    <span>（图片不应超过2M）</span>
    <vue-ueditor-wrap ref="ueditor" v-model="msg" :destroy="false" :config="config" @ready="ready" @beforeInit="addCustomUI"></vue-ueditor-wrap>
  </div>
</template>

<script>
// 1、引入VueUeditorWrap组件
import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module
// const VueUeditorWrap = require('vue-ueditor-wrap') // CommonJS
export default {
  name: 'HelloWorld',
  props:['content'],
  // 2、注册组件
  components: {
    VueUeditorWrap
  },
  data () {
    return {
      // 3、v-model绑定数据
      msg: '请输入...',
      // 4、根据项目需求自行配置,具体配置参见ueditor.config.js源码或 http://fex.baidu.com/ueditor/#start-start
      config: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口,
        // serverUrl:'http://192.168.124.20:19301/api/ueditor/config',
        serverUrl: 'https://sdam.weixun6.com/api/ueditor/config',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        // UEDITOR_HOME_URL: '/static/UEditor/'
        // 配合最新编译的资源文件，你可以实现添加自定义Request Headers,详情https://github.com/HaoChuan9421/ueditor/commits/dev-1.4.3.3
        // headers: {
        //   access_token: '37e7c9e3fda54cca94b8c88a4b5ddbf3'
        // }
        toolbars: [
            [
                'anchor', //锚点
                'undo', //撤销
                'redo', //重做
                'bold', //加粗
                'indent', //首行缩进
                'italic', //斜体
                'underline', //下划线
                'strikethrough', //删除线
                'subscript', //下标
                'fontborder', //字符边框
                'superscript', //上标
                'formatmatch', //格式刷
                'source', //源代码
                'blockquote', //引用
                'pasteplain', //纯文本粘贴模式
                'selectall', //全选
                'print', //打印
                'preview', //预览
                'horizontal', //分隔线
                'removeformat', //清除格式
                'time', //时间
                'date', //日期
                'unlink', //取消链接
                'insertrow', //前插入行
                'insertcol', //前插入列
                'mergeright', //右合并单元格
                'mergedown', //下合并单元格
                'deleterow', //删除行
                'deletecol', //删除列
                'splittorows', //拆分成行
                'splittocols', //拆分成列
                'splittocells', //完全拆分单元格
                'deletecaption', //删除表格标题
                'inserttitle', //插入标题
                'mergecells', //合并多个单元格
                'deletetable', //删除表格
                'cleardoc', //清空文档
                'insertparagraphbeforetable', //"表格前插入行"
                'fontfamily', //字体
                'fontsize', //字号
                'paragraph', //段落格式
                'simpleupload', //单图上传
                //'insertimage', //多图上传
                'edittable', //表格属性
                'edittd', //单元格属性
                'link', //超链接
                'emotion', //表情
                'spechars', //特殊字符
                'insertvideo', //视频
                'justifyleft', //居左对齐
                'justifyright', //居右对齐
                'justifycenter', //居中对齐
                'justifyjustify', //两端对齐
                'forecolor', //字体颜色
                'backcolor', //背景色
                'insertorderedlist', //有序列表
                'insertunorderedlist', //无序列表
                'fullscreen', //全屏
                'directionalityltr', //从左向右输入
                'directionalityrtl', //从右向左输入
                'rowspacingtop', //段前距
                'rowspacingbottom', //段后距
                'pagebreak', //分页
                'imagenone', //默认
                'imageleft', //左浮动
                'imageright', //右浮动
                'attachment', //附件
                'imagecenter', //居中
                'lineheight', //行间距
                'edittip ', //编辑提示
                'customstyle', //自定义标题
                'autotypeset', //自动排版
                'touppercase', //字母大写
                'tolowercase', //字母小写
                'background', //背景
                'template', //模板
                'music', //音乐
                'inserttable', //插入表格
                'drafts', // 从草稿箱加载
                'charts', // 图表
            ]
        ]
      }
    }
  },
  mounted () {
    this.msg = this.content
  },
  methods: {
    // 5、 你可以在ready方法中拿到editorInstance实例,所有API和官方的实例是一样了。http://fex.baidu.com/ueditor/#api-common
    ready (editorInstance) {
    },
    
    // 7. 借助 beforeInit 钩子，你可以实现对 UEditor 的二次开发，会在 scripts 加载完毕之后、编辑器初始化之前触发，以 编辑器 id 和 配置参数 作为入参
    addCustomUI (editorId, editorConfig) {
      // 1. 自定义按钮
      window.UE.registerUI('test-button' + editorId, function (editor, uiName) {
        // 注册按钮执行时的 command 命令，使用命令默认就会带有回退操作
        editor.registerCommand(uiName, {
          execCommand: function () {
            editor.execCommand('inserthtml', `<span style="color: #${editorId.substr(-3)};">这是一段由自定义按钮添加的文字，你点击的编辑器ID是${editorId}</span>`)
          }
        })
        // 创建一个 button
        var btn = new window.UE.ui.Button({
          // 按钮的名字
          name: uiName,
          // 提示
          title: '鼠标悬停时的提示文字',
          // 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
          cssRules: "background-image: url('/static/test-button.png') !important;background-size: cover;",
          // 点击时执行的命令
          onclick: function () {
            // 这里可以不用执行命令，做你自己的操作也可
            editor.execCommand(uiName)
          }
        })
        // 当点到编辑内容上时，按钮要做的状态反射
        editor.addListener('selectionchange', function () {
          var state = editor.queryCommandState(uiName)
          if (state === -1) {
            btn.setDisabled(true)
            btn.setChecked(false)
          } else {
            btn.setDisabled(false)
            btn.setChecked(state)
          }
        })
        // 因为你是添加 button，所以需要返回这个 button
        return btn
      }, 0 /* 指定添加到工具栏上的哪个位置，默认时追加到最后 */, editorId /* 指定这个 UI 是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */)
      // 2. 自定义表格居中按钮
      window.UE.registerUI('table-center-button' + editorId, function (editor, uiName) {
        // 注册按钮执行时的 command 命令，使用命令默认就会带有回退操作
        editor.registerCommand(uiName, {
          execCommand: function () {
            var tables = editor.document.querySelectorAll('table')
            if (tables.length) {
              tables.forEach((table) => {
                table.style.margin = '0 auto'
              })
            } else {
              editor.trigger('showmessage', {
                content: '没有表格',
                timeout: 2000
              })
            }
          }
        })
        // 创建一个 button
        var btn = new window.UE.ui.Button({
          // 按钮的名字
          name: uiName,
          // 提示
          title: '点击设置表格居中',
          // 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
          cssRules: "background-image: url('/static/center.png') !important;background-size: cover;",
          // 点击时执行的命令
          onclick: function () {
            // 这里可以不用执行命令，做你自己的操作也可
            editor.execCommand(uiName)
          }
        })
        // 当点到编辑内容上时，按钮要做的状态反射
        editor.addListener('selectionchange', function () {
          var state = editor.queryCommandState(uiName)
          if (state === -1) {
            btn.setDisabled(true)
            btn.setChecked(false)
          } else {
            btn.setDisabled(false)
            btn.setChecked(state)
          }
        })
        // 因为你是添加 button，所以需要返回这个 button
        return btn
      }, 1 /* 指定添加到工具栏上的哪个位置，默认时追加到最后 */, editorId /* 指定这个 UI 是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */)
      // 3. 自定义弹窗
      window.UE.registerUI('test-dialog' + editorId, function (editor, uiName) {
        // 创建 dialog
        var dialog = new window.UE.ui.Dialog({
          // 指定弹出层中页面的路径，这里只能支持页面，路径参考常见问题 2
          iframeUrl: '/static/customizeDialogPage.html',
          // 需要指定当前的编辑器实例
          editor: editor,
          // 指定 dialog 的名字
          name: uiName,
          // dialog 的标题
          title: '这是一个自定义的 Dialog 浮层',
          // 指定 dialog 的外围样式
          cssRules: 'width:600px;height:300px;',
          // 如果给出了 buttons 就代表 dialog 有确定和取消
          buttons: [
            {
              className: 'edui-okbutton',
              label: '确定',
              onclick: function () {
                dialog.close(true)
              }
            },
            {
              className: 'edui-cancelbutton',
              label: '取消',
              onclick: function () {
                dialog.close(false)
              }
            }
          ]
        })
        // 参考上面的自定义按钮
        var btn = new window.UE.ui.Button({
          name: 'dialog-button',
          title: '鼠标悬停时的提示文字',
          cssRules: `background-image: url('/static/test-dialog.png') !important;background-size: cover;`,
          onclick: function () {
            // 渲染dialog
            dialog.render()
            dialog.open()
          }
        })
        return btn
      }, 2 /* 指定添加到工具栏上的那个位置，默认时追加到最后 */, editorId /* 指定这个UI是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */)
    },

    catchData(v){
        this.$emit('catchData',v)
    }
  },
  watch:{
      msg:{
          handler(val,oldVal){
            this.catchData(val)
          }
      },
      content(){
          this.msg = this.content
      }
  }
}
</script>

<style>
.preview{
  min-height: 150px;
}

.edui-default .edui-toolbar .edui-combox .edui-combox-body{
    line-height: 1;
}
.edui-default .edui-button-body, .edui-splitbutton-body, .edui-menubutton-body, .edui-combox-body{
    line-height: 1;
}
</style>