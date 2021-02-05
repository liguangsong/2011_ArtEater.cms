<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix" style="display:flex">
        <div class="search-wrap clear-fix" style="flex:1">
            <div class="search-keyword" style="width:360px">
                <span style="width:50px;padding:0 5px">名称 </span>
                <Input v-model="search_keyword" size="large" placeholder="请输入活动名称" style="width:300px" />
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
            <Button style="margin-right:10px" type="primary" @click="handleAddvideo">添加活动打包</Button>
        </div>
    </div>
    <Row class="table-wrap">
        <Table :loading="loading" :columns="columns" :data="data">
            <template slot-scope="{ row }" slot="price">
                    {{row.price?row.price:'---'}}
            </template>
            <template slot-scope="{ row }" slot="href">
                /pages/mine/order?subjectId={{row.id}}
            </template>
            <template slot-scope="{ row }" slot="action">
                <Button type="info" size="small" style="margin-right:5px" @click="handleShowDetail(row)">查看</Button>
                <Button type="warning" size="small" style="margin-right:5px" @click="handleShowEdit(row)">编辑</Button>
                <Button type="error" size="small" style="margin-right:5px" @click="handleDelete(row)">删除</Button>
                <Button type="warning" size="small" style="margin-right:5px" @click="CommentsFormShow(row)">介绍</Button>
            </template>
        </Table>
        <div class="page-wrap">
            <Page :total="total" :pageSize="pageSize" @on-change="pagechange"  v-if="total!=0" />
        </div>
    </Row>
    <Modal v-model="show_window" :loading="editLoading" :title="window_title" width="600" @on-ok="saveForm">
      <Form v-if="show_window" :model="form" label-position="right" :label-width="100" ref="form" :rules="ruleValidate">
        <FormItem label="活动名称" prop="title">
          <Input v-model="form.title" placeholder="请输入活动名称"  style="width:400px"></Input>
        </FormItem>
        <FormItem label="选择产品" prop="products">
          <Select v-model="form.products" multiple style="width:400px">
            <Option v-for="item in allProducts" :value="item.id" :key="item.id">{{ item.title }}</Option>
          </Select>
        </FormItem>
        <FormItem label="活动价格" prop="price">
            <Input v-model="form.price" placeholder="请输入活动价格"  style="width:400px"></Input>
        </FormItem>
        <FormItem label="积分抵现（元）" prop='maxScoreMoney'>
            <InputNumber v-model="form.maxScoreMoney" :min="0" :max="1000000" :precision="0" style="width:200px" placeholder="请输入积分最多可抵现金额"></InputNumber>
            <label style="margin-left:5px;color:#808695">积分最多可抵现金额</label>
        </FormItem>
        <FormItem label="积分限制" prop='minScore'>
            <InputNumber v-model="form.minScore" :min="0" :max="1000000" :precision="0" style="width:200px" placeholder="请输入使用积分的最低限制"></InputNumber>
            <label style="margin-left:5px;color:#808695">使用积分的最低限制</label>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="isShowDetail" title="查看活动详情" mask scrollable width="600">
      <Form :model="form" label-position="right" :label-width="100" ref="form">
        <FormItem label="活动名称" prop="title">
          {{form.title}}
        </FormItem>
        <FormItem label="选择产品" prop="products">
          <div>
            <div v-for="item in allProducts">
              <span v-if="form.products.indexOf(item.id)!=-1">
              {{ item.title }}
              </span>
              </div>
          </div>
        </FormItem>
        <FormItem label="活动价格" prop="price">
            {{form.price}}
        </FormItem>
        <FormItem label="积分抵现（元）" prop='maxScoreMoney'>
          {{form.maxScoreMoney}}
        </FormItem>
        <FormItem label="积分限制" prop='minScore'>
          {{form.minScore}}
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="isShowCommentsForm" title="编辑介绍" width="800" @on-ok="saveComments()">
      <Editor :value="form.comments" @on-change="change_value"></Editor>
    </Modal>
  </div>
</template>

<script>
import { tool } from '@/api/tool'
import { verification } from "@/api/verification";
import Editor from "@/components/editor"
export default {
    name: "messageindex",
    components:{
        Editor
    },
  data () {
    return {
        page: 1,
        pageSize: 10,
        total: 0,
        isShowCommentsForm: false,
        loading: true,
        editLoading: true,
        isShowImg: false,
        isShowDetail: false,
        currImg: '',
        message_id: "",
        window_title: "添加活动打包",
        show_window: false,
        allProducts: [],
        search_keyword: "",
        search_state: -1,
        columns: [
            { title: "序号", type:'index', align: 'center' },
            { title: "活动名称", key: "title" },
            { title: "活动价格（元）", key: 'price', slot: 'price', align: 'center'},
            { title: "积分抵现（元）", key: 'maxScoreMoney' },
            { title: "积分限制", key: 'minScore' },
            { title: "链接", key: "href", slot:'href', width: 300 },
            { title: "操作", key: "action", slot:'action', align: "center" , width: 300}
        ],
        data: [],
        form: {
            id:'',
            title: '',
            products: [],
            price: 0,
            maxScoreMoney: 0,
            minScore: 0,
            comments: ''
        },
        ruleValidate: {
            title:  [{ required: true, message: '请输入活动名称', trigger: 'blur' },{ required: true, message: '请输入活动名称', trigger: 'change' }],
            products: [{required: true, message: "请选择产品", trigger: "blur", validator: verification.validateIsNull}], // validateArrayIsNull
            price: [{ required: true, trigger: 'blur', 
                    validator: (rule, value, callback) => {
                      if (value === '' ) {
                          callback(new Error('请输入价格'))
                      } else if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
                          return callback(new Error('价格由整数、小数点和最多两个小数组成！'))
                      } else {
                          callback()
                      }
                    }
                }
            ]
            // videoSrc: [{required: true, message: "请输入链接", trigger: "blur", validator: verification.validateIsNull}],
            // sort: [{required: true, message: "请输入排序", trigger: "blur", validator: verification.validateIsNull}],
        },
        init_data: ""
    };
  },
  mounted () {
    var self = this
    this.bindProducts()
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
        this.form.id = row.id;
        this.get_entity();
        this.show_window = true;
        this.window_title = "编辑活动打包";
    },
      /** 添加 */
    handleAddvideo() {
        this.form = {
            id:'',
            title: '',
            products: [],
            price: 0,
            maxScoreMoney: 0,
            minScore: 0
        },
        this.window_title = "添加活动打包";
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
    bindProducts(){
      var self = this
      var query = new this.ParseServer.Query("Subjects")
      query.equalTo('parent_ID', '0')
      query.find().then(async res=>{
        res.forEach(item=>{
          self.allProducts.push({
            id: item.id,
            title:'【科目】' + item.get('subject_name')
          })
        })
      })
      var query1 = new this.ParseServer.Query("Courses")
      query1.equalTo('parent_ID', '0')
      query1.find().then(async res=>{
        res.forEach(item=>{
          self.allProducts.push({
            id: item.id,
            title:'【套课】' +  item.get('courseName')
          })
        })
      })
      var query1 = new this.ParseServer.Query("ActionConfig")
      query1.find().then(async res=>{
        res.forEach(item=>{
          self.allProducts.push({
            id: item.id,
            title:'【价格配置】' +  item.get('action')
          })
        })
      })
    },
    
    /**
     * 图片上传完成
     */
    handleUploadComplate(urls){
        this.form.videoSrc = urls
    },

    /*
     *发布消息
     *作者：gzt
     *时间：2020-11-22 14:50:34
     */
    saveForm () {
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
                var Activitys = self.ParseServer.Object.extend("Activity");
                var activity = new Activitys();
                if (self.form.id) {
                    activity.set("id", self.form.id);
                }
                let realName = self.ParseServer.User.current().get('realname')
                activity.set("title", self.form.title);
                activity.set("products", self.form.products);
                activity.set("price", parseFloat(self.form.price));
                activity.set('maxScoreMoney', self.form.maxScoreMoney)
                activity.set('minScore', self.form.minScore)
                activity.set("updatedBy", realName);
                activity.save().then(response => {
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
    saveComments(){
        var self = this
        var subjects = this.ParseServer.Object.extend("Activity")
        var subject = new subjects()
        subject.set('id', this.form.id)
        subject.set("comments", this.form.comments)
        subject.save().then((res)=>{
            self.page_list(self.page)
            self.$Message.success('保存成功')
        },(error)=>{
            console.log(error)
            self.$Message.error('保存失败')
        })
    },
    /**
     * 弹出编辑介绍窗体
     */
    CommentsFormShow(row){
        this.form = row
        this.isShowCommentsForm=true
    },
    change_value(html,text){
        this.form.comments = html
    },
    /*
     *获取消息
     *作者：gzt
     *时间：2020-11-22 09:21:48
     */
    get_entity () {
      var query = new this.ParseServer.Query("Activity");
      query.get(this.form.id).then(res => {
        this.form.id = res.id
        this.form.title = res.get('title')
        this.form.products = res.get('products')
        this.form.price = res.get('price')
        this.form.maxScoreMoney = res.get('maxScoreMoney')
        this.form.minScore = res.get('minScore')
      })
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
        let query1 = new this.ParseServer.Query("Activity");
        query1.contains('title', this.search_keyword)
        // let query2 = new this.ParseServer.Query("Video");
        // if(this.search_state==-1){
        //     query2.notEqualTo('state', -1)
        // } else {
        //     query2.equalTo('state', this.search_state)
        // }
        var query = this.ParseServer.Query.and(query1);
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
                        products: item.get("products"),
                        price: item.get("price"),
                        maxScoreMoney: item.get("maxScoreMoney"),
                        minScore: item.get("minScore"),
                        comments: item.get("comments"),
                        createdAt: item.get("createdAt"),
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
          var query = new this.ParseServer.Query("Activity");
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
