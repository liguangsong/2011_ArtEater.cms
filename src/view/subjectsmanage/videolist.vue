<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix" style="display:flex">
        <div class="search-wrap clear-fix" style="flex:1">
            <div class="search-keyword" style="width:360px">
                <span style="width:50px;padding:0 5px">关键字 </span>
                <Input v-model="search_keyword" size="large" placeholder="请输入ID/视频名称/套课名称" style="width:300px" />
            </div>
            <!-- <div class="select-choice clear-fix" style="width:170px">
                <span style="width:50px;padding:0 5px">状态 </span>
                <Select size="large" v-model="search_state" class="choice" placeholder="状态" :clearable="true" style="width:100px">
                    <Option :value="-1" :key="-1">全部</Option>
                    <Option :value="1" :key="1">已上架</Option>
                    <Option :value="0" :key="0">已下架</Option>
                </Select>
            </div> -->
            <div class="search-btn" style="width:100px;margin:0">
                <Button type="primary" @click="search" size="large">查询</Button>
            </div>
        </div>
        <div class="operation-wrap" style="width:175px">
            <Button style="margin-right:10px" type="primary" @click="handleAddvideo">添加</Button>
        </div>
    </div>
    <Row class="table-wrap">
        <Table :loading="loading" :columns="columns" :data="data">
            <template slot-scope="{ row }" slot="img">
                <div style="margin:5px 0"><img v-if="row.img" :videoSrc="row.img" @click="handleShowImg(row)" width="84" height="38"></div>
            </template>
            <template slot-scope="{ row }" slot="state">
                <span v-if="row.state==0">已下架</span>
                <span v-if="row.state==1">已上架</span>
            </template>
            <template slot-scope="{ row }" slot="courseIds">
                <strong v-for="(_sub,_idx) in row.courseIds">{{getCourseName(_sub)+(_idx==row.courseIds.length-1?'':'；')}}</strong>
            </template>
            <template slot-scope="{ row }" slot="action">
                <Button type="info" size="small" style="margin-right:5px" @click="handleShowDetail(row)">查看</Button>
                <Button type="warning" size="small" style="margin-right:5px" @click="handleShowEdit(row)">编辑</Button>
                <Button type="error" size="small" @click="handleDelete(row)">删除</Button>
            </template>
        </Table>
        <div class="page-wrap">
            <Page :total="total" :pageSize="pageSize" @on-change="pagechange"  v-if="total!=0" />
        </div>
    </Row>
    <Modal v-model="show_window" :loading="editLoading" :title="window_title" width="600" @on-ok="add_video">
      <Form v-if="show_window" :model="form" label-position="right" :label-width="100" ref="form" :rules="ruleValidate">
        <!-- <FormItem label="视频" prop="videoSrc">
            <div>
                <video ref="myVideo" v-show="form.videoSrc" v-model="form.videoSrc" :src="form.videoSrc" controls="controls"  style="width:300px" crossorigin="*"></video>
                <canvas ref="myCanvas" width="750" height="422" style="border:1px solid #d3d3d3;position:absolute;left:-10000px">
                  您的浏览器不支持 HTML5 canvas 标签。
                </canvas>
            </div>
            <myUpload @complate="handleUploadComplate" tips="请选择视频文件" accept="video/*"></myUpload>
        </FormItem> -->
        <FormItem label="视频封面图" prop="coverUrl">
          <div>
              <img v-if="form.coverUrl" :src="form.coverUrl" width="375" height="296"/>
          </div>
          <myUpload @complate="handleUploadComplate1" tips="（推荐尺寸750*592）"></myUpload>
        </FormItem>
        <FormItem label="视频地址" prop="videoSrc">
          <Input v-model="form.videoSrc" placeholder="请输入视频地址"  style="width:400px"></Input>
        </FormItem>
        <FormItem label="视频名称" prop="title">
          <Input v-model="form.title" placeholder="请输入视频名称"  style="width:400px"></Input>
        </FormItem>
        <FormItem label="套课" prop="courseIds">
          <selectTree v-if="show_window" id="mySelectTree" v-model="form.courseIds" multiple :treeData="courseTreeData" style="width:400px"></selectTree>
        </FormItem>
        <!-- <FormItem label="链接">
          <Input v-model="form.href" placeholder="请输入跳转链接"  style="width:400px"></Input>
        </FormItem> -->
        <FormItem label="视频介绍">
          <Input type="textarea" :rows="6" v-model="form.remark" placeholder="请输入视频介绍"  style="width:400px"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal width="740" title="查看大图" v-model="isShowImg">
        <div style="margin:5px 0;text-align:center"><img :videoSrc="currImg" width="690" height="320"></div>
    </Modal>
    <Modal v-model="isShowDetail" title="查看视频详情" mask scrollable width="600">
      <Form :model="form" label-position="right" :label-width="100" ref="form">
        <FormItem label="视频" prop="videoSrc">
            <div>
                <video v-if="form.videoSrc" v-model="form.videoSrc" :src="form.videoSrc" controls="controls"  style="width:300px"></video>
            </div>
        </FormItem>
        <FormItem label="视频链接" prop="title">
          {{form.videoSrc}}
        </FormItem>
        <FormItem label="视频封面图" prop="videoSrc">
            <div>
                <img v-if="form.coverUrl" :src="form.coverUrl" width="375" height="296"/>
            </div>
        </FormItem>
        <FormItem label="视频名称" prop="title">
          {{form.title}}
        </FormItem>
        <FormItem label="套课" prop="courseIds">
          <!-- <selectTree id="mySelectTree" v-model="form.courseIds" multiple :treeData="courseTreeData" style="width:400px"></selectTree> -->
          <span v-for="(_sub,_idx) in form.courseIds">{{getCourseName(_sub)+(_idx==form.courseIds.length-1?'':'；')}}</span>
        </FormItem>
        <!-- <FormItem label="链接">
          {{form.href}}
        </FormItem> -->
        <FormItem label="视频介绍">
          {{form.remark}}
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { tool } from '@/api/tool'
import { verification } from "@/api/verification";
import selectTree from '@/components/iview-select-tree'
import myUpload from "@/components/myUpload"
export default {
    name: "messageindex",
    components:{
        myUpload,
        selectTree
    },
  data () {
    return {
        page: 1,
        pageSize: 10,
        total: 0,
        loading: true,
        editLoading: true,
        isShowImg: false,
        isShowDetail: false,
        currImg: '',
        message_id: "",
        window_title: "添加视频",
        show_window: false,
        courses: [],
        courseTreeData: [],
        search_keyword: "",
        search_state: -1,
        columns: [
            { title: "ID", key:'id', width: 130 },
            { title: "视频名称", key: "title" },
            { title: "套课名称", key: "courseName", slot: 'courseIds' },
            // { title: "链接", key: "href" },
            { title: "更新时间",key: "updatedAt", width:180 },
            { title: "更新人",key: "updatedBy", width: 100 },
            { title: "操作", key: "action", slot:'action', align: "center" , width: 200}
        ],
        data: [],
        form: {
            id:'',
            title: '',
            courseIds: [],
            videoSrc: '',
            coverUrl: '',
            href: '',
            updatedBy:'',
            remark: ''
        },
        ruleValidate: {
            title:  [{ required: true, message: '请输入视频名称', trigger: 'blur' },{ required: true, message: '请输入视频名称', trigger: 'change' }],
            videoSrc: [{required: true, message: "请输入视频地址", trigger: "change", validator: verification.validateIsNull}],
            coverUrl: [{required: true, message: "请上传视频封面图", trigger: "change", validator: verification.validateIsNull}],
            courseIds: [{required: true, message: "请选择套课", trigger: "change", validator: verification.validateArrayIsNull}],
            // videoSrc: [{required: true, message: "请输入链接", trigger: "blur", validator: verification.validateIsNull}],
            // sort: [{required: true, message: "请输入排序", trigger: "blur", validator: verification.validateIsNull}],
        },
        init_data: ""
    };
  },
  mounted () {
    var self = this
    this.bindCourseTree()
    this.page_list();
  },
  methods: {
    /** 查看 */
    handleShowDetail(row){
        this.form.id = row.id;
        this.get_entity();
        this.isShowDetail = true;
        this.window_title = "查看";
    },
    /** 编辑 */
    handleShowEdit(row){
      var self = this
        this.form.id = row.id;
        this.get_entity();
        this.show_window = true;
        this.window_title = "编辑视频";
    },
    handleVideoComlate(){
      debugger

    },
      /** 添加video */
    handleAddvideo() {
        this.form = {
            id:'',
            title: '',
            courseIds: [],
            videoSrc: '',
            coverUrl: '',
            href: '',
            updatedBy:'',
            remark: ''
        },
        this.window_title = "添加视频";
        this.show_window = true
    },
    
    /** 获取科目名称 */
    getCourseName(id){
        var course = this.courses.find(item=>{
            return item.id == id
        })
        return course?course.get('courseName'):'';
    },
    handleShowImg(row){
        this.isShowImg = true
        this.currImg = row.img
    },
    
    /** 加载树形科目 */
    bindCourseTree(){
        var self = this
        var query = new this.ParseServer.Query("Courses")
        query.limit(10000)
        query.ascending('createdAt')
        query.find().then(res=>{
            this.courses = res
            var tree = self.initCourseTree(res,'0')
            self.courseTreeData = tree
        })
    },
    /** 构造树形科目 */
    initCourseTree(courses, parentId){
        var self = this
        var treeValue = []
        let _subjects = courses.filter((_item)=>{
            return _item.get('parent_ID') == parentId
        })
        _subjects.forEach((_course, _index)=> {
            let course = {
                title: _course.get('courseName'),
                value: _course.id,
            }
            let childrens = courses.filter(_item=>{
                return _item.get('parent_ID') == _course.id
            })
            if(childrens.length>0){
                course.children = self.initCourseTree(courses, _course.id)
            }
            treeValue.push(course)
        })
        return treeValue
    },
    /** 图片上传完成 */
    handleUploadComplate1(urls){
      this.form.coverUrl = urls
    },
    /**
     * 视频上传完成
     */
    handleUploadComplate(urls){
      var self = this
      this.form.videoSrc = urls
      this.$nextTick(()=>{
        var _canvas= self.$refs.myCanvas
        var ctx = _canvas.getContext('2d');
        var video = self.$refs.myVideo
        video.crossOrigin = "anonymous"
        // 监听可播放
        video.addEventListener('canplay', function() {
          setTimeout(function(){
              // 相应视频的宽和高
              var _width = video.videoWidth
              var _height = video.videoHeight
              if(_width/_height < 750/422) {
                ctx.drawImage(video, Math.abs(750 - _width)/2, 0, _width, 422)
              } else {
                ctx.drawImage(video, 0, Math.abs(422 - _height)/2 , 750, _height)
              }
              // 绘制视频到canvas上
              var data = ctx.canvas.toDataURL()
              var parseFile = new self.ParseServer.File('cover.jpg', {base64: data});
              parseFile.save().then(res=>{
                self.form.coverUrl = res._url
              })
          }, 100)
        },false)
      })
    },

    /*
     *发布消息
     *作者：gzt
     *时间：2020-11-22 14:50:34
     */
    add_video () {
        var self = this
        self.$refs["form"].validate(valid => {
            if (!valid) {
                self.$Message.error('请检查表单项')
                self.editLoading = false
                setTimeout(() => {
                    self.editLoading = true
                }, 100)
                return false
            } else {
                var videos = self.ParseServer.Object.extend("Video");
                var video = new videos();
                if (self.form.id) {
                    video.set("id", self.form.id);
                }
                let realName = self.ParseServer.User.current().get('realname')
                video.set("title", self.form.title);
                video.set("videoSrc", self.form.videoSrc);
                video.set('coverUrl', self.form.coverUrl);
                video.set("courseIds", self.form.courseIds);
                video.set("href", self.form.href);
                video.set("updatedBy", realName);
                video.set("remark", self.form.remark);
                video.save().then(response => {
                    this.$Message.success("保存成功");
                    self.show_window = false
                    self.page_list();
                },
                error => {
                    this.$Message.error("保存失败");
                }
            );
            }
        });
    },

    /*
     *获取消息
     *作者：gzt
     *时间：2020-11-22 09:21:48
     */
    get_entity () {
      var query = new this.ParseServer.Query("Video");
      query.get(this.form.id).then(res => {
        this.form.id = res.id
        this.form.title = res.get('title')
        this.form.courseIds = res.get('courseIds')
        this.form.videoSrc = res.get('videoSrc')
        this.form.coverUrl = res.get('coverUrl')
        this.form.href = res.get('href')
        this.form.updatedBy = res.get('updatedBy')
        this.form.remark = res.get('remark')
      });
    },

    /*
     *搜索数据
     *作者：gzt
     *时间：2020-11-21 23:30:19
     */
    search () {
      this.page = 1;
      this.page_list();
    },
    pagechange(e){
      this.page = e
      this.page_list()
    },
    /*
     *分页加载数据
     *作者：gzt
     *时间：2020-11-21 23:30:27
     */
    page_list (page_index) {
        var self = this
        this.loading = true;
        let query1 = new this.ParseServer.Query("Video");
        query1.contains('title', this.search_keyword)

        let query2 = new this.ParseServer.Query("Video");
        query2.contains('objectId', this.search_keyword)

        let query3 = new this.ParseServer.Query("Video");
        var _courses = []
        this.courses.forEach(t=>{
          if(t.get('courseName').indexOf(this.search_keyword) != -1) {
            _courses.push(t.id)
          }
        })
        if(_courses.length > 0 && this.search_keyword) {
          query3.containedIn('courseIds', _courses)
        } else {
          query3.containedIn('courseIds', _courses)
        }
        var query = this.ParseServer.Query.or(query1, query2, query3);
        query.descending("createdAt");
        query.count().then(count => {
            self.total = count;
        });
        query.skip((this.page - 1) * this.pageSize);
        query.limit(this.pageSize);
        query.find().then(list => {
          this.data = [];
          if (list && list.length > 0) {
            this.data = list.map(item => {
              var _data = {
                id: item.id,
                title: item.get("title"),
                href: item.get("href"),
                videoSrc: item.get("videoSrc"),
                courseIds: item.get('courseIds'),
                remark: item.get("remark"),
                updatedBy: item.get('updatedBy'),
                createdAt: item.get("createdAt"),
                coverUrl: item.get('coverUrl'),
                updatedAt: tool.dateFormat(item.get('updatedAt'), 'yyyy-MM-dd HH:mm:ss'),
              };
              return _data;
            });
          }
          this.loading = false;
        },
        error => {
            console.log(error);
            this.$Message.error("获取失败");
        }
      );
    },

    /*
     * 删除消息
     *作者：gzt
     *时间：2020-11-22 08:41:53
     */
    handleDelete (row) {
      if(row.state==1){
        this.$Message.error("请先下架");
        return false
      }
      let _this = this;
      this.$Modal.confirm({
        title: "删除提示",
        content: "<p>删除消息后将无法恢复，确定要删除吗？</p>",
        onOk: () => {
          var query = new this.ParseServer.Query("Video");
          query.get(row.id).then(
            response => {
              response.destroy().then(
                delete_result => {
                  this.$Message.success("删除成功");
                  this.page = 1
                  this.page_list();
                },
                error => {
                  this.$Message.error("删除失败");
                }
              );
            },
            error => {
              this.$Message.error("清确保删除的数据真实存在");
            }
          );
        },
        onCancel: () => {
          this.$Message.info("取消了操作");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.search-wrap {
  float: left;
  width: 60%;
  .search-keyword {
    float: left;
    width: 40%;
  }
  .select-choice {
    float: left;
    width: 35%;
    span {
      width: 20%;
      display: inline-block;
      box-sizing: border-box;
      line-height: 36px;
      padding: 0 10px;
      text-align: right;
    }
    .choice {
      width: 80%;
    //   float: right;
    }
  }
  .search-btn {
    float: left;
    width: 20%;
    margin: 0 20px;
  }
}

.operation-wrap {
  width: 40%;
  text-align: right;
  .func {
    // float: right;
    margin-left: 10px;
  }
}
.comments{
    overflow-y: auto;
    width: 400px!important;
}
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
</style>
