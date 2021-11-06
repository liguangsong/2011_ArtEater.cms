<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix" style="display:flex">
      <div class="search-wrap clear-fix" style="flex:1">
        <div class="search-keyword" style="width:230px">
          <Input
            v-model="search_keyword"
            size="large"
            placeholder="名称关键字搜索"
            style="width:200px"
          />
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
       
      </div>
       <div class="search-btn" style="width:150px;margin:0">
          <Button type="primary" class="search-btn" @click="search">搜索</Button></Col>
        </div>
      
    </div>
    <Row class="table-wrap">
        <div style="width:100px; margin-left: auto;
    margin-bottom: 20px;">
        <Button type="primary" @click="addLabel">新增标签</Button>
      </div>
      <Table :loading="loading" :columns="columns" :data="datas">
        <template slot-scope="{ row }" slot="note">
             <div v-if="row.isValue">
                    <div style="display: flex;align-items: center;" v-if="row.flag"><span  class="overflow">{{row.note}}</span><span v-if="row.note.length>16" class="flag" @click="annotationClick(row)"><img src="../../assets/images/down.png" alt="" srcset=""></span> </div>
                <div style="display: flex;align-items: center;" v-if="row.flag == false"> <span style="flex:1">{{row.note}}</span> <span v-if="row.note.length>16" class="flag" @click="annotationClick(row)"><img src="../../assets/images/up.png" alt="" srcset=""></span> </div>
             </div>
       </template>
        <template slot-scope="{ row }" slot="action">
          <Button
            type="warning"
            size="small"
            style="margin-right:5px"
            @click="EditFormShow(row)"
            >编辑</Button
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
       width="600"
      mask
      scrollable
      :loading="modalLoading"
      @on-ok="add_tag"
    >
      <Form
        v-if="isShowAddForm"
        ref="tagForm"
        :model="form"
        label-position="left"
        :label-width="90"
        :rules="ruleValidate"
      >
       <FormItem label="标签名称" prop="tagName">
          <Input
            v-model="form.tagName"
            placeholder="请输入标签名称"
          ></Input>
        </FormItem>
         <FormItem label="注释">
          <Input
            type="textarea"
            :rows="6"
           v-model="form.note"
            placeholder="购买说明"
            style="width:400px"
          ></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
    </div>
</template>

<script>
import { tool } from "@/api/tool";
export default {
  name: "coursesmanageindex",
  components: {},
  filters: {
    ellipsis(value) {
      console.log(value.length);
      if (!value) return "";
      if (value.length > 15) {
        return value.slice(0, 15) + "...";
      } else {
      }
      return value;
    },
  },

  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      tagId: "",
      note: true,
      search_keyword: "",
      realname: "",
      labelId: 0,
      search_start_date: "",
      search_end_date: "",
      route: [
        {
          id: "0",
          price: 0,
        },
      ],
      columns: [
        { title: "ID", key: "id" },
        { title: "标签名称", key: "tagName" },
        { title: "注释", key: "note", slot: "note" },
        { title: "更新时间", key: "updatedAt" },
        { title: "操作", key: "action", width: 400, slot: "action" },
      ],
      datas: [],
      form: {
        tagName: "", //标签名称
        note: "", //注释
      },
      ruleValidate: {
        tagName: [
          { required: true, message: "请输入标签名称", trigger: "blur" },
        ],
      },
      isShowAddForm: false,
      isShowContentForm: false,
      isShowCommentsForm: false,
      loading: true,
      modalLoading: true,
      window_title: "新增模块",
    };
  },

  // },
  mounted() {
    this.page_list(this.page);
  },
  methods: {
    cancel() {},
    get_entity() {
      var query = new this.ParseServer.Query("LabelManagement");
      query.get(this.tagId).then((res) => {
        console.log(res);
        this.form.tagName = res.get("tagName");
        this.form.note = res.get("note");
      });
    },
    addLabel() {
      this.tagId = "";
      this.form = {
        tagName: "", //标签名称
        note: "", //注释
      };
      this.window_title = "标签设置";
      this.isShowAddForm = true;
    },

    /**
     * 弹出编辑窗口
     */
    EditFormShow(row) {
      console.log(row);
      this.tagId = row.id;
      console.log(this.tagId);
      this.isShowAddForm = true;
      this.window_title = "编辑标签管理";
      this.get_entity();
    },

    /*
     *新增标签管理
     */
    add_tag() {
      console.log(this.tagId);
      var datas = this.ParseServer.Object.extend("LabelManagement");
      var data = new datas();
      console.log(this.form);
      // 修改
      if (this.tagId) {
        this.updated();
      } else {
        this.$refs["tagForm"].validate((valid) => {
          if (!valid) {
            this.$Message.error("请检查表单项");
            this.modalLoading = false;
            setTimeout(() => {
              this.modalLoading = true;
            }, 100);
            return false;
          } else {
            // 保存
            data.set("tagName", this.form.tagName);
            data.set("note", this.form.note);
            data.save().then(
              (data) => {
                this.$Message.success("保存成功");
                this.cancel();
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

    updated() {
      console.log(this.tagId);
      var query = new this.ParseServer.Query("LabelManagement");
      query.get(this.tagId).then((item) => {
        console.log(item);
        item.set("tagName", this.form.tagName);
        item.set("note", this.form.note);
        item.save().then(
          (item) => {
            this.$Message.success("修改成功");
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

    search() {
      console.log(this.search_keyword);
      this.page = 1;
      this.page_list(this.page);
    },
    pagechange(e) {
      this.page = e;
      this.page_list();
    },

    page_list(page_index) {
      let _this = this;
      let query = new this.ParseServer.Query("LabelManagement");
      let user1 = new this.ParseServer.Query("LabelManagement");
      user1.contains("tagName", this.search_keyword);
      let user2 = new this.ParseServer.Query("LabelManagement");
      if (this.search_start_date) {
        user2.greaterThan("createdAt", this.search_start_date);
      }
      let user3 = new this.ParseServer.Query("LabelManagement");
      if (this.search_end_date) {
        user3.lessThan("createdAt", tool.addDays(this.search_end_date, 1));
      }
      query = this.ParseServer.Query.and(
        this.ParseServer.Query.or(user1),
        user2,
        user3
      );
      query.descending("createdAt");
      query.count().then((count) => {
        _this.total = count;
      });
      query.skip((this.page - 1) * this.pageSize);
      query.limit(this.pageSize);
      query.find().then(
        (list) => {
          console.log(list);
          _this.datas = [];
          if (list && list.length > 0) {
            console.log(list);
            list.forEach((item) => {
              console.log(item.get("note").length);
              _this.datas.push({
                id: item.id,
                tagName: item.get("tagName"),
                flag: item.get("note").length > 15 ? true : false,
                isValue: item.get("note") ? true : false,
                note: item.get("note"),
                updatedAt: tool.dateFormat(
                  item.get("updatedAt"),
                  "yyyy-MM-dd HH:mm:ss"
                ),
              });
            });
            console.log(this.datas);
          }
          this.isShowAddForm = false;
          this.loading = false;
        },
        (error) => {
          console.log(error);
        }
      );
    },

    delete(id) {
      var query_deletes = new this.ParseServer.Query("LabelManagement");
      query_deletes.equalTo("objectId", id);
      query_deletes.limit(10000);
      query_deletes.find().then((response) => {
        console.log(response);
        if (response && response.length > 0) {
          response.forEach((data) => {
            data.destroy().then((result) => {
              console.log(result);
              this.$Message.success("删除成功");
              this.page_list();
            });
          });
        }
      });
    },

    async DelConfirmShow(row) {
      console.log(row);
      this.labelId = row.id;
      var id = row.id;
      let num = 0;
      let nums = 0;
      console.log(this.labelId);
      let _this = this;
      var query1 = new this.ParseServer.Query("coursesModule");
      var ClassOfMyObject = this.ParseServer.Object.extend("LabelManagement");
      var queryId = ClassOfMyObject.createWithoutData(id);
      console.log(queryId);
      query1.equalTo("tagId", queryId);
      query1.find().then((response) => {
        console.log(response.length);
        num = response.length;
      });
      var query2 = new this.ParseServer.Query("TestQuestions");
      var ClassOfMyObject = this.ParseServer.Object.extend("LabelManagement");
      var queryId = ClassOfMyObject.createWithoutData(id);
      console.log(queryId);
      query2.equalTo("tagId", queryId);
      query2.find().then((response) => {
        console.log(response.length);
        nums = response.length;
      });
      setTimeout(() => {
        this.labelDeletes(num, nums);
      }, 500);
    },

    labelDeletes(num, nums) {
      console.log(num);
      console.log(nums);
      if (num + nums > 0) {
        this.$Message.error("课程管理或试题管理已有添加此标签,不能删除!");
      } else {
        this.$Modal.confirm({
          title: "删除提示",
          content: "<p>当前标签管理会被删除，确定要删除吗？</p>",
          onOk: () => {
            var query = new this.ParseServer.Query("LabelManagement");
            query.get(this.labelId).then((response) => {
              console.log(response.id);
              this.delete(response.id);
              // 删除当前组件
            });
          },
          onCancel: () => {
            this.$Message.info("取消了操作");
          },
        });
      }
    },
    checkLogin() {},
    annotationClick(data) {
      console.log(data);
      data.flag = !data.flag;
    },
  },
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
