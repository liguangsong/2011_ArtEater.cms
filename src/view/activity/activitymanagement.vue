<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix" style="display:flex" v-if="isAddActivity == false"> 
      <div class="search-wrap clear-fix" style="flex:1">
        <div class="search-keyword" style="width:230px">
          <Input
            v-model="search_keyword"
            size="large"
            placeholder="活动标题关键字搜索"
            style="width:200px"
          />
        </div>
        <div class="select-choice clear-fix" style="width: 500px;    display: flex;">
          <span>注册时间</span>
          <div class="date-picker-wrap clear-fix" style="width: 400px;display: flex;">
            <div class="date-picker" style="width: 180px">
              <DatePicker
                v-model="search_start_date"
                size="large"
                type="date"
                placeholder="请输入开始时间"
              ></DatePicker>
            </div>
            <div class="label-split" style="height: 36px; line-height: 36px">
              -
            </div>
            <div class="date-picker" style="width: 180px">
              <DatePicker
                v-model="search_end_date"
                size="large"
                type="date"
                placeholder="请输入结束时间"
              ></DatePicker>
            </div>
          </div>
        </div>
      </div>
       <div class="search-btn" style="width:150px;margin:0">
          <Button type="primary" class="search-btn" @click="search">搜索</Button>
        </div>
      
    </div>
    <Row class="table-wrap" v-if="isAddActivity == false">
        <div style="width:100px; margin-left: auto;
    margin-bottom: 20px;">
        <Button type="primary" @click="addActivity">新增活动</Button>
      </div>
      <Table :loading="loading" :columns="columns" :data="datas">
   <template slot-scope="{ row }" slot="link">
              <span>{{row.link}}</span>
            <span v-if="row.link" style="color:#0758a2;margin-left:45px;cursor: pointer;" v-clipboard:copy="row.link" v-clipboard:success="onCopy" v-clipboard:error="onError">  复制</span>
       </template>
        <template slot-scope="{ row }" slot="action">
          <Button
            type="warning"
            style="margin-right:5px"
            @click="EditFormShow(row)"
            >编辑</Button
          >
          <Button
            type="error"
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
<!-- 新增活动 -->
<div v-if="isAddActivity" style="margin-top:50px;margin-left:40px">
  <Form
        v-if="isAddActivity"
        ref="form"
        :model="form"
        label-position="left"
        :label-width="100"
        :rules="ruleValidate"
      >
          <FormItem label="活动名称" prop="title">
          <Input
           style="width: 200px"
            v-model="form.title"
            placeholder="请输入活动名称"
          ></Input>
        </FormItem>
          <FormItem label="黑金活动价格" prop="blackActivePrice">
          <Input
           style="width: 200px"
            v-model="form.blackActivePrice"
            placeholder="请输入黑金活动价格"
          ></Input>
        </FormItem>
          <FormItem label="铂金活动价格" prop="platinumActivePrice">
          <Input
           style="width: 200px"
            v-model="form.platinumActivePrice"
            placeholder="请输入铂金活动价格"
          ></Input>
        </FormItem>
          <FormItem label="白银活动价格" prop="silverActivePrice">
          <Input
           style="width: 200px"
            v-model="form.silverActivePrice"
            placeholder="请输入白银活动价格"
          ></Input>
        </FormItem>

           <FormItem label="活动底图" prop="baseMap">
             <Editor
            :value="form.baseMap"
            placeholder="请增加活动底图"
            @on-change="change_value"
          ></Editor>
        </FormItem>
      </Form>
 <div class="bottom">
              <a-button
            type="into"
            style="margin-right:5px;cursor: pointer;"
            @click="goback"
            >返回</a-button
          >
         
            <a-button type="primary"  style="margin-right:5px;cursor: pointer;"
            @click="add_active">
      保存
    </a-button>
      </div>
</div>
</div>
</template>

<script>
import Editor from "@/components/editor";
import { tool } from "@/api/tool";
import myUploadMuti from "@/components/myUploadMuti";
export default {
  name: "coursesmanageindex",
  components: {
    Editor,
    myUploadMuti,
  },
  data() {
    return {
      isAddActivity: false,
      page: 1,
      pageSize: 10,
      total: 0,
      search_keyword: "",
      search_start_date:'',
      search_end_date:"",
      columns: [
        { title: "ID", key: "id" },
        { title: "活动标题", key: "title" },
        { title: "黑金活动价格", key: "blackActivePrice" },
        { title: "铂金活动价格", key: "platinumActivePrice" },
        { title: "白银活动价格", key: "silverActivePrice" },
        { title: "链接", key: "link", slot: "link" , width: 200,},
        { title: "注册时间", key: "updatedAt" },
        { title: "操作", key: "action", width: 200, slot: "action" },
      ],
      datas: [],
      form: {
        title: "",
        blackActivePrice: 0,
        platinumActivePrice: 0,
        silverActivePrice: 0,
        link: "",
        baseMap: "",
      },
      Id: "",
      ruleValidate: {
        title: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        blackActivePrice: [
             {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (
                !/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(
                  value
                )
              ) {
                return callback(
                  new Error("请输入黑金活动价格,价格由整数、小数点和最多两个小数组成！")
                );
              }
              callback();
            },
          },
        ],
           platinumActivePrice:[
           {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (
                !/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(
                  value
                )
              ) {
                return callback(
                  new Error("请输入铂金活动价格,价格由整数、小数点和最多两个小数组成！")
                );
              }
              callback();
            },
          },
        ],
         silverActivePrice:[
           {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (
                !/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(
                  value
                )
              ) {
                return callback(
                  new Error("请输入白银活动价格,价格由整数、小数点和最多两个小数组成！")
                );
              }
              callback();
            },
          },
        ],
        
      },
      isShowAddForm: false,
      loading: true,
    };
  },
  mounted() {
    this.init_data = JSON.stringify(this.form);
    this.page_list(this.page);
  },
  methods: {
   // 富文本说明
      change_value(html) {
        this.form.baseMap = html == "<p><br></p>" ? "" : html;
      },

    // 复制成功时的回调函数
    onCopy (e) {
      console.log(e)
      console.log('内容已复制到剪切板！')
      this.$message.info('复制成功!');
    },
    // 复制失败时的回调函数
    onError (e) {
      console.log('抱歉，复制失败！')
    },


    addActivity() {
      this.isAddActivity = true;
      this.Id = "";
      this.form = {
        title: "",
        blackActivePrice: 0,
        platinumActivePrice: 0,
        silverActivePrice: 0,
        link: "",
        baseMap: "",
      };
      this.window_title = "新增活动";
      this.isShowAddForm = true;
    },

    /**
     * 弹出编辑窗口
     */
    EditFormShow(row) {
      this.isAddActivity = true;
      console.log(row);
      this.Id = row.id;
      this.form.title = row.title;
      this.form.blackActivePrice = row.blackActivePrice;
      this.form.platinumActivePrice = row.platinumActivePrice;
      this.form.silverActivePrice = row.silverActivePrice;
      this.form.link = row.link;
      this.form.baseMap = row.baseMap;
      console.log(this.form);
    },

    /*
     *新增活动
     */
    add_active() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          this.$Message.error("请检查表单项");
          setTimeout(() => {
          }, 100);
          return false;
        } else {
         var datas = this.ParseServer.Object.extend("ActiveManagement");
      var data = new datas();
      // 修改
      if (this.Id) {
        this.updated();
      } else {
        // 保存
        data.set("title", this.form.title);
        data.set("blackActivePrice", Number(this.form.blackActivePrice));
        data.set("platinumActivePrice", Number(this.form.platinumActivePrice));
        data.set("silverActivePrice", Number(this.form.silverActivePrice));
        data.set("link", this.form.link);
        data.set("baseMap", this.form.baseMap);
        data.save().then(
          (data) => {
            this.$Message.success("保存成功");
            this.isAddActivity = false;
            this.page_list();
          },
          (error) => {
            this.$Message.error("保存失败");
          }
        );
      }
        }
      });
    },

    updated() {
      var query = new this.ParseServer.Query("ActiveManagement");
      query.get(this.Id).then((item) => {
        item.set("title", this.form.title);
        item.set("blackActivePrice", Number(this.form.blackActivePrice));
        item.set("platinumActivePrice", Number(this.form.platinumActivePrice));
        item.set("silverActivePrice", Number(this.form.silverActivePrice));
        item.set("link", this.form.link);
        item.set("baseMap", this.form.baseMap); this.isAddActivity = false;
        item.save().then(
          (item) => {
            this.$Message.success("修改成功");
             this.isAddActivity = false;
            this.page_list();
          },
          (error) => {
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
      let query1 = new this.ParseServer.Query("ActiveManagement");
      query1.contains("title", this.search_keyword);
      let query2 = new this.ParseServer.Query("ActiveManagement");
      if (this.search_start_date) {
        query2.greaterThan("createdAt", this.search_start_date);
      }
      let query3 = new this.ParseServer.Query("ActiveManagement");
      if (this.search_end_date) {
        query3.lessThan("createdAt", tool.addDays(this.search_end_date, 1));
      }
      var query = this.ParseServer.Query.and(
        this.ParseServer.Query.or(query1),
        query2,
        query3
      );
      // let query = new this.ParseServer.Query("ActiveManagement");
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
                title: item.get("title"),
                blackActivePrice: item.get("blackActivePrice"),
                platinumActivePrice: item.get("platinumActivePrice"),
                silverActivePrice: item.get("silverActivePrice"),
                link: item.get("link"),
                baseMap: item.get("baseMap"),
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
        (error) => {}
      );
    },

    delete(id) {
      var query_deletes = new this.ParseServer.Query("ActiveManagement");
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
        content: "<p>当前活动会被删除，确定要删除吗？</p>",
        onOk: () => {
          var query = new this.ParseServer.Query("ActiveManagement");
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

    //返回
    goback() {
      this.isAddActivity = false;
    },
    get_entity() {
      var query = new this.ParseServer.Query("ActiveManagement");
      query.get(this.Id).then((res) => {
        this.form.title = res.get("title");
        this.form.blackActivePrice = res.get("blackActivePrice");
        this.form.platinumActivePrice = res.get("platinumActivePrice");
        this.form.silverActivePrice = res.get("silverActivePrice");
        this.form.link = res.get("link");
        this.form.baseMap = res.get("baseMap");
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
.bottom {
  width: 150px;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
}
.ql-editor{
  height: 600px !important;
}
</style>
