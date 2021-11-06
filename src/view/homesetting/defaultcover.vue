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
      </div>
       <div class="search-btn" style="width:150px;margin:0">
          <Button type="primary" class="search-btn" @click="search">搜索</Button></Col>
        </div>
      
    </div>
    <Row class="table-wrap">
        <div style="width:100px; margin-left: auto;
    margin-bottom: 20px;">
        <Button type="primary" @click="addCover">新增封面图</Button>
      </div>
      <Table :loading="loading" :columns="columns" :data="datas">
        <template slot-scope="{ row }" slot="surface">
         <div v-if="row.surface.length>0" style="margin:5px 0"><img :src="row.surface" @click="handleShowImg(row)" width="84" height="58"></div>
       </template>
          <template slot-scope="{ row }" slot="isUse">
                 <i-switch v-model="row.isUse" @on-change="showRandomClick(row)"     size="large" />
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
            :onethis='true'
            accept=".*"
          ></myUploadMuti>
        </FormItem>
         <FormItem label="是否参与随机展示:">
                        <i-switch v-model="form.isUse"  size="large" />
        </FormItem>
      </Form>
    </Modal>


    <Modal @on-visible-change="handleVChange" width="450" title="查看大图" v-model="isShowImg">
            <div style="margin:5px 0;text-align:center"><img :src="currBackgroundImg" width="336" height="222"></div>
        </Modal>
  </div>
    </div>
</template>

<script>
import { tool } from "@/api/tool";
import myUploadMuti from "@/components/myUploadMuti";
export default {
  name: "coursesmanageindex",
  components: {
    myUploadMuti,
  },
  data() {
    return {
      isShowImg: false,
      currBackgroundImg: "",
      page: 1,
      pageSize: 10,
      total: 0,
      search_keyword: "",
      columns: [
        { title: "ID", key: "id" },
        { title: "缩略图", key: "surface", slot: "surface" },
        { title: "是否使用", key: "isUse", slot: "isUse" },
        { title: "更新时间", key: "updatedAt" },
        { title: "更新人", key: "updatedBy" },
        { title: "操作", key: "action", width: 400, slot: "action" },
      ],
      datas: [],
      form: {
        surface: [], //新增封面图
        isUse: true, //是否随机展示
      },
      ruleValidate: {},
      isShowAddForm: false,
      loading: true,
      window_title: "新增封面图",
    };
  },
  mounted() {
    this.form.updatedBy = this.ParseServer.User.current().toJSON().realname;
    this.init_data = JSON.stringify(this.form);
    this.page_list(this.page);
  },
  methods: {
    handleVChange(r) {
      this.isShowImg = r;
    },
    handleShowImg(row) {
      this.isShowImg = true;
      this.currBackgroundImg = row.surface;
    },

    /**
     * 封面图上传完成
     */
    handleUploadComplate(urls) {
      console.log(urls);
      this.form.surface = urls;
    },

    //是否随机展示切换
    showRandomClick(data) {
      this.id = data.id;
      this.form.isUse = data.isUse;
      this.randomId = data.id;
      this.updateds();
    },

    // 修改随机展示切换
    updateds(flag) {
      var query = new this.ParseServer.Query("DefaultCover");
      query.get(this.randomId).then((item) => {
        item.set("isUse", this.form.isUse);
        item.save().then(
          () => {
            this.$Message.success("修改成功");
            this.isShowAddForm = false;
          },
          (error) => {
            console.log(error);
            this.$Message.error("修改失败");
          }
        );
      });
    },

    addCover() {
      this.Id = "";
      this.form = {
        surface: [], //新增封面图
        isUse: true, //是否随机展示
      };
      this.window_title = "新增封面图";
      this.isShowAddForm = true;
    },

    /**
     * 弹出编辑窗口
     */
    EditFormShow(row) {
      console.log(row);
      this.Id = row.id;
      console.log(this.Id);
      this.form.surface = row.surface;
      this.form.isUse = row.isUse;
      this.isShowAddForm = true;
      this.window_title = "编辑封面图管理";
    },

    /*
     *新增封面图管理
     */
    add_cover() {
      this.form.updatedBy = this.ParseServer.User.current().toJSON().realname;
      console.log(this.Id);
      var datas = this.ParseServer.Object.extend("DefaultCover");
      var data = new datas();
      console.log(this.form);
      // 修改
      if (this.Id) {
        this.updated();
      } else {
        // 保存
        data.set("updatedBy", this.form.updatedBy);
        data.set("surface", this.form.surface);
        data.set("isUse", this.form.isUse);
        data.save().then(
          (data) => {
            this.$Message.success("保存成功");
            this.page_list();
          },
          (error) => {
            console.log(error);
            this.$Message.error("保存失败");
          }
        );

        // this.$refs["form"].validate((valid) => {
        //   if (!valid) {
        //     this.$Message.error("请检查表单项");
        //     this.loading = false;
        //     setTimeout(() => {
        //       this.loading = true;
        //     }, 100);
        //     return false;
        //   } else {
        //     // 保存
        //     data.set("surface", this.form.surface);
        //     data.set("isUse", this.form.isUse);
        //     data.save().then(
        //       (data) => {
        //         this.$Message.success("保存成功");
        //         this.page_list();
        //       },
        //       (error) => {
        //         console.log(error);
        //         this.$Message.error("保存失败");
        //       }
        //     );
        //   }
        // });
      }
    },

    updated() {
      console.log(this.Id);
      var query = new this.ParseServer.Query("DefaultCover");
      query.get(this.Id).then((item) => {
        console.log(item);
        item.set("updatedBy", this.form.updatedBy);
        item.set("surface", this.form.surface);
        item.set("isUse", this.form.isUse);
        item.save().then(
          (item) => {
            this.$Message.success("修改成功");
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
      let query = new this.ParseServer.Query("DefaultCover");
      //   query.contains("tagName", this.search_keyword);
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
              console.log(item.id);
              _this.datas.push({
                id: item.id,
                surface: item.get("surface"),
                isUse: item.get("isUse"),
                updatedBy: item.get("updatedBy"),
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
      var query_deletes = new this.ParseServer.Query("DefaultCover");
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

    DelConfirmShow(row) {
      console.log(row);
      var id = row.id;
      console.log(id);
      let _this = this;
      this.$Modal.confirm({
        title: "删除提示",
        content: "<p>当前默认封面图会被删除，确定要删除吗？</p>",
        onOk: () => {
          var query = new this.ParseServer.Query("DefaultCover");
          query.get(id).then((response) => {
            console.log(response.id);
            this.delete(id);
            // 删除当前组件
          });
        },
        onCancel: () => {
          this.$Message.info("取消了操作");
        },
      });
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
</style>
