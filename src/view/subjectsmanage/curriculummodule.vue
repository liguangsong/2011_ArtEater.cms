<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix" style="display:flex">
      <div class="search-wrap clear-fix" style="flex:1">
        <div class="search-keyword" style="width:230px">
          <Input
            v-model="search_keyword"
            size="large"
            placeholder="请输入课程名称"
            style="width:200px"
          />
        </div>

             <div class="select-choice clear-fix" style="width: 200px; float: left">
          <span style="width: 60px; padding: 0">是否VIP:</span>
          <Select
            size="large"
            v-model="search_type"
            class="choice"
            placeholder="全部"
            :clearable="true"
            style="width: 80px;margin-left:20px"
          >
            <Option :value="1" :key="1">是</Option>
             <Option :value="2" :key="2">否</Option>
          </Select>
        </div>

<div  style="width:500px;    display: flex;
    align-items: center;">
          <span style="margin-right:20px">更新时间</span>
          <div style="width:400px;    display: flex;">
            <div class="" style="width:180px">
              <DatePicker v-model="search_start_date" size="large" type="date" placeholder="请输入开始时间"></DatePicker>
            </div>
            <div class="label-split" style="height:36px;line-height:36px">-</div>
            <div style="width:180px">
              <DatePicker v-model="search_end_date" size="large" type="date" placeholder="请输入结束时间"></DatePicker>
            </div>
          </div>
        </div>
        <div class="search-btn" style="width:150px;margin:0">
       </Col>
        </div>
      </div>
 <div class="search-btn" style="width:150px;margin:0">
  <Button type="primary" class="search-btn" @click="search">搜索</Button>
      </div>
    </div>
    
    <Row class="table-wrap">
      <div style="margin-top:10px;display: flex;
    justify-content: space-between;">
        <!-- 左侧 -->
         <div v-if="currLevel == 0" >
              <Button :class="{'active':isActive==1}"  @click="courseList(1)">系列课程</Button>
              <Button :class="{'active':isActive==2}"  @click="courseList(2)">单独课程</Button>
         </div>
        
        <!-- 右侧 -->
         <div class="addCourse" v-if="currLevel == 0">
            <Button @click="addCourses(1)" >新增系列课程</Button>
        <Button style="margin-left:10px" @click="addCourses(2)">新增单独课程</Button>
         </div>
         
         <!-- xinzneg -->
         <div class="addCourse"  v-else> 
            <Button @click="addChildCourse" >新增系列课程-子课程</Button>
            </div>

    </div>
      <Table :loading="loading" :columns="currLevel==0?columns:columns1" :data="courses_datas" style="margin-top:10px">
               <template slot-scope="{ row }" slot="vip"> 
                     <span v-if="row.vip">是</span>
                      <span v-else>否</span>
                   </template>
                   
                   <!-- 系列课程子级判断 -->
                  <template slot-scope="{ row }" slot="isVipCourses"> 
                     <span v-if="row.vip">是</span>
                      <span v-else>否</span>
                   </template>

                   <template slot-scope="{ row }" slot="putaway"> 
                     <i-switch v-model="row.putaway"  @on-change="putawayClick(row)"   size="large" />
                   </template>

                        <!-- <template slot-scope="{ row }" slot="isVipLook"> 
                        <i-switch v-model="row.isVipLook" @on-change="isHideLookClick(row)"   size="large" />
                   </template> -->
                    <template slot-scope="{ row }" slot="HideCourse"> 
                        <i-switch  v-model="row.hide" @on-change="hideClick(row)"   size="large" />
                   </template>

        <template slot-scope="{ row }" slot="action">
            <Button v-if="flag == 1 && row.level == 0"
           type="warning"
            size="small"
            style="margin-right:5px"
            @click="Editintroduce(row)"
            >介绍</Button
          >

           <Button
            type="warning"
            size="small"
            style="margin-right:5px"
            @click="EditFormShow(row)"
            >编辑</Button
          >
          <Button
            type="info"
            size="small"
            style="margin-right:5px"
            @click="ExamineFormShow(row)"
            >查看</Button
          >     
                     <Button v-if="row.level > 0 && flag == 1" type="info" size="small" style="margin-right:5px;cursor: pointer;" @click="ShowParents(row)">查看上一级</Button>
                    <Button v-if="!row.has_down_level && flag == 1" type="primary" size="small" style="margin-right:5px;cursor: pointer;" @click="AddChildrens(row)">添加下一级</Button>
                      <Button v-else-if="flag == 1 &&row.has_down_level" type="info" size="small" style="margin-right:5px;cursor: pointer;" @click="ShowChildrens(row)">查看下一级</Button>
             <Button v-if="flag == 2"
            type="info"
            size="small"
            style="margin-right:5px"
            @click="transfer(row)"
            >转移</Button
          >
        
          <Button v-if="flag == 2 || row.level >0"
            type="info"
            size="small"
            style="margin-right:5px"
            @click="recommendCourse(row)"
            >推荐课程</Button
          >
 
          <Button
            type="info"
            size="small"
            style="margin-right:5px"
            @click="handleShare(row)"
            >分享</Button
          >
          <Button
            type="error"
            size="small"
            style="margin-right:5px"
            @click="DelConfirmShow(row)"
            >删除</Button
          >
        </template>
      </Table>
      <div class="page-wrap">
        <Page :total="total" @on-change="pagechange" v-if="total != 0" />
      </div>
    </Row>    
    <Modal
      v-model="isShowAddForm"
      :title="window_title"
      width="550"
      mask
      scrollable
      :loading="modalLoading"
      @on-ok="add_courses"
    >
      <Form
        v-if="isShowAddForm"
        ref="courseForm"
        :model="form"
        label-position="right"
        :label-width="100"
        :rules="ruleValidate"
      >
        <FormItem label="头图:" v-if="!showRadio">
          <myUploadMuti
            :images="form.headImg"
            @complate="handleUploadComplate"
            :multiple="false"
            accept=".*"
          ></myUploadMuti>
        </FormItem>

        <FormItem label="课程名称:" prop="subjectName">
          <Input
            v-model="form.subjectName"
            placeholder="请输入课程名称"
          ></Input>
        </FormItem>
            <FormItem label="副标题1:" prop="subTitle1">
          <Input
            v-model="form.subTitle1"
            placeholder="请输入副标题1"
          ></Input>
        </FormItem>
            <FormItem label="副标题2:" prop="subTitle2">
          <Input
            v-model="form.subTitle2"
            placeholder="请输入副标题2"
          ></Input>
        </FormItem>

         <div style="display: flex;
    align-items: center;">
                     <div style="flex: 0.5;">
                        <FormItem label="是否是VIP课程:">
                       <i-switch v-model="form.vip"  size="large" />
                    </FormItem>

                     </div>
                  <!-- <div style="flex: 0.5;">
                      <FormItem label="是否需要VIP才能看到:">
                        <i-switch v-model="form.isVipLook"  size="large" />
                    </FormItem>
                  </div> -->

                  <div style="flex: 0.5;">
                      <FormItem label="是否隐藏课程:">
                        <i-switch v-model="form.hide"  size="large" />
                    </FormItem>
                  </div>
                </div>
    

       <FormItem label="课程类别" prop="kind" v-if="showRadio">
          <RadioGroup 
             @on-change="handleChangeRadio"
            v-model="form.kind"
          >
            <Radio
              :label="1"
              >视频</Radio
            >
             <Radio
              :label="2"
              >音频</Radio
            >
             <Radio
              :label="3"
              >图文</Radio
            >
          </RadioGroup>
        </FormItem>
 <FormItem label="标签:" prop="tag">
          <Select
            size="large"
            v-model="form.tag"
            class="choice"
            placeholder="请选择标签"
            :clearable="true"
            style="width: 200px"
          >
            <Option v-for="item in tags" :key="item.id" :value="item.id">{{
              item.tagName
            }}</Option>
          </Select>
        </FormItem>

        <FormItem label="排序:" prop="order">
          <Input
            v-model="form.order"
            placeholder="请输入顺序"
          ></Input>
        </FormItem>
        

    <FormItem label="负责讲师头像:" prop="portrait">
          <myUploadMuti
            :images="form.portrait"
            @complate="handleUploadComplates"
            :multiple="false"
            accept=".*"
          ></myUploadMuti>
        </FormItem>

        
    <FormItem label="负责讲师姓名:" prop='lecturerName'>
       <Input
            v-model="form.lecturerName"
            placeholder="负责讲师姓名"
             ></Input>
        </FormItem>
      </Form>
    </Modal>

    <!-- 新增课程链接-说明 -->
    <Modal
      v-model="isShowAlone"
      :title="window_title"
      width="650"
      mask
      scrollable
      :loading="modalLoading"
      @on-ok="add_alone"
    >
      <Form
        v-if="isShowAlone"
        ref="courseForm"
        :model="form"
        label-position="left"
        :label-width="75"
        :rules="ruleValidate"
      > 
       <FormItem v-if="requiredLink" label="课程链接:" prop="link"
       :rules="[{required:requiredLink,message:'请填写课程链接',trigger:'blur'}]"
       >
       <Input
            v-model="form.link"
            placeholder="请输入课程链接"
       ></Input>
       </FormItem>

          <FormItem label="课程说明">
          <Editor
            v-if="show_window"
            :value="form.explain"
            placeholder="请输入课程说明"
            @on-change="change_value"
          ></Editor>
        </FormItem>
      </Form>
    </Modal>
    

    <!-- 系列课程介绍 -->
        <Modal
      v-model="isIntroduce"
      :title="window_titleIntroduce"
      width="700"
      mask
      scrollable
      @on-ok="add_introduce"
    >
      <Form
        v-if="isIntroduce"
        ref="courseForm"
        :model="form"
        label-position="left"
        :label-width="65"
        :rules="ruleValidate"
      >
          <FormItem label="课程介绍">
          <Editor
            v-if="show_window"
            :value="form.introduce"
            placeholder="请输入课程介绍"
            @on-change="change_introduce"
          ></Editor>
        </FormItem>
      </Form>
    </Modal>

    

    <!-- 新增系列课程-子课程 -->
        <Modal
      v-model="isShowChildCourse"
      :title="child_titleCourse"
      width="500"
      mask
      scrollable
      :loading="modalLoading"
      @on-ok="add_ChildCourse"
    >
      <Form
        v-if="isShowChildCourse"
        ref="seriesCourseForm"
        :model="form"
        label-position="right"
        :label-width="90"
        :rules="ruleValidate"
      >
      <FormItem label="课程名称:" prop="subjectName">
          <Input
            v-model="form.subjectName"
            placeholder="请输入课程名称"
          ></Input>
        </FormItem>


         <div style="display: flex;
              align-items: center;">
                     <div style="flex: 0.5;">
                        <FormItem label="是否VIP:">
                       <i-switch v-model="form.vip"  size="large" />
                    </FormItem>
                     </div>
                     
      <div style="flex: 0.5;">
                      <FormItem label="是否隐藏课程:">
                        <i-switch v-model="form.hide"  size="large" />
                    </FormItem>
                  </div>
          </div>


       <FormItem label="课程类别" prop="kind" v-if="showRadio">
          <RadioGroup @on-change="handleChangeRadio"
            v-model="form.kind"
          >
            <Radio
              :label="1"
              >视频</Radio
            >
             <Radio
              :label="2"
              >音频</Radio
            >
             <Radio
              :label="3"
              >图文</Radio
            >
             <Radio
              :label="4"
              >目录</Radio
            >
          </RadioGroup>
        </FormItem>
 <FormItem label="标签:" prop="tag">
          <Select
            size="large"
            v-model="form.tag"
            class="choice"
            placeholder="请选择标签"
            :clearable="true"
            style="width: 200px"
          >
            <Option v-for="item in tags" :key="item.id" :value="item.id">{{
              item.tagName
            }}</Option>
          </Select>
        </FormItem>

      
      </Form>
    </Modal>


  
  <!-- 推荐课程-list -->
    <Modal
      v-model="isShowRecommendCourse"
      :title="recommend_titleCourse"
      width="800"
      mask
      scrollable
      :loading="modalLoading"
      @on-ok="add_RecommendCourse"
    >
      <Table :loading="loading" :columns="recommend_columns" :data="recommend_courses_datas" style="margin-top:10px">
                 
                 <!-- 标题 -->  
               <template slot-scope="{ row }" slot="subjectName"> 
                       
                       <div>
                         <span v-if='row.has_down_level && row.flag == 1'  @click="subjectNameClick(row)" style="color:#57a3f3;
                        cursor: pointer;
                    "> {{row.subjectName}}</span>
                         <span v-else-if='!row.has_down_level && row.flag == 1'>{{row.subjectName}}</span>
                       </div>

                    <span v-if="row.flag == 2"> {{row.subjectName}}</span>
                   </template> 
                 
               <template slot-scope="{ row }" slot="vip"> 
                     <span v-if="row.vip">是</span>
                      <span v-else>否</span>
                   </template> 
                   
                    <template slot-scope="{ row }" slot="check" >
                      <div v-if="row.flag == 1" >
                         <span v-if="row.level>0 && row.kind !=4">
                          <input type="checkbox" v-model="checkData" :value="row.id" />
                     </span>
                        <span v-else-if="row.level == 0">
                          <input type="checkbox" v-model="checkData" :value="row.id" />
                        </span>
                      </div>
                     <div v-if="row.flag == 2">     
                         <span>
                             <input type="checkbox" v-model="checkData" :value="row.id" />
                         </span>
                     </div>
                    </template>
           </Table>
                  <div style="margin-top: 20px;">
                    <Page :total="totals" @on-change="pagechanges" v-if="totals != 0" />
                  </div>
                </Row>   
        </Modal>

       <Modal @on-visible-change="handleVChange" width="450" title="二维码" v-model="isShowImg">
          <div style="margin:5px 0;text-align:center">
              <div class="qrcode" ref="qrCodeUrl"></div>
          </div>
        </Modal>




    <!-- 转移 - 课程 -->
        <Modal
      v-model="isShowTransferCourse"
      :title="transferTitleCourse"
      width="450"
      mask
      scrollable
      :loading="modalLoading"
      @on-ok="add_TransferCourse"
    >
      <Form
        v-if="isShowTransferCourse"
        label-position="right"
        :label-width="100"
      >
      <FormItem label="转移到系列课程:">
          <selectTree
            style="width: 250px"
            id="mySelectTree1"
            v-model="search_courses"
            :treeData="courseTreeData"
          ></selectTree>
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import Editor from "@/components/editor";
import { verification } from "@/api/verification";
import selectTree from "@/components/iview-select-tree";
import myUploadMuti from "@/components/myUploadMuti";
import myUpload from "@/components/myUpload";
import { tool } from "@/api/tool";
let num = /^[0-9]*$/;
export default {
  name: "coursesmanageindex",
  components: {
    Editor,
    myUpload,
    myUploadMuti,
    selectTree,
  },
  data() {
    return {
      ruleValidate: {
        // 课程名称
        subjectName: [
          { required: true, message: "请填写课程名称", trigger: "blur" },
        ],
        order: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value == "") {
                return callback(new Error("请填写排序"));
              }
              if (!/^[0-9]*$/.test(value)) {
                return callback(new Error("排序只能输入数字！"));
              }
              callback();
            },
          },
        ],
        portrait: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              console.log(value.length);
              if (value.length == 0) {
                return callback(new Error("请上传讲师头像"));
              }
              callback();
            },
          },
        ],
        lecturerName: [
          {
            required: true,
            message: "请填写讲师姓名",
            trigger: "blur",
          },
        ],

        // 课程链接
        // link: [
        //   {
        //     required: true,
        //     message: "请填写课程链接",
        //     trigger: "blur",
        //   },
        // ],
      },
      isShowTransferCourse: false,
      transferTitleCourse: "转移到系列课程",
      window_titleIntroduce: "新增课程介绍",
      isShowImg: false,
      isActive: 1,
      recommendCourseId: "",
      checkData: [],
      recommend_titleCourse: "添加推荐课程",
      recommend_courses_datas: [], //推荐课程list
      requiredLink: true, //课程链接是否必填
      child_titleCourse: "系列课程-子课程",
      isExamineCompile: 1, //查看还是编辑
      isShowChildCourse: false,
      isShowRecommendCourse: false,
      showAloneCourse: false,
      showQrcode: false,
      titleIntroduce: "编辑介绍",
      isIntroduce: false,
      isShowAlone: false,
      show_window: true,
      search_type: "",
      search_start_date: "",
      search_end_date: "",
      page: 1,
      pages: 1,
      pageSize: 10,
      total: 0,
      totals: 0,
      showRadio: false,
      search_keyword: "",
      realname: "",
      currParent: {
        id: "0",
      },
      currParents: {
        id: "0",
      },
      currLevel: 0,
      route: [
        {
          id: "0",
        },
      ],
      columns: [
        { title: "ID", key: "id" },
        { title: "语文标题", key: "subjectName" },
        { title: "副标题1", key: "subTitle1" },
        { title: "副标题2", key: "subTitle2" },
        { title: "排序", key: "order" },
        { title: "讲师", key: "lecturerName" },
        {
          title: "VIP课程",
          key: "vip",
          slot: "vip",
        },
        { title: "标签", key: "tagName" },
        { title: "上架", key: "putaway", slot: "putaway" },
        // { title: "VIP可看", key: "isVipLook", slot: "isVipLook" },
        { title: "隐藏课程", key: "hide", slot: "HideCourse" },
        { title: "更新时间", key: "updatedAt" },
        { title: "操作", key: "action", width: 400, slot: "action" },
      ],
      columns1: [
        { title: "ID", key: "id" },
        { title: "科目名称", key: "subjectName" },
        {
          title: "是否VIP",
          key: "vip",
          slot: "isVipCourses",
        },
        { title: "隐藏课程", key: "hide", slot: "HideCourse" },
        { title: "上架", key: "putaway", slot: "putaway" },
        { title: "更新时间", key: "updatedAt" },
        { title: "操作", key: "action", width: 500, slot: "action" },
      ],

      recommend_columns: [
        { title: "ID", key: "id" },
        { title: "课程标题", key: "subjectName", slot: "subjectName" },
        { title: "副标题1", key: "subTitle1" },
        { title: "副标题2", key: "subTitle2" },
        { title: "讲师", key: "lecturerName" },
        {
          title: "VIP课程",
          key: "vip",
          slot: "vip",
        },
        { title: "更新时间", key: "updatedAt" },
        { title: "选择", key: "action", slot: "check" },
      ],
      courses_datas: [],
      flag: 1,
      form: {
        headImg: [], //头图
        subjectName: "", //课程名称
        subTitle1: "", //副标题1
        subTitle2: "", //副标题2
        vip: false, //是否是VIP课程
        // isVipLook: false, //是否需要VIP才能看到
        hide: false, //是否隐藏课程
        putaway: true, //上架
        kind: 1, //课程类别
        tag: "", //标签
        order: "", // 顺序
        portrait: [], //负责讲师头像
        lecturerName: "", //负责讲师姓名
        link: "", //课程链接
        duration: "", //课程链接时长
        explain: "", //课程说明
        introduce: "", //课程介绍
        level: 0,
        has_down_level: false,
        parent_ID: "0",
      },
      rootId: "0",
      isShowAddForm: false,
      loading: true,
      modalLoading: true,
      window_title: "新增系列课程",
      tags: [],
      id: "",
      search_courses: "",
      courseTreeData: [],
      transferCoursesId: "",
    };
  },

  mounted() {
    console.log(this.ParseServer.User.current().toJSON());
    this.realname = this.ParseServer.User.current().toJSON().realname;
    this.bindSubjectTree();
    this.init_data = JSON.stringify(this.form);
    this.page_list(this.page);
    this.tag(); //标签
  },
  methods: {
    /** 加载树形科目 */
    bindSubjectTree() {
      var query = new this.ParseServer.Query("CoursesModule");
      query.equalTo("flag", 1);
      query.limit(10000);
      query.descending("createdAt");
      query.find().then((res) => {
        var tree = this.initCoursetTree(res, "0");
        console.log(tree);
        this.courseTreeData = tree;
      });
    },
    /** 构造树形科目 */
    initCoursetTree(courses, parentId) {
      var treeValue = [];
      let _courses = courses.filter((_item) => {
        return _item.get("parent_ID") == parentId;
      });
      _courses.forEach((_course, _index) => {
        let course = {
          title: _course.get("subjectName"),
          value: _course.id,
        };
        let childrens = courses.filter((_item) => {
          return _item.get("parent_ID") == _course.id;
        });
        if (childrens.length > 0) {
          course.children = this.initCoursetTree(courses, _course.id);
        }
        treeValue.push(course);
      });
      console.log(treeValue);
      return treeValue;
    },

    // 转移
    transfer(row) {
      this.search_courses = "";
      this.isShowTransferCourse = true;
      this.transferCoursesId = row.id; //当前转移课程Id
      console.log(row);
    },

    //转移添加
    add_TransferCourse() {
      if (this.search_courses == "") {
        this.$Message.error("请选择要转移的系列课程");
        this.modalLoading = false;
        setTimeout(() => {
          this.modalLoading = true;
        }, 100);
        return false;
      } else {
        console.log(this.search_courses);
        let parentLevel = "";
        var query = new this.ParseServer.Query("CoursesModule");
        //获取父级
        query.get(this.search_courses).then((item) => {
          console.log(item);
          console.log(item.id);
          console.log(item.get("level"));
          parentLevel = item.get("level");

          //转移课程
          query.get(this.transferCoursesId).then((item) => {
            console.log(item);
            item.set("flag", 1);
            item.set("parent_ID", this.search_courses);
            item.set("has_down_level", false);
            item.set("level", parentLevel + 1);
            item.save().then(
              () => {
                this.$Message.success("转移成功");
                this.updateParent(this.search_courses);
                this.isShowTransferCourse = false;
                this.page_list();
                this.bindSubjectTree();
              },
              (error) => {
                console.log(error);
                this.$Message.error("转移失败");
              }
            );
          });
        });
      }
    },

    handleChangeRadio(e) {
      console.log(e);
      if (e == 3 || e == 4) {
        this.requiredLink = false;
      } else {
        this.requiredLink = true;
      }
    },

    /** 查看上一级 */
    ShowParents(row) {
      this.route.pop();
      console.log(this.route);
      this.currLevel -= 1;
      this.currParent = this.route[this.route.length - 1];
      console.log(this.currParent);
      this.page = 1;
      this.page_list(1);
    },
    /** 查看下一级 */
    ShowChildrens(row) {
      this.route.push(row);
      this.currLevel += 1;
      this.currParent = row;
      console.log(this.currParent);
      if (row.level == 0) {
        this.rootId = row.id; //根节点Id
        console.log(this.rootId + "rootId111111111");
      }
      this.page = 1;
      this.page_list(1);
    },

    /** 添加下一级 */
    AddChildrens(row) {
      console.log(row);
      this.$Modal.confirm({
        title: "操作提示",
        content: "<p>是否添加下级目录？</p>",
        onOk: () => {
          if (row.level == 0) {
            this.rootId = row.id; //根节点Id
            console.log(this.rootId + "rootId111111111");
          }
          this.route.push(row.id);
          this.currLevel += 1;
          this.currParent = row;
          this.page = 1;
          this.page_list(1);
        },
      });
      this.showAloneCourse = false;
    },

    handleVChange(r) {
      this.isShowImg = r;
    },
    handleShare(row) {
      this.creatQrCode(row);
      this.isShowImg = true;
    },

    //二维码
    creatQrCode(row) {
      this.$refs.qrCodeUrl.innerHTML = "";
      var qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: `https://www.baidu.com/?tn=78000241_45_hao_pg?id=${row.id}`, // 需要转换为二维码的内容
        width: 100,
        height: 100,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    },

    //左侧tab按钮
    courseList(data) {
      console.log(data);
      if (data == 1) {
        this.flag = 1;
        this.isActive = 1;
      } else {
        this.flag = 2;
        this.isActive = 2;
      }
      this.page_list();
    },

    tag() {
      var query = new this.ParseServer.Query("LabelManagement");
      query.find().then((res) => {
        if (res) {
          console.log(res);
          res.forEach((item) => {
            console.log(item);
            this.tags.push({
              id: item.id,
              tagName: item.get("tagName"),
              annotation: item.get("annotation"),
            });
          });
          console.log(this.tags);
        }
      });
    },

    //是否上架
    putawayClick(data) {
      this.id = data.id;
      this.form.putaway = data.putaway;
      console.log(this.form.hide + "-----隐藏课程");
      this.courseId = data.id;
      this.updateds(1);
    },

    // //是否vip可看
    // isVipLookClick(data) {
    //   console.log(this.form.isVipLook);
    //   console.log(data.isVipLook);
    //   this.id = data.id;
    //   // this.form.isVipLook = data.isVipLook;
    //   this.updated_course();
    // },

    //是否隐藏课程
    hideClick(data) {
      this.id = data.id;
      this.form.hide = data.hide;
      this.courseId = data.id;
      this.updateds(2);
    },

    // 修改隐藏课程 上架
    updateds(flag) {
      var query = new this.ParseServer.Query("CoursesModule");
      query.get(this.courseId).then((item) => {
        if (flag == 1) {
          //上架
          item.set("putaway", this.form.putaway);
          this.updatedChildPutaway(item.id);
        } else {
          item.set("hide", this.form.hide);
        }
        item.save().then(
          () => {
            this.$Message.success("修改成功");
            this.isShowAddForm = false;
            this.cancel();
          },
          (error) => {
            console.log(error);
            this.$Message.error("修改失败");
          }
        );
      });
    },

    // 修改上架子级
    updatedChildPutaway(id) {
      var query = new this.ParseServer.Query("CoursesModule");
      query.equalTo("parent_ID", id);
      query.limit(10000);
      query.find().then((response) => {
        if (response && response.length > 0) {
          response.forEach((data) => {
            console.log(data);
            item.set("putaway", this.form.putaway);
            this.updatedChildPutaway(data.id);
          });
        }
      });
    },

    // 富文本说明
    change_value(html) {
      this.form.explain = html == "<p><br></p>" ? "" : html;
      // this.$refs["form"].validate();
    },

    // 系列课程介绍
    change_introduce(html) {
      this.form.introduce = html == "<p><br></p>" ? "" : html;
      // this.$refs["form"].validate();
    },

    /**
     * 封面图上传完成
     */
    handleUploadComplate(urls) {
      console.log(urls);
      this.form.headImg = urls;
    },

    /**
     * 讲师头像上传完成
     */
    handleUploadComplates(urls) {
      console.log(urls);
      this.form.portrait = urls;
      console.log(this.form);
    },

    cancel() {
      this.form = JSON.parse(this.init_data);
      this.isShowAddForm = false;
    },
    get_entity() {
      console.log("asc");
      console.log(this.courseId);
      var query = new this.ParseServer.Query("CoursesModule");
      query.get(this.courseId).then((res) => {
        console.log(res);
        console.log(res.get("portrait"));
        console.log(res.get("subjectName"));
        this.flag = res.get("flag");
        this.form.subjectName = res.get("subjectName");
        this.form.subTitle1 = res.get("subTitle1");
        this.form.subTitle2 = res.get("subTitle2");
        this.form.vip = res.get("vip");
        this.form.hide = res.get("hide");
        this.form.putaway = res.get("putaway");
        if (res.get("kind")) {
          this.form.kind = res.get("kind");
        }
        this.form.introduce = res.get("introduce");
        this.form.tag = res.get("tag") ? res.get("tag").id : "";
        this.form.order = res.get("order");
        this.form.portrait = res.get("portrait");
        if (res.get("headImg")) {
          this.form.headImg = res.get("headImg");
        }
        this.form.lecturerName = res.get("lecturerName");
        this.form.link = res.get("link");
        this.form.explain = res.get("explain");
        console.log(this.form);
      });
    },
    addCourses(data) {
      console.log("qwd");
      this.courseId = "";
      this.form = JSON.parse(this.init_data);
      if (data == 1) {
        this.showRadio = false;
        this.flag = 1;
        this.window_title = "新增系列课程";
      } else {
        this.requiredLink = true;
        this.showRadio = true;
        this.flag = 2;
        this.window_title = "新增单独课程";
      }
      this.isShowAddForm = true;
    },

    /**
     * 弹出编辑窗口
     */
    EditFormShow(row) {
      console.log(row);
      this.isExamineCompile = 1;
      this.courseId = row.id;
      if (row.flag == 1 && row.level > 0) {
        this.showRadio = true;
        this.isShowChildCourse = true;
      } else if (row.flag == 1 && row.level == 0) {
        this.showRadio = false;
        this.isShowAddForm = true;
      } else if (row.flag == 2) {
        console.log("seddcewc");
        console.log(row);
        if (row.kind == 3 || row.kind == 4) {
          this.requiredLink = false;
        } else {
          this.requiredLink = true;
        }
        this.showRadio = true;
        this.isShowAddForm = true;
      }
      this.get_entity();
    },

    /**
     * 弹出查看窗口
     */
    ExamineFormShow(row) {
      console.log(row);
      this.isExamineCompile = 2;
      this.courseId = row.id;
      if (row.flag == 1 && row.level > 0) {
        this.showRadio = true;
        this.isShowChildCourse = true;
      } else if (row.flag == 1 && row.level == 0) {
        this.showRadio = false;
        this.isShowAddForm = true;
      } else if (row.flag == 2) {
        this.showRadio = true;
        this.isShowAddForm = true;
      }
      this.get_entity();
    },

    catalogueUpdateds() {
      console.log("ewd");
    },

    add_courses() {
      console.log(this.showRadio);
      // 判断是系列课程还是单独课程
      this.$refs["courseForm"].validate((valid) => {
        console.log(valid);
        if (!valid) {
          this.$Message.error("请检查表单项");
          this.modalLoading = false;
          setTimeout(() => {
            this.modalLoading = true;
          }, 100);
          return false;
        } else {
          var query = new this.ParseServer.Query("CoursesModule");
          query.equalTo("order", Number(this.form.order));
          query.limit(10000);
          if (this.flag == 2 && this.courseId == "") {
            // console.log("sdcsdcdscsdcsdcsdcsdc");
            query.find().then((response) => {
              console.log(response);
              if (response && response.length > 0) {
                this.$Message.error("排序已存在");
                this.modalLoading = false;
                setTimeout(() => {
                  this.modalLoading = true;
                }, 100);
                return false;
              } else {
                this.isShowAlone = true;
                this.isShowAddForm = false;
              }
            });
          } else if (this.flag == 2 && this.courseId) {
            query.find().then((response) => {
              console.log(this.courseId);
              if (response && response.length > 0) {
                if (this.courseId == response[0].id) {
                  console.log("2");
                  this.isShowAlone = true;
                  this.isShowAddForm = false;
                } else {
                  console.log("sdcsd");
                  this.$Message.error("排序已存在");
                  this.modalLoading = false;
                  setTimeout(() => {
                    this.modalLoading = true;
                  }, 100);
                  return false;
                }
              } else {
                this.isShowAlone = true;
                this.isShowAddForm = false;
              }
            });
          } else {
            //新增系列课程
            this.add_series();
            console.log("新增系列课程");
          }
        }
      });
    },

    //  弹出系列课程-子课程弹框
    addChildCourse() {
      this.cancel();
      this.courseId = "";
      this.isShowChildCourse = true;
      this.showRadio = true;
      this.flag = 1;
    },

    //新增系列课程-子课程
    add_ChildCourse() {
      console.log(this.rootId);
      console.log("ASW");
      if (this.form.kind == 3 || this.form.kind == 4) {
        this.requiredLink = false;
      } else {
        this.requiredLink = true;
      }
      if (this.isExamineCompile == 2) {
        this.isShowChildCourse = false;
        this.cancel();
        this.page_list();
      } else {
        if (this.courseId && this.form.kind == 4) {
          this.updated_series_catalog(); //修改系列课程目录
        } else {
          this.$refs["seriesCourseForm"].validate((valid) => {
            console.log(valid);
            if (!valid) {
              this.$Message.error("请检查表单项");
              this.modalLoading = false;
              setTimeout(() => {
                this.modalLoading = true;
              }, 100);
              return false;
            } else {
              if (this.form.kind != 4) {
                this.isShowChildCourse = false;
                this.isShowAlone = true;
              } else {
                // 保存 目录
                var courses = this.ParseServer.Object.extend("CoursesModule");
                var course = new courses();
                if (this.form.tag) {
                  var ClassOfMyObject =
                    this.ParseServer.Object.extend("LabelManagement");
                  var myObject = ClassOfMyObject.createWithoutData(
                    this.form.tag
                  );
                  course.set("tag", myObject);
                }
                course.set("flag", this.flag);
                course.set("headImg", this.form.headImg);
                course.set("subjectName", this.form.subjectName);
                course.set("vip", this.form.vip);
                course.set("hide", this.form.hide);
                course.set("kind", this.form.kind);
                course.set("rootId", this.rootId);
                course.set("level", this.currLevel);
                course.set("parent_ID", this.currParent.id);
                course.set("has_down_level", this.form.has_down_level);
                course.save().then(
                  (course) => {
                    this.updateParent(this.currParent.id);
                    this.$Message.success("保存成功");
                    this.cancel();
                    this.isShowChildCourse = false;
                    this.page_list();
                  },
                  (error) => {
                    console.log(error);
                    this.$Message.error("保存失败");
                  }
                );
              }
            }
          });
        }
      }
      console.log("aasd");
    },

    //新增系列课程
    add_series() {
      // 修改
      if (this.courseId) {
        this.updated_seriesCourse(); //修改系列课程
      } else {
        console.log(this.form.order);
        //判断排序
        var query = new this.ParseServer.Query("CoursesModule");
        query.equalTo("order", Number(this.form.order));
        query.limit(10000);
        query.find().then((response) => {
          console.log(response);
          if (response && response.length > 0) {
            this.$Message.error("排序已存在");
            this.modalLoading = false;
            setTimeout(() => {
              this.modalLoading = true;
            }, 100);
            return false;
          } else {
            // 保存
            var courses = this.ParseServer.Object.extend("CoursesModule");
            var course = new courses();
            if (this.form.tag) {
              var ClassOfMyObject =
                this.ParseServer.Object.extend("LabelManagement");
              var myObject = ClassOfMyObject.createWithoutData(this.form.tag);
              course.set("tag", myObject);
            }
            course.set("flag", this.flag);
            course.set("headImg", this.form.headImg);
            course.set("putaway", this.form.putaway);
            course.set("hide", this.form.hide);
            course.set("subjectName", this.form.subjectName);
            course.set("subTitle1", this.form.subTitle1);
            course.set("subTitle2", this.form.subTitle2);
            course.set("vip", this.form.vip);
            course.set("introduce", this.form.introduce);
            // course.set("isVipLook", this.form.isVipLook);
            course.set("order", Number(this.form.order));
            course.set("headImg", this.form.headImg);
            course.set("portrait", this.form.portrait);
            course.set("lecturerName", this.form.lecturerName);
            course.set("rootId", this.rootId);
            course.set("level", this.currLevel);
            course.set("parent_ID", this.currParent.id);
            course.set("has_down_level", this.form.has_down_level);
            course.save().then(
              (course) => {
                this.$Message.success("保存成功");
                this.cancel();
                this.isShowAddForm = false;
                this.page_list();
              },
              (error) => {
                console.log(error);
                this.$Message.error("保存失败");
              }
            );
          }
        });
      }
    },

    //新增单独课程
    add_alone() {
      console.log(this.form);
      console.log("新增单独课程");
      if (this.form.kind == 3 || this.form.kind == 4) {
        this.requiredLink = false;
      } else {
        this.requiredLink = true;
      }
      // 修改
      if (this.courseId) {
        this.updated_aloneCourse();
      } else {
        console.log("asqw");
        console.log(this.requiredLink);
        if (this.requiredLink) {
          this.$refs["courseForm"].validate((valid) => {
            console.log(valid);
            if (!valid) {
              this.$Message.error("请检查表单项");
              this.modalLoading = false;
              setTimeout(() => {
                this.modalLoading = true;
              }, 100);
              return false;
            } else {
              console.log("qwdqW");
              // 保存
              this.$nextTick(() => {
                this.getDuration();
              });
            }
          });
        } else {
          this.add_alone_series();
          // console.log("awsqcqWC");
          // if (this.form.kind == 1 || this.form.kind == 2) {
          //   this.getDuration();
          // } else {
          //   this.add_alone_series();
          // }
        }
      }
    },

    // 系列课程 - 单独课程
    add_alone_series() {
      var courses = this.ParseServer.Object.extend("CoursesModule");
      var course = new courses();
      if (this.form.tag) {
        var ClassOfMyObject = this.ParseServer.Object.extend("LabelManagement");
        var myObject = ClassOfMyObject.createWithoutData(this.form.tag);
        course.set("tag", myObject);
      }
      course.set("flag", this.flag);
      course.set("putaway", this.form.putaway);
      course.set("hide", this.form.hide);
      course.set("subjectName", this.form.subjectName);
      course.set("subTitle1", this.form.subTitle1);
      course.set("subTitle2", this.form.subTitle2);
      course.set("vip", this.form.vip);
      course.set("hide", this.form.hide);
      // course.set("isVipLook", this.form.isVipLook);
      course.set("kind", this.form.kind);
      course.set("order", Number(this.form.order));
      course.set("portrait", this.form.portrait);
      course.set("lecturerName", this.form.lecturerName);
      course.set("link", this.form.link);
      if (this.form.duration != "") {
        console.log("qws");
        course.set("duration", this.form.duration);
      } else {
        course.set("duration", "");
      }
      course.set("explain", this.form.explain);
      if (this.flag == 1) {
        course.set("level", this.currLevel);
        course.set("parent_ID", this.currParent.id);
        course.set("rootId", this.rootId);
        course.set("has_down_level", this.form.has_down_level);
      }
      course.save().then(
        (course) => {
          if (this.currParent.id != "0" && this.flag == 1) {
            this.updateParent(this.currParent.id);
          } else {
            this.$Message.success("保存成功");
            this.cancel();
            this.isShowAlone = false;
            this.page_list();
          }
        },
        (error) => {
          console.log(error);
          this.$Message.error("保存失败");
        }
      );
    },
    getDuration() {
      console.log("12222");
      console.log(this.form.link);
      var src = this.form.link;
      var audio = document.createElement("audio");
      audio.src = src;
      audio.load();
      var _this = this;
      audio.oncanplay = function () {
        console.log(audio.duration);
        _this.form.duration = _this.sToHs(Math.floor(audio.duration * 1000));
        console.log(_this.form.duration);
        _this.add_alone_series();
      };
    },

    // 时长解析
    sToHs(s) {
      let h;
      s = s / 1000;
      h = Math.floor(s / 60);
      s = Math.floor(s % 60);
      h += "";
      s += "";
      h = h.length === 1 ? "0" + h : h;
      s = s.length === 1 ? "0" + s : s;
      return h + ":" + s;
    },

    /** 更新父级科目 */
    updateParent(parentId) {
      console.log(parentId + "父级id");
      console.log(+"wqdQW121111");
      var query = new this.ParseServer.Query("CoursesModule");
      query.equalTo("parent_ID", parentId);
      query.limit(10000);
      query.find().then((childrens) => {
        let hasChildren = false;
        childrens.forEach((_item, _index) => {
          hasChildren = true;
        });
        var query1 = new this.ParseServer.Query("CoursesModule");
        query1.get(parentId).then((parent) => {
          console.log(parent);
          parent.set("has_down_level", hasChildren);
          parent.save().then((result) => {
            if (parent.get("parent_ID") != "0") {
              this.updateParent(parent.get("parent_ID"));
            } else {
              this.$Message.success("保存成功");
              this.isShowAlone = false;
              this.page_list(1);
              this.cancel();
            }
          });
        });
      });
    },

    // 修改系列课程目录
    updated_series_catalog() {
      console.log("修改系列课程目录");
      var query = new this.ParseServer.Query("CoursesModule");
      query.get(this.courseId).then((item) => {
        console.log(item);
        if (this.form.tag) {
          var ClassOfMyObject =
            this.ParseServer.Object.extend("LabelManagement");
          var myObject = ClassOfMyObject.createWithoutData(this.form.tag);
          item.set("tag", myObject);
        }
        item.set("flag", this.flag);
        item.set("headImg", this.form.headImg);
        item.set("subjectName", this.form.subjectName);
        item.set("vip", this.form.vip);
        item.set("hide", this.form.hide);
        item.set("kind", this.form.kind);
        item.set("rootId", this.rootId);
        item.set("level", this.currLevel);
        item.set("parent_ID", this.currParent.id);
        item.set("has_down_level", this.form.has_down_level);
        item.save().then(
          () => {
            this.$Message.success("修改成功");
            this.isShowChildCourse = false;
            this.cancel();
            this.page_list();
          },
          (error) => {
            console.log(error);
            this.$Message.error("修改失败");
          }
        );
      });
    },

    //修改系列课程
    updated_seriesCourse() {
      if (this.isExamineCompile == 2) {
        this.isShowAddForm = false;
        this.cancel();
        this.page_list();
      } else {
        var query = new this.ParseServer.Query("CoursesModule");
        query.equalTo("order", Number(this.form.order));
        query.limit(10000);
        query.find().then((response) => {
          console.log(this.courseId);
          if (response && response.length > 0) {
            if (this.courseId == response[0].id) {
              console.log("2");
              this.updatedCourse();
            } else {
              console.log("sdcsd");
              this.$Message.error("排序已存在");
              this.modalLoading = false;
              setTimeout(() => {
                this.modalLoading = true;
              }, 100);
              return false;
            }
          } else {
            this.updatedCourse();
          }
        });
      }
    },

    // 修改课程
    updatedCourse() {
      var query = new this.ParseServer.Query("CoursesModule");
      query.get(this.courseId).then((item) => {
        console.log(item);
        if (this.form.tag) {
          var ClassOfMyObject =
            this.ParseServer.Object.extend("LabelManagement");
          var myObject = ClassOfMyObject.createWithoutData(this.form.tag);
          item.set("tag", myObject);
        }
        item.set("flag", this.flag);
        item.set("headImg", this.form.headImg);
        item.set("putaway", this.form.putaway);
        item.set("hide", this.form.hide);
        item.set("subjectName", this.form.subjectName);
        item.set("subTitle1", this.form.subTitle1);
        item.set("subTitle2", this.form.subTitle2);
        item.set("vip", this.form.vip);
        // course.set("isVipLook", this.form.isVipLook);
        item.set("order", Number(this.form.order));
        item.set("portrait", this.form.portrait);
        item.set("headImg", this.form.headImg);
        item.set("lecturerName", this.form.lecturerName);
        item.save().then(
          () => {
            this.$Message.success("修改成功");
            this.isShowAddForm = false;
            this.cancel();
            this.page_list();
          },
          (error) => {
            console.log(error);
            this.$Message.error("修改失败");
          }
        );
      });
    },

    // 修改单独课程
    updated_aloneCourse() {
      if (this.isExamineCompile == 2) {
        console.log("修稿单独");
        this.isShowAlone = false;
        this.cancel();
        this.page_list();
      } else {
        var query = new this.ParseServer.Query("CoursesModule");
        query.get(this.courseId).then((item) => {
          console.log(item);
          if (this.form.tag) {
            var ClassOfMyObject =
              this.ParseServer.Object.extend("LabelManagement");
            var myObject = ClassOfMyObject.createWithoutData(this.form.tag);
            item.set("tag", myObject);
          }
          item.set("flag", this.flag);
          item.set("headImg", this.form.headImg);
          item.set("putaway", this.form.putaway);
          item.set("hide", this.form.hide);
          item.set("subjectName", this.form.subjectName);
          item.set("subTitle1", this.form.subTitle1);
          item.set("subTitle2", this.form.subTitle2);
          item.set("vip", this.form.vip);
          // course.set("isVipLook", this.form.isVipLook);
          item.set("kind", this.form.kind);
          item.set("order", Number(this.form.order));
          item.set("portrait", this.form.portrait);
          item.set("lecturerName", this.form.lecturerName);
          item.set("link", this.form.link);
          item.set("explain", this.form.explain);
          item.save().then(
            () => {
              this.$Message.success("修改成功");
              this.isShowAlone = false;
              this.cancel();
              this.page_list();
            },
            (error) => {
              console.log(error);
              this.$Message.error("修改失败");
            }
          );
        });
      }
    },

    // 介绍
    Editintroduce(data) {
      console.log("介绍");
      this.courseId = data.id;
      this.get_entity();
      this.isIntroduce = true;
    },

    //新增系列课程介绍
    add_introduce() {
      console.log(this.courseId);
      console.log(this.form.introduce + "介绍一11111111111111");
      var query = new this.ParseServer.Query("CoursesModule");
      query.get(this.courseId).then((item) => {
        item.set("introduce", this.form.introduce);
        item.save().then(
          (items) => {
            this.$Message.success("修改成功");
            this.cancel();
            this.page_list();
            this.isIntroduce = false;
          },
          (error) => {
            console.log(error);
            this.$Message.error("修改失败");
          }
        );
        console.log(this.form);
      });
    },

    search() {
      console.log(this.search_keyword);
      this.page = 1;
      this.page_list(this.page);
    },
    pagechange(e) {
      this.page = e;
      this.page_list();
    },

    pagechanges(e) {
      this.pages = e;
      this.recommendCourseList();
    },

    page_list(page_index) {
      console.log(this.flag);
      console.log(this.currParent.id);
      let _this = this;
      const query1 = new this.ParseServer.Query("CoursesModule");
      if (this.flag == 1) {
        query1.equalTo("parent_ID", this.currParent.id);
      }

      const query2 = new this.ParseServer.Query("CoursesModule");
      query2.equalTo("flag", this.flag);

      const query3 = new this.ParseServer.Query("CoursesModule");
      if (this.search_type) {
        let type;
        this.search_type == 1 ? (type = true) : (type = false);
        query3.equalTo("vip", type);
      }

      const query4 = new this.ParseServer.Query("CoursesModule");
      if (this.search_keyword) {
        query4.contains("subjectName", this.search_keyword);
      }

      let user5 = new this.ParseServer.Query("CoursesModule");
      if (this.search_start_date) {
        user5.greaterThan("createdAt", this.search_start_date);
      }
      let user6 = new this.ParseServer.Query("CoursesModule");
      if (this.search_end_date) {
        user6.lessThan("createdAt", tool.addDays(this.search_end_date, 1));
      }

      var query = new this.ParseServer.Query.and(
        new this.ParseServer.Query.and(query1, query2, query3, query4),
        user5,
        user6
      );

      // let query = new this.ParseServer.Query("CoursesModule");
      // if (this.flag == 1) {
      //   query.equalTo("parent_ID", this.currParent.id);
      // }
      // query.contains("subjectName", this.search_keyword);
      // query.equalTo("flag", _this.flag);
      query.descending("createdAt");
      query.count().then((count) => {
        _this.total = count;
      });
      query.skip((this.page - 1) * this.pageSize);
      query.limit(this.pageSize);
      query.find().then(
        (list) => {
          console.log(list);
          _this.courses_datas = [];
          if (list && list.length > 0) {
            console.log(list);
            list.forEach((item) => {
              console.log(item.get("kind") + "种类");
              console.log(item.id);
              console.log(item.get("hide"));
              _this.courses_datas.push({
                id: item.id,
                flag: item.get("flag"),
                subjectName: item.get("subjectName"),
                realname: item.get("realname"),
                subTitle1: item.get("subTitle1"),
                subTitle2: item.get("subTitle2"),
                order: item.get("order"),
                lecturerName: item.get("lecturerName"),
                vip: item.get("vip"),
                kind: item.get("kind"),
                hide: item.get("hide"),
                tagName: item.get("tag")
                  ? item.get("tag").attributes.tagName
                  : "",
                putaway: item.get("putaway"),
                has_down_level: item.get("has_down_level"),
                level: item.get("level"),
                // isVipLook: item.get("isVipLook"),
                updatedAt: tool.dateFormat(
                  item.get("updatedAt"),
                  "yyyy-MM-dd HH:mm:ss"
                ),
              });
            });
            console.log(this.form);
            console.log(this.courses_datas);
          }
          // this.isShowAddForm = false;
          this.loading = false;
          console.log(
            this.flag +
              "flagflagflagflagflagflagflagflagflagflagflagflagflagflagflagflagflagflagflag"
          );
        },
        (error) => {
          // debugger;
        }
      );
    },

    delete(parent_id) {
      console.log(parent_id);
      var query_deletes = new this.ParseServer.Query("CoursesModule");
      query_deletes.equalTo("parent_ID", parent_id);
      query_deletes.limit(10000);
      query_deletes.find().then((response) => {
        if (response && response.length > 0) {
          response.forEach((data) => {
            data.destroy().then((result) => {
              this.delete(data.id);
            });
          });
        }
      });
    },

    DelConfirmShow(row) {
      console.log(row);
      var id = row.id;
      console.log(id);
      let _this = this;
      var query1 = new this.ParseServer.Query("ModuleAssociatedCourses");
      var ClassOfMyObject = this.ParseServer.Object.extend("CoursesModule");
      var queryId = ClassOfMyObject.createWithoutData(id);
      console.log(queryId);
      query1.equalTo("course", queryId);
      query1.find().then((response) => {
        console.log(response.length);
        if (response.length > 0) {
          //如果模块有添加的课程 不能删除
          this.$Message.error("首页模块已有添加此课程,不能删除!");
        } else {
          this.$Modal.confirm({
            title: "删除提示",
            content: "<p>当前课程模块会被删除，确定要删除吗？</p>",
            onOk: () => {
              var query = new this.ParseServer.Query("CoursesModule");
              query.get(id).then((response) => {
                console.log(response.id);
                // 删除所有的子组件
                this.delete(response.id);
                // 删除当前组件
                response.destroy().then((delete_result) => {
                  // 更新当前的父级组件是否还存在其他的子组件
                  var query1 = new this.ParseServer.Query("CoursesModule");
                  query1.equalTo("parent_ID", response.get("parent_ID"));
                  query1.find().then((result) => {
                    if (result.length == 0) {
                      var query_get = new this.ParseServer.Query(
                        "CoursesModule"
                      );
                      if (
                        response.get("parent_ID") == "0" ||
                        response.get("parent_ID") == ""
                      ) {
                        this.$Message.success("删除成功");
                        this.page = 1;
                        _this.page_list(this.page);
                        return;
                      }
                      query_get
                        .get(response.get("parent_ID"))
                        .then((subject) => {
                          subject.set("has_down_level", false);
                          subject.save().then((r) => {
                            this.$Message.success("删除成功");
                            this.page = 1;
                            _this.page_list(this.page);
                            _this.ShowParents();
                          });
                        });
                    } else {
                      this.$Message.success("删除成功");
                      this.page = 1;
                      _this.page_list(this.page);
                    }
                  });
                });
              });
            },
            onCancel: () => {
              this.$Message.info("取消了操作");
            },
          });
        }
      });
    },

    // 系列课程单击事件
    subjectNameClick(data) {
      console.log(data);
      this.pages = 1;
      this.currParents.id = data.id;
      this.recommendCourseList();
    },

    //推荐课程
    recommendCourse(data) {
      console.log(data);
      this.recommendCourseId = data.id;
      var query = new this.ParseServer.Query("CoursesModule");
      query.equalTo("objectId", this.recommendCourseId);
      query.find().then(
        (list) => {
          this.checkData = [];
          console.log(this.checkData);
          if (list && list.length > 0) {
            list.forEach((item) => {
              console.log(item);
              console.log(item.get("checkData"));
              if (item.get("checkData")) {
                this.checkData = item.get("checkData");
              }
            });
            console.log(this.checkData);
            console.log(this.recommend_courses_datas);
          }
          // this.loading = false;
        },
        (error) => {
          debugger;
        }
      );

      this.$nextTick(() => {
        this.pages = 1;
        this.currParents.id = "0";
        this.isShowRecommendCourse = true;
        this.recommendCourseList();
      });
    },

    // 推荐课程list
    recommendCourseList() {
      let _this = this;
      console.log(this.currParents.id);
      const query1 = new this.ParseServer.Query("CoursesModule");
      query1.equalTo("parent_ID", this.currParents.id);

      if (this.currParents.id == 0) {
        const query2 = new this.ParseServer.Query("CoursesModule");
        query2.equalTo("flag", 2);
        var query = new this.ParseServer.Query.or(query1, query2);
      } else {
        var query = new this.ParseServer.Query.or(query1);
      }
      query.descending("createdAt");
      query.count().then((count) => {
        _this.totals = count;
      });
      query.skip((this.pages - 1) * this.pageSize);
      query.limit(this.pageSize);
      query.find().then(
        (list) => {
          _this.recommend_courses_datas = [];
          if (list && list.length > 0) {
            list.forEach((item) => {
              console.log(item);
              console.log(item.get("checkData"));
              _this.recommend_courses_datas.push({
                id: item.id,
                flag: item.get("flag"),
                subjectName: item.get("subjectName"),
                realname: item.get("realname"),
                subTitle1: item.get("subTitle1"),
                subTitle2: item.get("subTitle2"),
                order: item.get("order"),
                lecturerName: item.get("lecturerName"),
                vip: item.get("vip"),
                kind: item.get("kind"),
                hide: item.get("hide"),
                tagName: item.get("tag")
                  ? item.get("tag").attributes.tagName
                  : "",
                putaway: item.get("putaway"),
                has_down_level: item.get("has_down_level"),
                level: item.get("level"),
                // isVipLook: item.get("isVipLook"),
                updatedAt: tool.dateFormat(
                  item.get("updatedAt"),
                  "yyyy-MM-dd HH:mm:ss"
                ),
              });
            });
          }
          // this.loading = false;
        },
        (error) => {
          // debugger;
        }
      );
    },

    //添加推荐课程
    add_RecommendCourse() {
      console.log(this.checkData);
      // let checkData = [...new Set(this.checkDatas)].filter((item) => item);
      // console.log(checkData);
      // console.log("add_RecommendCourse");
      var query = new this.ParseServer.Query("CoursesModule");
      query.get(this.recommendCourseId).then((item) => {
        item.set("checkData", this.checkData);
        item.save().then(
          () => {
            this.currParents.id = "0";
            this.page = 1;
            this.$Message.success("修改成功");
            this.isShowRecommendCourse = false;
            this.cancel();
          },
          (error) => {
            console.log(error);
            this.$Message.error("修改失败");
          }
        );
      });
    },
  },
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
.addCourse {
  display: flex;
  justify-content: flex-end;
}
.qrcode {
  display: inline-block;
  img {
    width: 336px;
    height: 220px;
  }
}
</style>
