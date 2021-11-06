<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix" style="display:flex">
      <div class="search-wrap clear-fix" style="flex:1">
        <div class="search-keyword" style="width:260px">
          <span style="width:50px;padding:0 5px">关键字 </span>
          <Input
            v-model="search_keyword"
            size="large"
            placeholder="请输入ID/标题"
            style="width:200px"
          />
        </div>
        <div class="search-keyword" style="width:310px">
          <span style="width:100px;padding:0 5px">推荐套课名称 </span>
          <Input
            v-model="search_courseName"
            size="large"
            placeholder="请输入推荐套课名称"
            style="width:200px"
          />
        </div>
        <div class="search-btn" style="width:100px;margin:0">
          <Button type="primary" @click="search" size="large">查询</Button>
        </div>
      </div>
      <div class="operation-wrap" style="width:175px">
        <Button style="margin-right:10px" type="primary" @click="handleAddvideo"
          >添加</Button
        >
      </div>
    </div>
    <Row class="table-wrap">
      <Table :loading="loading" :columns="columns" :data="data">
        <template slot-scope="{ row }" slot="headImg">
          <div style="margin:5px 0">
            <img
              v-if="row.headImg"
              :src="row.headImg"
              @click="handleShowImg(row)"
              width="84"
              height="70"
            />
          </div>
        </template>
        <template slot-scope="{ row }" slot="state">
          <span v-if="row.state == 0">已下架</span>
          <span v-if="row.state == 1">已上架</span>
        </template>
        <template slot-scope="{ row }" slot="courseId">
          <strong>{{ getCourseName(row.courseId) }}</strong>
        </template>
        <template slot-scope="{ row }" slot="videoId">
          <strong>{{ row.videoName }}</strong>
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button
            type="info"
            size="small"
            style="margin-right:5px"
            @click="handleShowDetail(row)"
            >查看</Button
          >
          <Button
            type="warning"
            size="small"
            style="margin-right:5px"
            @click="handleShowEdit(row)"
            >编辑</Button
          >
          <Button type="error" size="small" @click="handleDelete(row)"
            >删除</Button
          >
        </template>
      </Table>
      <div class="page-wrap">
        <Page
          :total="total"
          :pageSize="pageSize"
          @on-change="pagechange"
          v-if="total != 0"
        />
      </div>
    </Row>
    <Modal
      v-model="show_window"
      :loading="editLoading"
      :title="window_title"
      width="600"
      @on-ok="add_video"
    >
      <Form
        v-if="show_window"
        :model="form"
        label-position="right"
        :label-width="100"
        ref="form"
        :rules="ruleValidate"
      >
        <FormItem label="图片" prop="headImg">
          <div>
            <img
              v-if="form.headImg"
              :src="form.headImg"
              width="375"
              height="342"
            />
          </div>
          <myUpload
            @complate="handleUploadComplate"
            tips="（推荐尺寸434*342px）"
            accept="image/*"
          ></myUpload>
        </FormItem>
        <FormItem label="标题" prop="title">
          <Input
            v-model="form.title"
            placeholder="请输入标题"
            style="width:400px"
          ></Input>
        </FormItem>
        <FormItem label="推荐套课" prop="courseId">
          <selectTree
            v-if="show_window"
            id="mySelectTree"
            @change="handleChangeCouse"
            v-model="form.courseId"
            :treeData="courseTreeData"
            style="width:400px"
          ></selectTree>
        </FormItem>
        <FormItem label="推荐课程" prop="videoId">
          <Select
            ref="myVideo"
            v-model="form.videoId"
            style="width:400px"
            not-found-text="暂无课程"
            :clearable="true"
          >
            <Option
              v-for="video in videoList"
              :value="video.objectId"
              :key="video.objectId"
              >{{ video.title }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="链接">
          <Input
            v-model="form.href"
            placeholder="请输入跳转链接"
            style="width:400px"
          ></Input>
        </FormItem>
        <!-- <FormItem label="视频介绍">
          <Input type="textarea" :rows="6" v-model="form.remark" placeholder="请输入视频介绍"  style="width:400px"></Input>
        </FormItem> -->
      </Form>
    </Modal>
    <Modal width="740" title="查看大图" v-model="isShowImg">
      <div style="margin:5px 0;text-align:center">
        <img :videoSrc="currImg" width="690" height="320" />
      </div>
    </Modal>
    <Modal v-model="isShowDetail" title="查看详情" mask scrollable width="600">
      <Form
        v-if="isShowDetail"
        :model="form"
        label-position="right"
        :label-width="100"
        ref="form"
      >
        <FormItem label="图片" prop="headImg">
          <div>
            <img
              v-if="form.headImg"
              :src="form.headImg"
              width="375"
              height="342"
            />
          </div>
        </FormItem>
        <FormItem label="标题" prop="title">
          {{ form.title }}
        </FormItem>
        <FormItem label="推荐套课" prop="courseId">
          {{ getCourseName(form.courseId) }}
        </FormItem>
        <FormItem label="推荐课程" prop="videoId">
          {{ form.videoName }}
        </FormItem>
        <FormItem label="链接">
          {{ form.href }}
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { tool } from "@/api/tool";
import { verification } from "@/api/verification";
import selectTree from "@/components/iview-select-tree";
import myUpload from "@/components/myUpload";
export default {
  name: "messageindex",
  components: {
    myUpload,
    selectTree
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      editLoading: true,
      isShowImg: false,
      isShowDetail: false,
      currImg: "",
      message_id: "",
      window_title: "添加视频",
      show_window: false,
      courses: [],
      videoList: [],
      courseTreeData: [],
      search_keyword: "",
      search_courseName: "",
      search_state: -1,
      columns: [
        { title: "ID", key: "id", width: 120 },
        { title: "图片", key: "headImg", slot: "headImg" },
        { title: "标题", key: "title" },
        { title: "推荐套课名称", key: "courseName", slot: "courseId" },
        { title: "推荐课程名称", key: "videoName" },
        { title: "链接", key: "href" },
        { title: "更新时间", key: "updatedAt", width: 180 },
        { title: "更新人", key: "updatedBy", width: 100 },
        {
          title: "操作",
          key: "action",
          slot: "action",
          align: "center",
          width: 200
        }
      ],
      data: [],
      form: {
        id: "",
        title: "",
        courseId: "",
        videoId: "",
        videoName: "",
        headImg: "",
        href: "",
        updatedBy: "",
        remark: ""
      },
      ruleValidate: {
        title: [
          { required: true, message: "请输入推荐标题", trigger: "blur" },
          { required: true, message: "请输入推荐标题", trigger: "change" }
        ],
        headImg: [
          {
            required: true,
            message: "请上传图片",
            trigger: "change",
            validator: verification.validateIsNull
          }
        ]
        // courseId: [{required: true, message: "请选择套课", trigger: "change", validator: verification.validateIsNull}],
        // videoId: [{required: true, message: "请选择课程", trigger: "change", validator: verification.validateIsNull}],
        // videoSrc: [{required: true, message: "请输入链接", trigger: "blur", validator: verification.validateIsNull}],
        // sort: [{required: true, message: "请输入排序", trigger: "blur", validator: verification.validateIsNull}],
      },
      init_data: ""
    };
  },
  mounted() {
    var self = this;
    this.bindCourseTree();
    this.page_list();
  },
  methods: {
    /** 查看 */
    handleShowDetail(row) {
      var self = this;
      this.form.id = row.id;
      var query = new this.ParseServer.Query("Recommend");
      query.get(this.form.id).then(res => {
        this.form.id = res.id;
        this.form.title = res.get("title");
        this.form.courseId = res.get("courseId");
        this.form.videoId = res.get("videoId");
        this.form.videoName = res.get("videoName");
        this.form.headImg = res.get("headImg");
        this.form.href = res.get("href");
        this.form.updatedBy = res.get("updatedBy");
        this.form.remark = res.get("remark");
        var query1 = new self.ParseServer.Query("Video");
        query1.containsAll("courseIds", [this.form.courseId]);
        query1.limit(10000);
        query1.find().then(videos => {
          self.videoList = JSON.parse(JSON.stringify(videos));
          self.form.videoId = res.get("videoId");
          self.form.courseId = res.get("courseId");
          self.$forceUpdate();
          self.$nextTick(() => {
            // 在 DOM 中添加 my-component 组件
            self.form.courseId = res.get("courseId");
          });
        });
      });
      this.isShowDetail = true;
      this.window_title = "查看";
    },
    /** 编辑 */
    handleShowEdit(row) {
      var self = this;
      this.form.id = row.id;
      var query = new this.ParseServer.Query("Recommend");
      query.get(this.form.id).then(res => {
        this.form.id = res.id;
        this.form.title = res.get("title");
        this.form.courseId = res.get("courseId");
        this.form.videoId = res.get("videoId");
        this.form.videoName = res.get("videoName");
        this.form.headImg = res.get("headImg");
        this.form.href = res.get("href");
        this.form.updatedBy = res.get("updatedBy");
        this.form.remark = res.get("remark");
        var query1 = new self.ParseServer.Query("Video");
        query1.containsAll("courseIds", [this.form.courseId]);
        query1.limit(10000);
        query1.find().then(videos => {
          self.videoList = JSON.parse(JSON.stringify(videos));
          self.form.videoId = res.get("videoId");
          self.form.courseId = res.get("courseId");
          self.$forceUpdate();
          self.$nextTick(() => {
            // 在 DOM 中添加 my-component 组件
            self.form.courseId = res.get("courseId");
          });
        });
      });
      this.show_window = true;
      this.window_title = "添加推荐";
    },
    /** 添加video */
    handleAddvideo() {
      (this.form = {
        id: "",
        title: "",
        courseId: "",
        videoId: "",
        videoName: "",
        headImg: "",
        href: "",
        updatedBy: "",
        remark: ""
      }),
        (this.window_title = "添加推荐");
      this.show_window = true;
    },

    /** 获取科目名称 */
    getCourseName(id) {
      var course = this.courses.find(item => {
        return item.id == id;
      });
      return course ? course.get("courseName") : "";
    },
    handleShowImg(row) {
      this.isShowImg = true;
      this.currImg = row.headImg;
    },

    /** 加载树形科目 */
    bindCourseTree() {
      var self = this;
      var query = new this.ParseServer.Query("Courses");
      query.limit(10000);
      query.ascending("createdAt");
      query.find().then(res => {
        this.courses = res;
        var tree = self.initCourseTree(res, "0");
        self.courseTreeData = tree;
      });
    },
    /** 构造树形科目 */
    initCourseTree(courses, parentId) {
      var self = this;
      var treeValue = [];
      let _subjects = courses.filter(_item => {
        return _item.get("parent_ID") == parentId;
      });
      _subjects.forEach((_course, _index) => {
        let course = {
          title: _course.get("courseName"),
          value: _course.id
        };
        let childrens = courses.filter(_item => {
          return _item.get("parent_ID") == _course.id;
        });
        if (childrens.length > 0) {
          course.children = self.initCourseTree(courses, _course.id);
        }
        treeValue.push(course);
      });
      return treeValue;
    },
    /**
     * 图片上传完成
     */
    handleUploadComplate(urls) {
      this.form.headImg = urls;
    },
    /** 选择套课 */
    handleChangeCouse(courseId) {
      var self = this;
      var query = new self.ParseServer.Query("Video");
      query.containsAll("courseIds", [courseId]);
      query.limit(10000);
      query.find().then(videos => {
        self.videoList = JSON.parse(JSON.stringify(videos));
        if (self.videoList && self.videoList.length > 0) {
          self.form.courseId = courseId;
        } else {
          this.$refs.myVideo.clearSingleSelect();
        }
      });
    },
    /*
     *发布消息
     *作者：gzt
     *时间：2020-11-22 14:50:34
     */
    add_video() {
      var self = this;
      self.$refs["form"].validate(valid => {
        if (!valid) {
          self.$Message.error("请检查表单项");
          self.editLoading = false;
          setTimeout(() => {
            self.editLoading = true;
          }, 100);
          return false;
        } else {
          var videos = self.ParseServer.Object.extend("Recommend");
          var Recommend = new videos();
          if (self.form.id) {
            Recommend.set("id", self.form.id);
          }
          let realName = self.ParseServer.User.current().get("realname");
          Recommend.set("title", self.form.title);
          Recommend.set("headImg", self.form.headImg);
          Recommend.set("courseId", self.form.courseId);
          Recommend.set("videoId", self.form.videoId);
          var video = self.videoList.find(t => {
            return t.objectId == self.form.videoId;
          });
          Recommend.set("videoName", video ? video.title : "");
          Recommend.set("href", self.form.href);
          Recommend.set("updatedBy", realName);
          Recommend.set("remark", self.form.remark);
          Recommend.save().then(
            response => {
              this.$Message.success("保存成功");
              self.show_window = false;
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
    get_entity() {
      var query = new this.ParseServer.Query("Recommend");
      query.get(this.form.id).then(res => {
        this.form.id = res.id;
        this.form.title = res.get("title");
        this.form.courseId = res.get("courseId");
        this.form.videoSrc = res.get("videoSrc");
        this.form.href = res.get("href");
        this.form.updatedBy = res.get("updatedBy");
        this.form.remark = res.get("remark");
      });
    },

    /*
     *搜索数据
     *作者：gzt
     *时间：2020-11-21 23:30:19
     */
    search() {
      this.page = 1;
      this.page_list();
    },
    pagechange(e) {
      this.page = e;
      this.page_list();
    },
    /*
     *分页加载数据
     *作者：gzt
     *时间：2020-11-21 23:30:27
     */
    page_list(page_index) {
      var self = this;
      this.loading = true;
      // let query1 = new this.ParseServer.Query("Recommend");
      // query1.contains('title', this.search_keyword)
      let querya = new this.ParseServer.Query("Recommend");
      querya.contains("objectId", this.search_keyword);
      let queryb = new this.ParseServer.Query("Recommend");
      queryb.contains("title", this.search_keyword);
      let query1 = this.ParseServer.Query.or(querya, queryb);

      let query2 = new this.ParseServer.Query("Recommend");
      if (this.search_courseName) {
        var _courses = [];
        this.courses.forEach(t => {
          if (t.get("courseName").indexOf(this.search_courseName) != -1) {
            _courses.push(t.id);
          }
        });
        query2.containedIn("courseId", _courses);
      }
      var query = this.ParseServer.Query.and(query1, query2);
      query.descending("createdAt");
      query.count().then(count => {
        self.total = count;
      });
      query.skip((this.page - 1) * this.pageSize);
      query.limit(this.pageSize);

      query.find().then(
        list => {
          this.data = [];
          if (list && list.length > 0) {
            this.data = list.map(item => {
              var _data = {
                id: item.id,
                title: item.get("title"),
                href: item.get("href"),
                headImg: item.get("headImg"),
                courseId: item.get("courseId"),
                videoId: item.get("videoId"),
                videoName: item.get("videoName"),
                remark: item.get("remark"),
                updatedBy: item.get("updatedBy"),
                createdAt: item.get("createdAt"),
                updatedAt: tool.dateFormat(
                  item.get("updatedAt"),
                  "yyyy-MM-dd HH:mm:ss"
                )
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
    handleDelete(row) {
      let _this = this;
      this.$Modal.confirm({
        title: "删除提示",
        content: "<p>删除消息后将无法恢复，确定要删除吗？</p>",
        onOk: () => {
          var query = new this.ParseServer.Query("Recommend");
          query.get(row.id).then(
            response => {
              response.destroy().then(
                delete_result => {
                  this.$Message.success("删除成功");
                  this.page = 1;
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
.comments {
  overflow-y: auto;
  width: 400px !important;
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.demo-spin-col {
  height: 100px;
  position: relative;
  border: 1px solid #eee;
}
</style>
