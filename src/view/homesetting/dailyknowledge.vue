<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix" style="display:flex">
      <div class="search-wrap clear-fix" style="flex:1">
        <div class="search-keyword" style="width:230px">
          <Input
            v-model="search_keyword"
            size="large"
            placeholder="ID或标题名称关键字搜索"
            style="width:200px"
          />
        </div>
      </div>
      <div class="search-btn" style="width:150px;margin:0">
        <Button type="primary" class="search-btn" @click="search">搜索</Button>
      </div>
    </div>
    <Row class="table-wrap">
      <div style="margin-bottom: 20px;display: flex; justify-content: space-between;">
        <div>
          <Button :class="{'active':isActive==1}" @click="courseList(1)">展示课程</Button>
          <Button :class="{'active':isActive==2}" @click="courseList(2)">教师头像</Button>
        </div>
        <Button v-if="isActive==1" type="primary" @click="addCourseClick">新增课程</Button>
        <Button v-if="isActive==2" type="primary" @click="addCover">新增头像</Button>
      </div>
      <!-- 课程表格 -->
      <div v-show="isActive==1">
        <Table :loading="loading" :columns="columns" :data="datas">
          <template slot-scope="{ row }" slot="action">
            <Button
              type="warning"
              size="small"
              style="margin-right:5px"
              @click="editCourseClick(row)"
            >编辑</Button>
            <Button
              type="error"
              size="small"
              style="margin-right:5px"
              @click="DelConfirmShow(row)"
            >删除</Button>
          </template>
        </Table>
        <div class="page-wrap">
          <Page :total="total" @on-change="pagechange" v-if="total != 0" />
        </div>
      </div>

      <!-- 教师头像表格 -->
      <div v-show="isActive==2">
        <Table :loading="loading" :columns="tchcolumns" :data="tchdatas">
          <template slot-scope="{ row }" slot="surface">
            <div v-if="row.surface.length>0" style="margin:5px 0">
              <img :src="row.surface" @click="handleShowImg(row)" width="84" height="58" />
            </div>
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button
              type="warning"
              size="small"
              style="margin-right:5px"
              @click="EditFormShow(row)"
            >编辑</Button>
            <Button
              type="error"
              size="small"
              style="margin-right:5px"
              @click="DelConfirmShow(row)"
            >删除</Button>
          </template>
        </Table>
        <div class="page-wrap">
          <Page :total="tchtotal" @on-change="pagechange" v-if="total != 0" />
        </div>
      </div>
    </Row>

    <!-- 添加课程 -->
    <Modal
      v-model="isShowAddCourse"
      :title="add_titleCourse"
      width="950"
      mask
      scrollable
      :loading="courseLoading"
      @on-ok="add_Course"
    >
      <div style="display: flex;
    justify-content: start;align-items: center;">
        <div class="search-keyword" style="width:250px">
          <Input
            v-model="search_keywords"
            size="large"
            placeholder="搜索父级/单独课程关键字搜索"
            style="width:235px"
          />
        </div>
        <Button type="primary" class="search-btn" @click="searchs">搜索</Button>
        <div
          v-if="currParent.id == '0'"
          style="margin-left:50px;font-size: 17px;font-weight: bold;"
        >父级课程表单:无</div>
        <div
          v-else
          style="margin-left:50px;font-size: 17px;font-weight: bold;"
        >父级课程表单:{{currParent.subjectName}}</div>
      </div>
      <Table
        :loading="loading"
        v-if="currParent.id == '0'"
        :columns="courses_columns"
        :data="courses_datas"
        style="margin-top:10px"
      >
        <template slot-scope="{ row }" slot="subjectName">
          <div>
            <span
              v-if="row.has_down_level && row.flag == 1"
              @click="subjectNameClick(row)"
              style="color:#57a3f3;
                        cursor: pointer;
                    "
            >{{row.subjectName}}</span>
            <span v-else-if="!row.has_down_level && row.flag == 1">{{row.subjectName}}</span>
          </div>

          <span v-if="row.flag == 2">{{row.subjectName}}</span>
        </template>

        <template slot-scope="{ row }" slot="isVipCourse">
          <span v-if="row.isVipCourse">是</span>
          <span v-else>否</span>
        </template>

        <template slot-scope="{ row }" slot="radio">
          <div v-if="row.flag == 1">
            <span v-if="row.level>0 && row.kind !=4">
              <input type="radio" v-model="radioData" :value="row.id" />
            </span>
            <span v-else-if="row.level == 0">
              <input type="radio" v-model="radioData" :value="row.id" />
            </span>
          </div>
          <div v-if="row.flag == 2">
            <span>
              <input type="radio" v-model="radioData" :value="row.id" />
            </span>
          </div>
        </template>

        <template slot-scope="{ row }" slot="action">
          <div v-if="row.flag == 1">
            <span
              v-if="row.has_down_level"
              style="margin-right:5px;cursor: pointer;"
              @click="ShowChildrens(row)"
            >查看下一级</span>
            <span
              v-if="row.level > 0"
              style="margin-right:5px;cursor: pointer;"
              @click="ShowParents(row)"
            >查看上一级</span>
          </div>
        </template>
      </Table>

      <!-- 父级课程系列课程-子课程 -->
      <Table
        :loading="loading"
        v-if="currParent.id > '0'"
        :columns="courses_columns3"
        :data="courses_datas"
        style="margin-top:10px"
      >
        <template slot-scope="{ row }" slot="subjectName">
          <div>
            <span
              v-if="row.has_down_level && row.flag == 1"
              @click="subjectNameClick(row)"
              style="color:#57a3f3;
                        cursor: pointer;
                    "
            >{{row.subjectName}}</span>
            <span v-else-if="!row.has_down_level && row.flag == 1">{{row.subjectName}}</span>
          </div>
        </template>

        <template slot-scope="{ row }" slot="isVipCourse">
          <span v-if="row.isVipCourse">是</span>
          <span v-else>否</span>
        </template>

        <template slot-scope="{ row }" slot="radio">
          <div v-if="row.flag == 1">
            <span v-if="row.level>0 && row.kind !=4">
              <input type="radio" v-model="radioData" :value="row.id" />
            </span>
            <span v-else-if="row.level == 0">
              <input type="radio" v-model="radioData" :value="row.id" />
            </span>
          </div>
        </template>

        <template slot-scope="{ row }" slot="action">
          <div v-if="row.flag == 1">
            <span
              v-if="row.has_down_level"
              style="margin-right:5px;cursor: pointer;"
              @click="ShowChildrens(row)"
            >查看下一级</span>
            <span
              v-if="row.level > 0"
              style="margin-right:5px;cursor: pointer;"
              @click="ShowParents(row)"
            >查看上一级</span>
          </div>
        </template>
      </Table>
      <div style="margin-top: 20px;">
        <Page :total="totals" @on-change="pagechanges" v-if="totals != 0" />
      </div>
    </Modal>

    <!-- 添加课程2 -->
    <Modal
      v-model="isShowAddCourse2"
      :title="add_titleCourse"
      width="600"
      mask
      scrollable
      :loading="courseLoading"
      @on-ok="add_Course2"
    >
      <Form
        v-if="isShowAddCourse2"
        ref="form"
        :model="course_form"
        label-position="left"
        :label-width="90"
        :rules="ruleValidate"
      >
        <!-- <FormItem label="封面图:">
                  <myUploadMuti
                    :images="course_form.surface"
                    @complate="handleUploadComplate"
                    :multiple="false"
                    :onethis='true'
                    accept=".*"
                  ></myUploadMuti>
        </FormItem>-->
        <FormItem label="封面图" prop="surface">
          <div>
            <img
              v-if="course_form.surface[0]"
              :src="course_form.surface[0]"
              width="375"
              height="200"
            />
          </div>
          <myUpload @complate="handleUploadComplate" tips></myUpload>
        </FormItem>
        <FormItem label="标题名称:" prop="title">
          <Input v-model="course_form.title" placeholder="请输入标题名称"></Input>
        </FormItem>
        <FormItem label="副标题:" prop="subTitle">
          <Input v-model="course_form.subTitle" placeholder="请输入副标题"></Input>
        </FormItem>

        <FormItem label="基数:" prop="baseNum">
          <Input v-model="course_form.baseNum" placeholder="请输入基数"></Input>
        </FormItem>

        <FormItem label="N值:" prop="N">
          <Input v-model="course_form.N" placeholder="请输入N值"></Input>
        </FormItem>

        <FormItem label="展示顺序:" prop="order">
          <Input v-model="course_form.order" placeholder="请输入展示顺序"></Input>
        </FormItem>
      </Form>
    </Modal>

    <!-- 添加教师头像 -->
    <Modal
      v-model="isShowAddForm"
      :title="window_title"
      width="600"
      mask
      scrollable
      :loading="loading"
      @on-ok="add_cover"
    >
      <Form
        v-if="isShowAddForm"
        ref="form"
        :model="form"
        label-position="right"
        :label-width="120"
        :rules="ruleValidate"
      >
        <FormItem label="封面图:">
          <myUploadMuti
            :images="form.surface"
            @complate="handleUploadComplate"
            :multiple="false"
            :onethis="true"
            accept=".*"
          ></myUploadMuti>
        </FormItem>
        <FormItem label="姓名:" prop="title">
          <Input v-model="course_form.title" placeholder="请输入教师姓名"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { tool } from "@/api/tool";
import myUpload from "@/components/myUpload";
import itemMixin from "../../components/main/components/side-menu/item-mixin";
import myUploadMuti from "@/components/myUploadMuti";
export default {
  name: "coursesmanageindex",
  components: {
    myUpload,
    myUploadMuti
  },
  data() {
    return {
      isActive: 1,
      updatedBy: "",
      loading: true,
      courseLoading: true,
      courseId: "", //添加模块内的课程id
      isCourseCompileAdd: 1, //是添加模块添加课程还是模块编辑课程
      radioData: "",
      courses_datas: [],
      courses_datas2: [],
      add_titleCourse: "添加课程",
      isShowAddCourse: false,
      isShowAddCourse2: false,
      page: 1,
      pages: 1,
      pageSize: 10,
      total: 0,
      tchtotal: 0,
      totals: 0,
      id: "",
      currParent: {
        id: "0"
      },
      currLevel: 0,
      route: [
        {
          id: "0"
        }
      ],
      annotation: true,
      search_keyword: "",
      search_keywords: "",
      // 模块
      columns: [
        { title: "ID", key: "id" },
        { title: "课程标题", key: "title" },
        { title: "副标题", key: "subTitle" },
        { title: "基数", key: "baseNum" },
        { title: "N值", key: "N" },
        { title: "展示顺序", key: "order" },
        { title: "更新时间", key: "updatedAt" },
        { title: "更新人", key: "updatedBy" },
        { title: "操作", key: "action", width: 200, slot: "action" }
      ],
      // 教师头像
      tchcolumns: [
        { title: "ID", key: "id" },
        { title: "头像", key: "surface", slot: "surface" },
        { title: "姓名", key: "name", slot: "name" },
        { title: "更新时间", key: "updatedAt" },
        { title: "更新人", key: "updatedBy" },
        { title: "操作", key: "action", width: 200, slot: "action" }
      ],

      // 添加课程
      courses_columns: [
        { title: "选择", key: "radio", slot: "radio", width: 80 },
        { title: "ID", key: "id" },
        { title: "课程标题", key: "subjectName", slot: "subjectName" },
        { title: "副标题1", key: "subTitle1" },
        { title: "副标题2", key: "subTitle2" },
        { title: "讲师", key: "lecturerName" },
        {
          title: "VIP课程",
          key: "isVipCourse",
          slot: "isVipCourse"
        },
        { title: "更新时间", key: "updatedAt" },
        { title: "操作", key: "action", width: 200, slot: "action" }
      ],

      // 系列课程-子课程
      courses_columns3: [
        { title: "选择", key: "radio", slot: "radio", width: 80 },
        { title: "ID", key: "id" },
        { title: "课程标题", key: "subjectName", slot: "subjectName" },
        {
          title: "VIP课程",
          key: "isVipCourse",
          slot: "isVipCourse"
        },
        { title: "更新时间", key: "updatedAt" },
        { title: "操作", key: "action", width: 200, slot: "action" }
      ],

      datas: [],
      tchdatas: [],
      course_form: {
        surface: [], //封面图
        title: "", //标题
        subTitle: "", //副标题
        order: "", //展示顺序
        N: "",
        baseNum: "" //基数
      },
      ruleValidate: {
        moduleName: [
          { required: true, message: "请输入模块名称", trigger: "blur" }
        ],

        showAmount: [
          {
            trigger: "blur",
            required: true,
            validator: (rule, value, callback) => {
              if (value == "") {
                return callback(new Error("请输入展示数量"));
              } else if (!/^[0-9]*$/.test(value)) {
                return callback(new Error("首页展示数量只能输入数字！"));
              }
              callback();
            }
          }
        ],

        order: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value == "") {
                return callback(new Error("请输入展示顺序"));
              } else if (!/^[0-9]*$/.test(value)) {
                return callback(new Error("展示顺序只能输入数字！"));
              }
              callback();
            }
          }
        ],

        showOrder: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value == "") {
                return callback(new Error("请输入展示顺序"));
              } else if (!/^[0-9]*$/.test(value)) {
                return callback(new Error("首页展示顺序只能输入数字！"));
              }
              callback();
            }
          }
        ],
        title: [{ required: true, message: "请输入标题名称", trigger: "blur" }],
        N: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value == "") {
                return callback(new Error("请输入N值"));
              } else if (!/^[0-9]*$/.test(value)) {
                return callback(new Error("N值只能输入数字！"));
              }
              callback();
            }
          }
        ],
        baseNum: [
          {
            required: true,
            message: "请输入基数",
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value === "") {
                return callback(new Error("请输入基数"));
              } else if (!/^[0-9]*$/.test(value)) {
                return callback(new Error("基数只能输入数字！"));
              }
              callback();
            }
          }
        ]
        // surface: [
        //   {
        //     required: true,
        //     trigger: "blur",
        //     validator: (rule, value, callback) => {
        //       if (value.length == 0) {
        //         return callback(new Error("请上传封面图"));
        //       }
        //       callback();
        //     },
        //   },
        // ],
      }
    };
  },

  mounted() {
    this.updatedBy = this.ParseServer.User.current().toJSON().realname;
    this.page_list(this.page);
    this.page_tchlist(this.page);
  },
  methods: {
    /**
     * 封面图上传完成
     */
    handleUploadComplate(urls) {
      this.course_form.surface = [urls];
    },

    search() {
      this.page = 1;
      this.page_list(this.page);
      this.page_tchlist(this.page);
    },

    searchs() {
      this.addCourseList();
    },
    pagechange(e) {
      this.page = e;
      this.page_list();
      this.page_tchlist();
    },

    page_list(page_index) {
      let _this = this;
      let query = new this.ParseServer.Query("DailyCourse");
      console.log(query)
      if (this.search_keyword) {
        let query1 = new this.ParseServer.Query("DailyCourse");
        let query2 = new this.ParseServer.Query("DailyCourse");
        query1.contains("title", this.search_keyword);
        query2.contains("objectId", this.search_keyword);
        query = new this.ParseServer.Query.or(query1, query2);
      }
      // query.equalTo("courseListening", 1);
      query.descending("createdAt");
      query.count().then(count => {
        _this.total = count;
      });
      query.skip((this.page - 1) * this.pageSize);
      query.limit(this.pageSize);
      query.include("course");
      query.find().then(
        list => {
      console.log(list)
          _this.datas = [];
          if (list && list.length > 0) {
            list.forEach(item => {
              _this.datas.push({
                id: item.id,
                title: item.get("title"),
                surface: item.get("surface"),
                subTitle: item.get("subtitle"),
                order: item.get("order"),
                updatedBy: item.get("updatedBy"),
                N: item.get("N"),
                rawCourseId: item.get("course").id,
                baseNum: item.get("baseNum"),
                updatedAt: tool.dateFormat(
                  item.get("updatedAt"),
                  "yyyy-MM-dd HH:mm:ss"
                )
              });
            });
          }
          this.loading = false;
        },
        error => {}
      );
    },
    page_tchlist(page_index) {
      let _this = this;
      let query = new this.ParseServer.Query("DefaultCover");
      //   query.contains("tagName", this.search_keyword);
      query.descending("createdAt");
      query.count().then(count => {
        _this.tchtotal = count;
      });
      query.skip((this.page - 1) * this.pageSize);
      query.limit(this.pageSize);
      query.find().then(
        list => {
          _this.tchdatas = [];
          if (list && list.length > 0) {
            list.forEach(item => {
              _this.tchdatas.push({
                id: item.id,
                surface: item.get("surface"),
                name: item.get("name"),
                updatedBy: item.get("updatedBy"),
                updatedAt: tool.dateFormat(
                  item.get("updatedAt"),
                  "yyyy-MM-dd HH:mm:ss"
                )
              });
            });
          }
          this.isShowAddForm = false;
          this.loading = false;
        },
        error => {}
      );
    },

    DelConfirmShow(row) {
      var id = row.id;
      let _this = this;
      this.$Modal.confirm({
        title: "删除提示",
        content: "<p>当前课程试听会被删除，确定要删除吗？</p>",
        onOk: () => {
          var query = new this.ParseServer.Query("ModuleAssociatedCourses");
          query.get(id).then(response => {
            this.deletes(id);
            // 删除当前组件
          });
        },
        onCancel: () => {
          this.$Message.info("取消了操作");
        }
      });
    },

    /** 查看上一级 */
    ShowParents(row) {
      this.route.pop();
      this.currLevel -= 1;
      this.currParent = this.route[this.route.length - 1];
      this.pages = 1;
      this.addCourseList(1);
    },
    /** 查看下一级 */
    ShowChildrens(row) {
      this.route.push(row);
      this.currLevel += 1;
      this.currParent = row;
      this.pages = 1;
      this.addCourseList(1);
    },

    pagechanges(e) {
      this.pages = e;
      this.addCourseList();
    },

    // 添加课程单击事件
    addCourseClick(row) {
      (this.course_form = {
        surface: [], //封面图
        title: "", //标题
        subTitle: "", //副标题
        order: "", //展示顺序
        N: "",
        baseNum: "" //基数
      }),
        (this.radioData = "");
      this.isCourseCompileAdd = 1;
      this.search_keywords = "";
      this.add_titleCourse = "添加课程";
      this.$nextTick(() => {
        this.pages = 1;
        this.currParent.id = "0";
        this.isShowAddCourse = true;
        this.isShowAddCourse2 = false;
        this.addCourseList();
      });
    },

    // 编辑课程单击事件
    editCourseClick(row) {
      this.add_titleCourse = "编辑课程";
      this.search_keywords = "";
      this.isCourseCompileAdd = 2;
      this.courseId = row.id;
      this.surface = row.surface;
      this.course_form.radioData = row.rawCourseId;
      this.course_form.title = row.title;
      this.course_form.subTitle = row.subTitle;
      this.course_form.surface = row.surface;
      this.course_form.order = row.order;
      this.course_form.N = row.N;
      this.course_form.baseNum = row.baseNum;
      this.moduleId = row.moduleId; //模块id
      this.$nextTick(() => {
        this.pages = 1;
        this.radioData = row.rawCourseId; //原课程id
        this.currParent.id = "0";
        this.isShowAddCourse = true;
        this.isShowAddCourse2 = false;
        this.addCourseList();
      });
    },

    // 系列课程单击事件
    subjectNameClick(row) {
      this.pages = 1;
      this.route.push(row);
      this.currLevel += 1;
      this.currParent = row;
      this.addCourseList();
    },

    // 添加课程list
    addCourseList() {
      let _this = this;
      const query1 = new this.ParseServer.Query("CoursesModule");
      query1.equalTo("parent_ID", this.currParent.id);
      const query3 = new this.ParseServer.Query("CoursesModule");
      query3.contains("subjectName", this.search_keywords);
      if (this.search_keywords) {
      }
      if (this.currParent.id == 0) {
        const query2 = new this.ParseServer.Query("CoursesModule");
        query2.equalTo("flag", 2);
        var query = new this.ParseServer.Query.and(
          new this.ParseServer.Query.or(query1, query2),
          query3
        );
      } else {
        var query = new this.ParseServer.Query.and(
          new this.ParseServer.Query.or(query1),
          query3
        );
      }
      query.descending("createdAt");
      query.count().then(count => {
        _this.totals = count;
      });
      query.skip((this.pages - 1) * this.pageSize);
      query.limit(this.pageSize);
      query.include("course");
      query.find().then(
        list => {
          _this.courses_datas = [];
          if (list && list.length > 0) {
            if (this.isCourseCompileAdd == 1 && this.currParent.id == 0) {
              this.radioData = list[0].id;
            }
            list.forEach(item => {
              _this.courses_datas.push({
                id: item.id,
                flag: item.get("flag"),
                subjectName: item.get("subjectName"),
                updatedBy: item.get("updatedBy"),
                subTitle1: item.get("subTitle1"),
                subTitle2: item.get("subTitle2"),
                order: item.get("order"),
                lecturerName: item.get("lecturerName"),
                isVipCourse: item.get("isVipCourse"),
                kind: item.get("kind"),
                isHideCourse: item.get("isHideCourse"),
                tagName: item.get("tag") ? item.get("tag").tagName : "",
                putaway: item.get("putaway"),
                has_down_level: item.get("has_down_level"),
                level: item.get("level"),
                // isVipLook: item.get("isVipLook"),
                updatedAt: tool.dateFormat(
                  item.get("updatedAt"),
                  "yyyy-MM-dd HH:mm:ss"
                )
              });
            });
          }
          this.loading = false;
        },
        error => {
          // debugger;
        }
      );
    },

    //添加课程
    add_Course() {
      if (this.isCourseCompileAdd == 1) {
        if (this.radioData == "") {
          this.$Message.info("请选择一个课程");
          this.courseLoading = false;
          setTimeout(() => {
            this.courseLoading = true;
          }, 100);
          return false;
        }
      }
      this.isShowAddCourse = false;
      this.isShowAddCourse2 = true;
    },

    add_Course2() {
      this.updatedBy = this.ParseServer.User.current().toJSON().realname;
      var datas = this.ParseServer.Object.extend("ModuleAssociatedCourses");
      var data = new datas();
      this.$refs["form"].validate(valid => {
        if (!valid) {
          this.$Message.error("请检查表单项");
          this.courseLoading = false;
          setTimeout(() => {
            this.courseLoading = true;
          }, 100);
          return false;
        } else {
          // 保存
          if (this.isCourseCompileAdd == 1) {
            var query = new this.ParseServer.Query("ModuleAssociatedCourses");
            query.equalTo("courseListening", Number(1));
            query.equalTo("order", Number(this.course_form.order));
            query.limit(10000);
            query.find().then(response => {
              if (response && response.length > 0) {
                this.$Message.error("排序已存在");
                this.courseLoading = false;
                setTimeout(() => {
                  this.courseLoading = true;
                }, 100);
                return false;
              } else {
                // 课程id
                var coursesClass = this.ParseServer.Object.extend(
                  "CoursesModule"
                );
                var coursesId = coursesClass.createWithoutData(this.radioData);

                // 保存
                data.set("surface", this.course_form.surface);
                data.set("title", this.course_form.title);
                data.set("subTitle", this.course_form.subTitle);
                data.set("order", Number(this.course_form.order));
                data.set("N", Number(this.course_form.N));
                data.set("baseNum", Number(this.course_form.baseNum));
                data.set("course", coursesId);
                data.set("courseListening", 1);
                data.set("updatedBy", this.updatedBy);
                data.save().then(
                  data => {
                    this.$Message.success("保存成功");
                    this.isShowAddCourse = false;
                    this.isShowAddCourse2 = false;
                    this.page_list();
                  },
                  error => {
                    this.$Message.error("保存失败");
                  }
                );
              }
            });
          } else {
            //修改
            this.isUpdateCourse(this.courseId);
          }
        }
      });
    },

    //  修改课程
    isUpdateCourse(id) {
      this.updatedBy = this.ParseServer.User.current().toJSON().realname;
      var query = new this.ParseServer.Query("ModuleAssociatedCourses");
      query.equalTo("courseListening", Number(1));
      query.equalTo("order", Number(this.course_form.order));
      query.limit(10000);
      query.find().then(response => {
        if (response && response.length > 0) {
          if (id != response[0].id) {
            this.$Message.error("排序已存在");
            this.courseLoading = false;
            setTimeout(() => {
              this.courseLoading = true;
            }, 100);
            return false;
          } else {
            query.get(id).then(item => {
              var coursesClass = this.ParseServer.Object.extend(
                "CoursesModule"
              );
              var coursesId = coursesClass.createWithoutData(this.radioData);
              // 保存
              item.set("surface", this.course_form.surface);
              item.set("title", this.course_form.title);
              item.set("subTitle", this.course_form.subTitle);
              item.set("order", Number(this.course_form.order));
              item.set("N", Number(this.course_form.N));
              item.set("baseNum", Number(this.course_form.baseNum));
              item.set("course", coursesId);
              item.set("updatedBy", this.updatedBy);
              item.save().then(
                data => {
                  this.$Message.success("修改成功");
                  this.isShowAddCourse = false;
                  this.isShowAddCourse2 = false;
                  this.page_list();
                },
                error => {
                  this.$Message.error("修改失败");
                }
              );
            });
          }
        } else {
          this.updated_Course(id);
        }
      });
    },
    updated_Course(id) {
      var query = new this.ParseServer.Query("ModuleAssociatedCourses");
      query.get(id).then(item => {
        var coursesClass = this.ParseServer.Object.extend("CoursesModule");
        var coursesId = coursesClass.createWithoutData(this.radioData);
        // 保存
        item.set("surface", this.course_form.surface);
        item.set("title", this.course_form.title);
        item.set("subTitle", this.course_form.subTitle);
        item.set("order", Number(this.course_form.order));
        item.set("N", Number(this.course_form.N));
        item.set("baseNum", Number(this.course_form.baseNum));
        item.set("course", coursesId);
        item.set("updatedBy", this.updatedBy);
        item.save().then(
          data => {
            this.$Message.success("修改成功");
            this.isShowAddCourse = false;
            this.isShowAddCourse2 = false;
            this.page_list();
          },
          error => {
            this.$Message.error("修改失败");
          }
        );
      });
    },

    // 模块内课程删除
    deletes(id) {
      var query_deletes = new this.ParseServer.Query("ModuleAssociatedCourses");
      query_deletes.equalTo("objectId", id);
      query_deletes.limit(10000);
      query_deletes.find().then(response => {
        if (response && response.length > 0) {
          response.forEach(data => {
            data.destroy().then(result => {
              this.$Message.success("删除成功");
              this.page_list();
            });
          });
        }
      });
    },
    //左侧tab按钮
    courseList(data) {
      this.page = 1;
      if (data == 1) {
        this.flag = 1;
        this.isActive = 1;
      } else {
        this.flag = 2;
        this.isActive = 2;
      }
      this.page_list();
      this.page_tchlist();
    },

    addCover() {
      this.Id = "";
      this.form = {
        surface: [] //新增教师头像
      };
      this.window_title = "新增教师头像";
      this.isShowAddForm = true;
    }
  }
};
</script>

<style lang="less" scoped>
.search-wrap {
  float: left;
  width: 60%;
  .label-split {
    // margin: 0 10px;
    padding: 0 10px;
    width: 10%;
    box-sizing: border-box;
    display: block;
    float: left;
    text-align: center;
  }
  .search-keyword {
    float: left;
    width: 40%;
  }
  .select-choice {
    float: left;
    width: 35%;
    span {
      //   width: 20%;
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
    // width: 20%;
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
.binding {
  display: inline-block;
  width: 100%;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  color: #17233d;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 20px;
}

.overflow {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  // height: 30px;
  flex: 1;
}
.flag {
  margin-left: 20px;
}
</style>
