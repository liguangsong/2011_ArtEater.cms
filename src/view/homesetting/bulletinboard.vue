<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix" style="display:flex">
      <div class="search-wrap clear-fix" style="flex:1">
        <div class="search-keyword" style="width:230px">
          <Input
            v-model="search_keyword"
            size="large"
            placeholder="公告名称关键字搜索"
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
        <Button type="primary" @click="addBulletinBoard">新增公告</Button>
      </div>
      <Table :loading="loading" :columns="columns" :data="datas">
          <template slot-scope="{ row }" slot="isUse">
                 <i-switch v-model="row.isUse" @on-change="whetheru(row)"     size="large" />
       </template>

          <template slot-scope="{ row }" slot="type">
              <div v-if="row.type == 1">信息公告</div>
             <div v-if="row.type == 2">活动公告</div>
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
            type="warning"
            size="small"
            style="margin-right:5px"
            @click="MountInformation(row)"
            >挂载信息</Button
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
      @on-ok="add_bulletinBoard"
    >
      <Form
        v-if="isShowAddForm"
        ref="form"
        :model="form"
        label-position="left"
        :label-width="70"
        :rules="ruleValidate"
      >
          <FormItem label="公告名称" prop="name">
          <Input
           style="width: 200px"
            v-model="form.name"
            placeholder="请输入公告名称"
          ></Input>
        </FormItem>
        
         <FormItem label="公告类型:" prop="type">
          <Select
            size="large"
            v-model="form.type"
            class="choice"
            placeholder="请选择公告类型"
            :clearable="true"
            style="width: 200px"
          >
            <Option v-for="item in types" :key="item.id" :value="item.id">{{
              item.name
            }}</Option>
          </Select>
        </FormItem>

         <FormItem label="是否使用:">
                        <i-switch v-model="form.isUse"  size="large" />
        </FormItem>
      </Form>
    </Modal>
    
      
      <!-- 活动公告信息挂载 -->
        <Modal
      v-model="isMountInformation"
      :title="window_title"
       width="600"
      mask
      scrollable
      :loading="loading"
      @on-ok="add_MountInformation"
    >
      <Form
        v-if="isMountInformation"
        ref="form"
        :model="form"
        label-position="left"
        :label-width="70"
        :rules="ruleValidate"
      >
          <FormItem label="挂载链接" prop="link">
          <Input
           style="width: 200px"
            v-model="form.link"
            placeholder="请输入链接"
          ></Input>
        </FormItem>
      </Form>
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
        { title: "公告名称", key: "name", },
        { title: "是否展示", key: "isUse", slot: "isUse" },
        { title: "公告类型", key: "type" , slot: "type" },
        { title: "更新人", key: "updatedBy" },
        { title: "创建时间", key: "updatedAt" },
        { title: "操作", key: "action", width: 200, slot: "action" },
      ],
      datas: [],
      form: {
          name:"",
          type:"",
          isUse:"",
          updatedBy:"",
          link:"",
      },
      Id:"",
      ruleValidate: {},
      isShowAddForm: false,
      isMountInformation:false,
      loading: true,
      window_title: "新增封面图",
      types:[{name:"信息公告",id:1},{name:"活动公告",id:2},]
    };
  },
  mounted() {
    this.form.updatedBy = this.ParseServer.User.current().toJSON().realname;
    this.init_data = JSON.stringify(this.form);
    this.page_list(this.page);
  },
  methods: {
   //挂载信息
   MountInformation(data) {
      this.Id = data.id;
      this.get_entity();
      if(data.type == 1){
       console.log("信息公告")
        
      }else{
          console.log("活动公告")
               this.isMountInformation = true;
      }
 
    },

    //是否使用
    whetheru(data) {
      this.form.isUse = data.isUse;
      this.Id = data.id;
      this.updateds();
    },

    // 修改是否使用
    updateds() {
      var query = new this.ParseServer.Query("BulletinBoard");
      query.get(this.Id).then((item) => {
        item.set("isUse", this.form.isUse);
        item.save().then(
          () => {
            this.$Message.success("修改成功");
            this.isShowAddForm = false;
          },
          (error) => {
            this.$Message.error("修改失败");
          }
        );
      });
    },

    addBulletinBoard() {
      this.Id = "";
      this.form = {
        name:"",//名称
        type:"",//类型
        isUse: true, //是否使用
      };
      this.window_title = "新增公告";
      this.isShowAddForm = true;
    },

    /**
     * 弹出编辑窗口
     */
    EditFormShow(row) {
        console.log(row)
      this.Id = row.id;
      this.form.name = row.name;
      this.form.type = row.type;
      this.form.isUse = row.isUse;
      console.log(this.form)
      this.isShowAddForm = true;
      this.window_title = "编辑公告拦";
    },

    /*
     *新增公告栏
     */
    add_bulletinBoard() {
      this.form.updatedBy = this.ParseServer.User.current().toJSON().realname;
      var datas = this.ParseServer.Object.extend("BulletinBoard");
      var data = new datas();
      // 修改
      if (this.Id) {
        this.updated();
      } else {
        // 保存
        data.set("updatedBy", this.form.updatedBy);
        data.set("name", this.form.name);
        data.set("isUse", this.form.isUse);
        data.set("type", this.form.type);
        data.save().then(
          (data) => {
            this.$Message.success("保存成功");
            this.page_list();
          },
          (error) => {
            this.$Message.error("保存失败");
          }
        );
      }
    },


    updated() {
      var query = new this.ParseServer.Query("BulletinBoard");
      query.get(this.Id).then((item) => {
        item.set("name", this.form.name);
        item.set("type", this.form.type);
        item.set("isUse", this.form.isUse);
        item.save().then(
          (item) => {
            this.$Message.success("修改成功");
            this.page_list();
          },
          (error) => {
            this.$Message.error("修改失败");
          }
        );
      });
    },


    //活动公告
    add_MountInformation(){
        var query = new this.ParseServer.Query("BulletinBoard");
            query.get(this.Id).then((item) => {
                item.set("link", this.form.link);
                item.save().then(
                (items) => {
                    this.$Message.success("修改成功");
                    this.page_list();
                    this.isMountInformation = false;
                },
                (error) => {
                    console.log(error);
                    this.$Message.error("修改失败");
                }
                );
            });
    },
    search() {
      this.page = 1;
      this.page_list(this.page);
    },
    pagechange(e) {
      this.page = e;
      this.page_list();
    },

    page_list(page_index) {
      let _this = this;
      let query = new this.ParseServer.Query("BulletinBoard");
         query.contains("name", this.search_keyword);
      query.descending("createdAt");
      query.count().then((count) => {
        _this.total = count;
      });
      query.skip((this.page - 1) * this.pageSize);
      query.limit(this.pageSize);
      query.find().then(
        (list) => {
          _this.datas = [];
          if (list && list.length > 0) {
            list.forEach((item) => {
              _this.datas.push({
                id: item.id,
                name: item.get("name"),
                    type: item.get("type"),
                isUse: item.get("isUse"),
                updatedBy: item.get("updatedBy"),
                updatedAt: tool.dateFormat(
                  item.get("updatedAt"),
                  "yyyy-MM-dd HH:mm:ss"
                ),
              });
            });
          }
          this.isShowAddForm = false;
          this.loading = false;
        },
        (error) => {
        }
      );
    },

    delete(id) {
      var query_deletes = new this.ParseServer.Query("BulletinBoard");
      query_deletes.equalTo("objectId", id);
      query_deletes.limit(10000);
      query_deletes.find().then((response) => {
        if (response && response.length > 0) {
          response.forEach((data) => {
            data.destroy().then((result) => {
              this.$Message.success("删除成功");
              this.page_list();
            });
          });
        }
      });
    },

    DelConfirmShow(row) {
      var id = row.id;
      let _this = this;
      this.$Modal.confirm({
        title: "删除提示",
        content: "<p>当前公告拦会被删除，确定要删除吗？</p>",
        onOk: () => {
          var query = new this.ParseServer.Query("BulletinBoard");
          query.get(id).then((response) => {
            this.delete(id);
            // 删除当前组件
          });
        },
        onCancel: () => {
          this.$Message.info("取消了操作");
        },
      });
    },
       get_entity() {
      var query = new this.ParseServer.Query("BulletinBoard");
      query.get(this.Id).then((res) => {
        
        this.form.link = res.get("link");
      });
      console.log(this.form.link)
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
