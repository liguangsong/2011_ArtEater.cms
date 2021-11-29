<template>
    <ckeditor ref="ykEditor" @input="change" :editor="editor" v-model="newValue" :config="editorConfig"></ckeditor>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue2'
// ⚠️ NOTE: We don't use @ckeditor/ckeditor5-build-classic any more!
// Since we're building CKEditor from source, we use the source version of ClassicEditor.
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';


import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';


import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Image from '@ckeditor/ckeditor5-image/src/image';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline";
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn'
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";
import Autoformat from "@ckeditor/ckeditor5-autoformat/src/autoformat"
import Base64UploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter";
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';
import ParagraphButtonUI from '@ckeditor/ckeditor5-paragraph/src/paragraphbuttonui';//段落分按钮
import HeadingButtonsUI from '@ckeditor/ckeditor5-heading/src/headingbuttonsui';//标题分按钮
import Clipboard from '@ckeditor/ckeditor5-clipboard/src/clipboard';//拖放
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';//撤销样式
import Table from '@ckeditor/ckeditor5-table/src/table';//表格
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';//表格工具栏
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';//表格
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';//单元格
import List from "@ckeditor/ckeditor5-list/src/list";
import TodoList from "@ckeditor/ckeditor5-list/src/todolist";
import Strikethrough from "@ckeditor/ckeditor5-basic-styles/src/strikethrough"; //删除线
import { forEach } from 'jszip';
export default {
  name: 'ykEditor',
  components: {
    // Use the <ckeditor> component in this view.
    ckeditor: CKEditor.component
  },
   props:{
    placeholder:{
      type:String,
      default:'请输入内容'
    },
    value:{
      type:String,
      default:''
    }
  },
  watch:{
    value: {
      handler(val) {
      this.$nextTick(()=>{
        this.newValue=this.value;
      });
      },
      deep:true,
      immediate:true
    }
  },
  data() {
    return {
      newValue:this.value,
      editor: ClassicEditor,
      editorConfig: {
        language:'zh-cn',
        placeholder: this.placeholder,
        plugins: [
          EssentialsPlugin,
          BoldPlugin,
          Base64UploadAdapter,
          ItalicPlugin,
          // LinkPlugin,
          ParagraphPlugin,
          Autoformat,
          Heading,

          FontColor,
          FontBackgroundColor,
          FontFamily,
          FontSize,
          PasteFromOffice,
          Image,
          Indent,
          Underline,
          Alignment,
          ImageResize,
          ImageInsert,
          HorizontalLine,
          ParagraphButtonUI,
          HeadingButtonsUI,
          Clipboard,
          RemoveFormat,
          Table, TableToolbar,
          TableProperties,
          TableCellProperties,
          Strikethrough,
          List,
          TodoList
        ],
        toolbar: {
          items: [
            //  'paragraph', 'heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6',
            // 'heading',
            // '|',
            'bold',
            'italic',
            // 'link',
            '|',
            'fontFamily',
            'fontSize',
            'fontColor',
            'fontBackgroundColor',
            'Image',
            'indent',
            'alignment',
            'underline',
            'ImageResize',
            'insertImage',
            'horizontalLine',
            'removeFormat',
            'insertTable',
            'tableProperties', 
            'tableCellProperties',
            'Strikethrough',
            'list',
            'todoList',
            'undo',
            'redo',
          ],
          // shouldNotGroupWhenFull:true //工具栏自动换行
        },
        table: {
            contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
        },
        //可以自定义配置
        heading: {
          options: [
            {model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph'},
            {model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1'},
            {model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2'},
            {model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3'},
            {model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4'},
            {model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5'},
            {model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6'}
          ]
        },

        fontFamily: {
          options: [
            'default',
            'PingFangSC-Medium',
            'PingFangSC-Semibold',
            'PingFangSC-Regular',
            '微软雅黑',
            '方正姚体',
            '仿宋',
            '黑体',
            '宋体',
            '仿宋_GB2312',
            '楷体',
            '楷体_GB2312',
            '隶书',
            '幼圆'
          ],
          supportAllValues: true
        },

        fontSize: {
          options: [
            'default',
                  12,
                  14,
                  16,
                  18,
                  20,
                  22,
                  24,
                  26,
                  28,
                  30,
                  32,
                  34,
                  36,
                  38 
          ],
          supportAllValues: true
        },

      }
    };
  },
  methods:{
    // base64转blob
        base64ToBlob (base64Data) {
            let arr = base64Data.split(','),
                fileType = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                l = bstr.length,
                u8Arr = new Uint8Array(l);
                
            while (l--) {
                u8Arr[l] = bstr.charCodeAt(l);
            }
            return new Blob([u8Arr], {
                type: fileType
            });
        },
        // blob转file
          blobToFile (newBlob, fileName) {
            newBlob.lastModifiedDate = new Date();
            newBlob.name = fileName;
            return newBlob;
        },
        
    async change(val) {
      let newContent = val.match(/<img src="data:image[^>]*>/gi);
      console.log(newContent,765)
      if(newContent){ 
        var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
        let promises=[];
           for(let i=0;i<newContent.length;i++){
             let item=newContent[i];
              var arr = item.match(srcReg);  // arr 为包含所有img标签的数组
              let arr1=JSON.parse(JSON.stringify(arr[1]));
                  console.log(122)
                  // 调用
                  const blob = await this.base64ToBlob(arr[1]);
                  const file = await this.blobToFile(blob, (new Date().getTime())+"_upPic");
                  let parseFile = new this.ParseServer.File(file.name, file);
                  let p = new Promise(async (resolve, reject) => {
                    parseFile.save().then((res) => {
                        if (res._url) {
                          if(val.indexOf(arr1)!=-1){
                            val=val.replace(arr1,res._url);
                            resolve(res._url)
                          }
                        }
                        }).catch((err)=>{
                           reject(err)
                        })
                  })
                  promises.push(p)
           }
           Promise.all(promises).then((result) => {
             console.log(result,443333)
             let arrs=[].concat.apply([],result);
                 this.$emit('change',val)
                  }).catch((error) => {
                    uni.showToast({
                      title:'图片上传有误'
                    })
                  })
      }else{
        console.log(val,'rrrrrr')
        this.$emit('change',val)
      }
          
         
    }
  }
}
</script>


<style>
  /*编辑框最低高度*/
  .ck-editor__editable{
    min-height: 400px;
    max-height: 500px;
  }
</style>