<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix">
      <div class="search-wrap clear-fix">
        <div class="search-keyword" style="width:300px">
          <Input v-model="search_keyword" size="large" placeholder="请输入真题名称" style="width:300px" />
        </div>
        <div class="search-btn">
          <Button type="primary" @click="search" size="large">查询</Button>
        </div>
      </div>

      <div class="operation-wrap clear-fix">
        <Button class="func" type="primary" @click="handleAdd">添加真题试卷</Button>
      </div>
    </div>
    <Row class="table-wrap">
      <Table :loading="loading" :columns="columns" :data="data">
        <template slot-scope="{ row }" slot="action">
            <Button type="primary" size="small" style="margin-right:5px" @click="handleShow(row)">查看</Button>
            <Button type="warning" size="small" style="margin-right:5px" @click="handleEdit(row)">编辑</Button>
            <Button type="error" size="small" @click="handleRemove(row)">删除</Button>
        </template>
      </Table>
      <div class="page-wrap">
        <Page :total="total" @on-change="pagechange"  v-if="total!=0" />
      </div>
    </Row>
    <Modal v-model="isShowWindow" :loading="oldExamLoading" :title="window_title" @on-ok="handleSave" width="800">
      <Form  v-if="isShowWindow" :model="form" label-position="right" :label-width="100" ref="form" :rules="ruleValidate">
        <FormItem label="真题名称" prop="name">
          <Input v-model="form.name" placeholder="请输入真题名称"></Input>
        </FormItem>
        <FormItem label="内容" prop="amount">
          <Editor v-if="isShowWindow" v-model="form.content" placeholder="请输入真题内容" @on-change="change_value"></Editor>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="isShowDetail" title="查看真题" width="750">
        <div v-if="isShowDetail" v-html="form.content"></div>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Editor from "@/components/editor"
import { tool } from '@/api/tool'
import { verification } from "@/api/verification";
export default {
  name: "messageindex",
  components:{
    Editor
  },
  data () {
    return {
      page: 1,
      total: 0,
      search_keyword: '',
      oldExamLoading: true,
      loading: true,
      window_title: "添加真题",
      isShowWindow: false,
      isShowDetail: false,
      columns: [
        { title: "序号", type:'index', width: 60, align: 'center' },
        { title: "真题名称", key: "name" },
        { title: "更新时间",key: "updatedAt",
          render:(h, params)=>{
            var txt = tool.dateFormat(params.row.updatedAt, 'yyyy-MM-dd HH:mm:ss')
            return h('div', txt)
          }
        },
        { title: "更新人",key: "updatedBy" },
        { title: "操作", key: "action", align: "center", slot: 'action',width:200}
      ],
      data: [],
      form: {
        id:'',
        name: "",
        content: 0
      },
      ruleValidate: {
        name: [{required: true, message: "请输入真题名称", trigger: "blur"}],
        content: [{ required: true, message: '请输入真题内容', trigger: 'blur',validator:verification.validateFloat2 }],
      },
    };
  },
  mounted () {
    this.page_list(this.page);
  },
  methods: {
    /** 添加 */
    handleAdd(){
        this.window_title = "添加真题"
        this.form = {
          id:'',
          name: "",
          content: '',
        }
        this.isShowWindow = true
    },
    /** 编辑 */
    handleEdit(row){
        self.window_title='编辑真题'
        this.form = {
          id: row.id,
          name: row.name,
          content: row.content
        }
        this.isShowWindow = true
    },
    
    /*
    *富文本编辑框的内容发生变化
    *作者：gzt
    *时间：2020-11-22 00:37:46
    */
    change_value(html){
        this.form.content = html=='<p><br></p>'?'':html
        this.$refs['form'].validate()
    },
    /** 查看 */
    handleShow(row) {
        var self = this
        this.form = {
            id: row.id,
            name: row.name,
            content: row.content
        }
        this.isShowDetail = true
    },
    /*
     *保存
     *作者：gzt
     *时间：2020-11-22 14:50:34
     */
    handleSave () {
        var self = this
        this.$refs["form"].validate(valid => {
            if (!valid) {
                self.$Message.error('请检查表单项')
                self.oldExamLoading = false
                setTimeout(() => {
                    self.oldExamLoading = true
                }, 100)
                return false
            } else {
                var CouponInfos = self.ParseServer.Object.extend("OldExams");
                var coupon = new CouponInfos();
                if (self.form.id) {
                    coupon.set("id", self.form.id);
                }
                coupon.set("name", self.form.name);
                coupon.set("content", self.form.content);
                var realname = self.ParseServer.User.current().get('realname')
                coupon.set("updatedBy", realname);
                coupon.save().then(response => {
                    self.isShowWindow = false
                    self.$Message.success("保存成功");
                    self.page_list();
                },
                error => {
                    this.$Message.error("保存失败");
                });
            }
        });
    },

    pagechange(e){
      this.page = e
      this.page_list()
    },
    search(){
        this.page = 1
        this.page_list()
    },
    /*
     *分页加载数据
     *作者：gzt
     *时间：2020-11-21 23:30:27
     */
    page_list () {
      this.loading = true;

      let query = new this.ParseServer.Query("OldExams");
      if(this.search_keyword){
          query.contains('name', this.search_keyword)
      }
      query.descending("createdAt");
      query.count().then(count => {
        this.total = count;
      });
      query.skip((this.page - 1) * 10);
      query.limit(10);
      query.find().then(
        list => {
          this.data = [];
          if (list && list.length > 0) {
            this.data = list.map(item => {
              var message = {
                id: item.id,
                name: item.get("name"),
                content: item.get("content"),
                updatedBy: item.get('updatedBy'),
                updatedAt: item.get("updatedAt")
              };
              return message;
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
     * 删除
     *作者：gzt
     *时间：2020-11-22 08:41:53
     */
    handleRemove (row) {
      let _this = this;
      this.$Modal.confirm({
        title: "删除提示",
        content: "<p>删除后将无法恢复，确定要删除吗？</p>",
        onOk: () => {
          var query = new this.ParseServer.Query("OldExams");
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
    width: 35%;
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
      float: right;
    }
  }
  .search-btn {
    float: left;
    width: 18%;
    margin: 0 20px;
  }
}
.operation-wrap {
  float: right;
  width: 40%;
  .func {
    float: right;
    margin-left: 10px;
  }
}
</style>
