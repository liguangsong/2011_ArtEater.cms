<template>

 <div class="editor-box vue-container" style="width:500px!important;height:400px!important;border:1px solid black">
     <!-- <div class="vuefor" v-for="i in editorData.length+1" v-on:click="hidecolorbox(i-1)"> -->
    <div class="vuefor" v-on:click="hidecolorbox(i-1)">
         <div class="tool-box">
             <div class="tool-box-sub">
                 <div class="tool-list">
                     <div v-if="reload">
                         <input type="file" style="display:none" v-on:change.stop="uploadfile(i-1)" v-bind:id="buildfileid(i-1)" v-bind:name="buildfileid(i-1)" multiple="multiple">
                     </div>
                     <label class="tool-item" v-on:click.stop="itemadd(i-1,1)">
                         <div class="icon"><img src="../../assets/images/icon/icon-font.png" alt="" /></div>
                         <div class="text">文字</div>
                     </label>
                     <!--v-on:click.stop="itemadd(i-1,2)"-->
                     <label class="tool-item" v-bind:for="buildfileid(i-1)">
                         <div class="icon"><img src="../../assets/images/icon/icon-img.png" alt="" /></div>
                         <div class="text">图片</div>
                     </label>
                     <label class="tool-item" v-on:click.stop="itemadd(i-1,3)">
                         <div class="icon"><img src="../../assets/images/icon/icon-line.png" alt="" /></div>
                         <div class="text">分割</div>
                     </label>
                     <label class="tool-item enabled" v-on:click.stop="itemadd(i-1,4)">
                         <div class="icon"><img src="../../assets/images/icon/icon-video.png" alt="" /></div>
                         <div class="text">视频</div>
                     </label>
                     <label class="tool-item enabled" v-on:click.stop="itemadd(i-1,5)">
                         <div class="icon"><img src="../../assets/images/icon/icon-link.png" alt="" /></div>
                         <div class="text">链接</div>
                     </label>
                 </div>
             </div>
         </div>
         <!-- <div class="editor-item" v-if="i <= editorData.length"> -->
        <div class="editor-item">
             <div class="head">
                 <div class="h-btn fleft" v-on:click.stop="itemup(i-1)">
                     <img src="../../assets/images/icon/icon-up.png" />
                 </div>
                 <div class="h-btn fleft" v-on:click.stop="itembottom(i-1)">
                     <img src="../../assets/images/icon/icon-bottom.png" />
                 </div>
                 <div class="h-btn fright" v-on:click.stop="itemdel(i-1)">
                     <img src="../../assets/images/icon/icon-del.png" />
                 </div>
             </div>
             <div class="content" v-if="editorData[i-1].mytype==1">
                 <!--文字类型的输入框-->
                 <div class="text-box">
                     <div class="head">
                         <div title="加粗" v-on:click.stop="fontweight(i-1)" v-bind:class="{ 'head-btn': true,'sel':editorData[i-1].font.weight==1 }"><img src="../../assets/images/icon/icon-font-weight.png" alt="" /></div>
                         <div title="放大字体" v-on:click.stop="fontda(i-1)" v-bind:class="{ 'head-btn': true}"><img src="../../assets/images/icon/icon-font-da.png" alt="" /></div>
                         <div title="缩小字体" v-on:click.stop="fontxiao(i-1)" v-bind:class="{ 'head-btn': true}"><img src="../../assets/images/icon/icon-font-xiao.png" alt="" /></div>
                         <div title="删除线" v-on:click.stop="fontdel(i-1)" v-bind:class="{ 'head-btn': true,'sel':editorData[i-1].font.del==1 }"><img src="../../assets/images/icon/icon-font-del.png" alt="" /></div>
                         <div title="下划线" v-on:click.stop="fontline(i-1)" v-bind:class="{ 'head-btn': true,'sel':editorData[i-1].font.line==1 }"><img src="../../assets/images/icon/icon-font-line.png" alt="" /></div>
                         <div title="居中" v-on:click.stop="fontcenter(i-1)" v-bind:class="{ 'head-btn': true,'sel':editorData[i-1].font.center==1 }"><img src="../../assets/images/icon/icon-font-center.png" alt="" /></div>
                         <div title="字体颜色" v-on:click.stop="fontshowcolor(i-1)" v-bind:class="{ 'head-btn': true }" v-bind:style="initfontcolor(editorData[i-1].font)">
                             <img src="../../assets/images/icon/icon-font-color.png" alt="" />
                             <div v-on:click.stop="stopclick" class="color-box" v-bind:class="{'hide':editorData[i-1].font.showcolor!=1}">
                                 <div class="color-title">
                                     字体颜色
                                 </div>
                                 <div class="color-list">
                                     <div class="color-item" v-for="color in colors">
                                         <span v-on:click.stop="fontsetcolor(i-1,color)" v-bind:style="initbgcolor(color)"></span>
                                     </div>
                                 </div>
                                 <div class="color-title">
                                     字体颜色代码
                                 </div>
                                 <div class="color-input">
                                     <input type="text" v-model="editorData[i-1].font.color" />
                                 </div>
                                 <!--<div class="color-title">
                                     字体背景颜色
                                 </div>
                                 <div class="color-list">
                                     <div class="color-item" v-for="color in colors">
                                         <span v-on:click.stop="fontsetcolor(i-1,color)" v-bind:style="initbgcolor(color)"></span>
                                     </div>
                                 </div>
                                 <div class="color-title">
                                     字体背景颜色代码
                                 </div>
                                 <div class="color-input">
                                     <input type="text" v-model="editorData[i-1].font.bgcolor" />
                                 </div>-->
                             </div>
                        </div>
                     </div>
                     <div class="line"></div>
                     <div class="input">
                         <textarea name="" rows="" cols="" v-bind:style="initstyle(editorData[i-1].font)" v-model="editorData[i-1].content"></textarea>
                     </div>
                     <div class="line"></div>
                 </div>
             </div>
 
             <div class="content" v-if="editorData[i-1].mytype==2" style="">
                 <!--图片-->
                 <div class="img-box">
                     <img v-if="editorData[i-1].loading==1" v-bind:src="editorData[i-1].content" alt="" />
                     <!-- <img class="loading" v-if="editorData[i-1].loading==0" src="../../assets/images/icon/img_loading.gif" alt="" /> -->
                 </div>
             </div>
 
             <div class="content" v-if="editorData[i-1].mytype==3">
                 <!--分割线-->
                 <div class="line-box">
                 </div>
             </div>
 
            <div class="clear" style=""></div>
         </div>
     </div>
 </div>
</template>
<script>
    var pageData = {
    };
    export default {
    name: 'Richbox',
    props: {
        value: {
        type: Array,
        default () {
            return []
        }
        }
    },
    /**
     * Events
     * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
     * @on-cancel-edit 返回值 {Object} 同上
     * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
     */
        data: function(){
            return {
                editorData: [],
                colors: [
                    "#000",
                    "#7F7F7F",
                    "#880015",
                    "#ED1C24",
                    "#FF7F27",
                    "#FFF200",
                    "#22B14C",
                    "#3F48CC",
                    "#E36C09",
                    "#31859B",
                    "#5F497A",
                    "#76923C",
                    "#953734",
                    "#366092",
                    "#938953",
                    "#fff"
                ],
                reload:true
            }
        },
        methods: {
            //生成一个fileid
            buildfileid: function (index) {
                return "file" + index;
            },
            initstyle: function (font) {
                var stylestr = "";
                var fontsize = 18;
                fontsize += font.size * 3;
                stylestr += "font-size: " + fontsize + "px;"
                if (font.weight == 1) stylestr += "font-weight: bold;"
                if (font.del == 1) stylestr += "text-decoration:line-through;"
                if (font.line == 1) stylestr += "text-decoration:underline;"
                if (font.center == 1) stylestr += "text-align: center;"
                if (font.color) stylestr += ("color:" + font.color + ";");
                if (font.bgcolor) stylestr += ("display: inline;background-color:" + font.bgcolor + ";");
                return stylestr;
            },
            //字体的颜色
            initfontcolor: function (font) {
                var result = "";
                result += "color:";
                result += font.color;
                result += ";";
                result += "background-color:";
                result += font.bgcolor;
                result += ";";
                return result;
            },
            //字体背景的颜色
            initbgcolor: function (color) {
                return "background-color:" + color;
            },
            //加粗或者取消嘉措
            fontweight: function (index) {
                this.editorData[index].font.weight = (this.editorData[index].font.weight == 1 ? 0 : 1);
            },
            //字体加大
            fontda: function (index) {
                this.editorData[index].font.size++;
            },
            //字体减小
            fontxiao: function (index) {
                this.editorData[index].font.size--;
            },
            //删除线
            fontdel: function (index) {
                this.editorData[index].font.del = (this.editorData[index].font.del == 1 ? 0 : 1);
            },
            //下划线
            fontline: function (index) {
                this.editorData[index].font.line = (this.editorData[index].font.line == 1 ? 0 : 1);
            },
            //居中显示
            fontcenter: function (index) {
                this.editorData[index].font.center = (this.editorData[index].font.center == 1 ? 0 : 1);
            },
            fontshowcolor: function (index) {
                this.editorData[index].font.showcolor = (this.editorData[index].font.showcolor == 1 ? 0 : 1);
            },
            //选择字体颜色
            fontsetcolor: function (index, color) {
                this.editorData[index].font.color = color;
                this.hidecolorbox(index);
            },
            //隐藏颜色选择框
            hidecolorbox: function (index) {
                if (this.editorData && this.editorData.length > index && this.editorData[index].mytype == 1)
                    this.editorData[index].font.showcolor = 0;
            },
            //上传图片
            uploadfile: function (index) {
                //用于强制重新渲染 input.file 用于清空之前的文件 ^_^
                this.reload = false;
                //添加一个组ID，方便后面上传完成后识别应该更新哪条数据
                var groupid = guid();
                var that = this;
                var fileid = "file" + index;
                var files = $("#" + fileid)[0].files;
                for (var i = 0; i < files.length; i++) {
                    that.itemadd(index + i, 2, groupid);
                }
                jQuery.ajaxFileUpload({
                    url: '@Url.Content("~/img/uploadproductdpicArray?path=dyProductImgs")', //用于文件上传的服务器端请求地址
                    secureuri: false, //是否需要安全协议，一般设置为false
                    fileElementId: fileid, //文件上传域的ID
                    dataType: 'json', //返回值类型 一般设置为json
                    success: function (data)  //服务器成功响应处理函数
                    {
                        //var result = JSON.parse(data);
                        this.reload = true;
                        var result = data;
                        if (result.resultState == "1") {
                            var j = 0;
                            for (var i = 0; i < this.editorData.length; i++) {
                                if (this.editorData[i].groupid && this.editorData[i].groupid == groupid) {
                                    this.editorData[i].content = "@Url.Content('~')" + result.Data[j].substring(1);
                                    this.editorData[i].loading = 1;
                                    j++;
                                }
                            }
                        }
                        else alert("上传失败！");
                    },
                    error: function (data)//服务器响应失败处理函数
                    {
                        alert("上传失败！");
                    }
                });
            },
            //上升模块
            itemup: function (index) {
                if (index > 0) {
                    var itemData = this.editorData[index];
                    this.editorData.splice(index, 1);
                    this.editorData.splice(index - 1, 0, itemData);

                }
            },
            //下降模块
            itembottom: function (index) {
                if (index + 1 < this.editorData.length) {
                    var itemData = this.editorData[index];
                    this.editorData.splice(index, 1);
                    this.editorData.splice(index + 1, 0, itemData);

                }
            },
            //删除模块
            itemdel: function (index) {
                this.editorData.splice(index, 1);
            },
            //添加一个新的模块
            itemadd: function (index, type, groupid) {
                var itemData = null;
                switch (type) {
                    case 1:
                        itemData = {
                            mytype: 1,
                            content: "",
                            font: {
                                size: 0, //字体大小 每+1 字体+2px -1同减
                                weight: 0, //是否加粗
                                del: 0, //是否删除线
                                line: 0, //是否下划线
                                center: 0, //是否居中
                                color: "#000", //字体颜色
                                bgcolor: "#fff", //字体颜色
                                showcolor: 0 //是否显示颜色选择框
                            }
                        };
                        break;
                    case 2:
                        itemData = {
                            mytype: 2,
                            content: "res/img/1.jpg",
                            loading: 0 //是否已经成功上传
                        };
                        break;
                    case 3:
                        itemData = {
                            mytype: 3,
                            content: ""
                        };
                        break;
                    default:
                        alert('暂不支持');
                        break;
                }
                if (itemData) {
                    if (groupid) itemData.groupid = groupid;
                    this.editorData.splice(index, 0, itemData);
                }
            },
            // //一个用于阻止冒泡的事件
            stopclick: function () { },
        },
        //实例被调用后
        created: function () {

        },
        //el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。
        updated: function () {
            this.$nextTick(function () {
                ////console.log(pageData);
                //var files = this.$refs.feedbakcImg;
                //for (var i = 0; i < files.length; i++) {
                //    files[i].clearFiles();
                //}
            })
        }
    }
</script>
<style>
.editor-box{
    width: 500rpx;
    height: 400rpx;
}
.vuefor{
    width: 100%;
}
.vuefor .tool-box{
    width: 100%;
}
.vuefor .tool-box .tool-box-sub{
    width: 100%;
}
.vuefor .tool-box .tool-box-sub .tool-list{
    width: 100%;
    text-align: center;
}
.vuefor .tool-box .tool-box-sub .tool-list .tool-item{
    width: 60px;
    height: 80px;
    text-align: center;
}
.vuefor .tool-box .tool-box-sub .tool-list .tool-item .icon{
    width: 50px;
    height: 50px;
    line-height: 50px;
    border: 1px;
    border-style: dashed;
    border-color: black;
    display: inline-block;
}
.vuefor .tool-box .tool-box-sub .tool-list .tool-item .icon img{
    width: 30px;
    height: 30px;
    vertical-align: middle;
}
.vuefor .tool-box .tool-box-sub .tool-list .tool-item .text{
    width: 50px;
    height: 50px;
    text-align: center;
}
</style>