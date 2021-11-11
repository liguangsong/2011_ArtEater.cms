<template>
  <div class="container-wrap">
    <!-- <div style="display:flex">
            <div style="flex:1">
                <Input v-model="keyword" size="large" placeholder="ID主题关键字搜索" style="width: 200px;margin-left:10px" />
                <Button type="primary" class="search-btn" @click="search">搜索</Button></Col>
            </div>
        </div> -->
    <Row class="table-wrap">
      <Table :loading="loading" :columns="columns" :data="data">
        <template slot-scope="{ row }" slot="isNeedPay">
          {{ row.isNeedPay == 1 ? "是" : "否" }}
        </template>
        <template slot-scope="{ row }" slot="price">
          {{ row.price ? row.price : "---" }}
        </template>
        <template slot-scope="{ row }" slot="updatedAt">
          {{ toDateFormat(row.updatedAt) }}
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button
            type="warning"
            size="small"
            style="margin-right: 5px"
            @click="EditFormShow(row)"
            >编辑</Button
          >
          <Button
            type="warning"
            size="small"
            style="margin-right: 5px"
            @click="CommentsFormShow(row)"
            >介绍</Button
          >
        </template>
      </Table>
      <!-- <div class="page-wrap">
                <Page :total="total" @on-change="page_list"  v-if="total!=0" />
            </div> -->
    </Row>
    <Modal
      v-model="isShowAddForm"
      :title="window_title"
      width="500"
      mask
      scrollable
      :loading="modalLoading"
      @on-ok="update"
    >
      <Form
        v-if="isShowAddForm"
        ref="form"
        :model="form"
        label-position="right"
        :label-width="100"
        :rules="ruleValidate"
      >
        <!-- <FormItem label="页面">
                    <label>{{form.page}}</label>
                </FormItem> -->
        <FormItem label="功能名称">
          <Input v-model="form.action" placeholder="请输入功能名称"></Input>
        </FormItem>
        <FormItem label="是否收费">
          <Select v-model="form.isNeedPay">
            <Option :value="1" :key="1">是</Option>
            <Option :value="0" :key="0">否</Option>
          </Select>
        </FormItem>
        <FormItem label="收费金额" prop="price">
          <Input v-model="form.price" placeholder="请输入收费金额"></Input>
        </FormItem>
        <FormItem label="积分抵现（元）" prop="maxScoreMoney">
          <InputNumber
            v-model="form.maxScoreMoney"
            :min="0"
            :max="1000000"
            :precision="0"
            style="width: 200px"
            placeholder="请输入积分最多可抵现金额"
          ></InputNumber>
          <label style="margin-left: 5px; color: #808695"
            >积分最多可抵现金额</label
          >
        </FormItem>
        <FormItem label="积分限制" prop="minScore">
          <InputNumber
            v-model="form.minScore"
            :min="0"
            :max="1000000"
            :precision="0"
            style="width: 200px"
            placeholder="请输入使用积分的最低限制"
          ></InputNumber>
          <label style="margin-left: 5px; color: #808695"
            >使用积分的最低限制</label
          >
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="isShowCommentsForm"
      title="编辑介绍"
      width="800"
      @on-ok="saveComments()"
    >
      <Editor :value="form.comments" @on-change="change_value"></Editor>
    </Modal>
  </div>
</template> 

<script>
import Editor from "@/components/editor";
import { tool } from "@/api/tool";
import { verification } from "@/api/verification";
export default {
  name: "subjectsmanageindex",
  components: {
    Editor,
  },
  data() {
    var self = this;
    return {
      isShowCommentsForm: false,
      columns: [
        // { title: '页面',key: 'page'},
        { title: "功能模块", key: "action" },
        { title: "是否收费", key: "isNeedPay", slot: "isNeedPay" },
        {
          title: "收费金额（元）",
          key: "price",
          slot: "price",
          align: "center",
        },
        { title: "积分抵现（元）", key: "maxScoreMoney" },
        { title: "积分限制", key: "minScore" },
        { title: "最后更新时间", key: "updatedAt", slot: "updatedAt" },
        { title: "最后更新人", key: "updatedBy" },
        { title: "操作", key: "action", slot: "action" },
      ],
      form: {
        id: "",
        page: "",
        action: "",
        isNeedPay: 0,
        price: 0,
        maxScoreMoney: 0,
        minScore: 0,
        comments: "",
      },
      ruleValidate: {
        price: [
          {
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (self.form.isNeedPay == 1) {
                if (value === "") {
                  callback(new Error("请输入价格"));
                } else if (
                  !/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(
                    value
                  )
                ) {
                  return callback(
                    new Error("价格由整数、小数点和最多两个小数组成！")
                  );
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
          },
        ],
      },
      keyword: "",
      data: [],
      isShowAddForm: false,
      loading: true,
      modalLoading: true,
      window_title: "编辑功能信息",
    };
  },
  computed: {},
  mounted() {
    // var self = this
    // var query = new self.ParseServer.Query('_User')
    // query.equalTo('role', 'student')
    // query.limit(10000)
    // query.find().then(res=>{
    //     debugger
    //     res.forEach(item=>{
    //         if(item.get('amount')>=900){
    //             debugger
    //             var queryOrder = new self.ParseServer.Query('Order')
    //             queryOrder.equalTo('openId',item.get('openid'))
    //             queryOrder.equalTo('state', 1)
    //             queryOrder.equalTo('subjectId', 'iVwkLLV6IN')
    //             queryOrder.first().then(ores=>{
    //                 if(ores){ //
    //                     debugger
    //                 } else{
    //                     var dbOrder = self.ParseServer.Object.extend("Order")
    //                     var order = new dbOrder()
    //                     order.set('orderNo', '赠送答案解析')
    //                     order.set("subjectId",  'iVwkLLV6IN')
    //                     order.set("subjectName",  '试题解析')
    //                     order.set("price",  0)
    //                     order.set("openId", item.get('openid'))
    //                     order.set("state", 1)
    //                     order.set("wechatPayOrderId", '') // 支付流水号
    //                     order.save().then(_order => {

    //                     })
    //                 }
    //             },error=>{
    //             })
    //         }
    //     })
    // })
    this.page_list();
  },
  methods: {
    toDateFormat(date) {
      return tool.dateFormat(date, "yyyy-MM-dd HH:mm:ss");
    },
    /**
     * 弹出编辑窗口
     */
    EditFormShow(row) {
      this.isShowAddForm = true;
      this.form = row;
      this.form.maxScoreMoney = row.maxScoreMoney ? row.maxScoreMoney : 0;
      this.form.minScore = row.minScore ? row.minScore : 0;
    },
    update() {
      var self = this;
      var dbConfig = this.ParseServer.Object.extend("ActionConfig");
      var config = new dbConfig();
      config.set("id", this.form.id);
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          self.$Message.error("请检查表单项");
          self.modalLoading = false;
          setTimeout(() => {
            self.modalLoading = true;
          }, 100);
          return false;
        } else {
          config.set("isNeedPay", self.form.isNeedPay);
          config.set("action", self.form.action);
          config.set(
            "updatedBy",
            self.ParseServer.User.current().get("realname")
          );
          config.set(
            "price",
            self.form.isNeedPay == 1 ? parseFloat(self.form.price) : 0
          );
          config.set("maxScoreMoney", self.form.maxScoreMoney);
          config.set("minScore", self.form.minScore);
          config.save().then(
            (con) => {
              this.isShowAddForm = false;
              self.$Message.success("保存成功");
              self.page_list();
            },
            (error) => {
              self.$Message.error("保存失败");
            }
          );
        }
      });
    },

    saveComments() {
      var self = this;
      var subjects = this.ParseServer.Object.extend("ActionConfig");
      var subject = new subjects();
      subject.set("id", this.form.id);
      subject.set("comments", this.form.comments);
      subject.save().then(
        (res) => {
          self.page_list(self.page);
          self.$Message.success("保存成功");
        },
        (error) => {
          self.$Message.error("保存失败");
        }
      );
    },
    /**
     * 弹出编辑介绍窗体
     */
    CommentsFormShow(row) {
      this.form = row;
      this.isShowCommentsForm = true;
    },
    change_value(html, text) {
      this.form.comments = html;
    },
    /*
     *搜索数据
     *作者：gzt
     *时间：2020-11-21 23:30:19
     */
    search() {
      this.page = 1;
      this.page_list(this.page);
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
      let _this = this;
      let query = new this.ParseServer.Query("ActionConfig");
      query.count().then((count) => {
        if (count > 0) {
          query.find().then((list) => {
            _this.data = [];
            if (list && list.length > 0) {
              list.forEach((item) => {
                _this.data.push({
                  id: item.id,
                  page: item.get("page"),
                  code: item.get("code"),
                  action: item.get("action"),
                  isNeedPay: item.get("isNeedPay"),
                  price: item.get("price"),
                  updatedAt: item.get("updatedAt"),
                  updatedBy: item.get("updatedBy"),
                  maxScoreMoney: item.get("maxScoreMoney"),
                  minScore: item.get("minScore"),
                  comments: item.get("comments"),
                });
              });
            }
            this.loading = false;
          });
        } else {
          var dbConfig = this.ParseServer.Object.extend("ActionConfig");
          var data = [
            {
              page: "首页",
              code: "zhongdiantiku",
              action: "重点题库",
              isNeedPay: 0,
              price: 0,
              updatedBy: "管理员",
            },
            {
              page: "首页",
              code: "monishiti",
              action: "模拟试题",
              isNeedPay: 1,
              price: 50.1,
              updatedBy: "管理员",
            },
            {
              page: "答题",
              code: "daanjiexi",
              action: "试题解析",
              isNeedPay: 1,
              price: 50.1,
              updatedBy: "管理员",
            },
          ];
          for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var config = new dbConfig();
            _this.loading = true;
            config.set("page", item.page);
            config.set("code", item.code);
            config.set("action", item.action);
            config.set("isNeedPay", item.isNeedPay);
            config.set("updatedBy", item.updatedBy);
            config.set("price", item.price);
            config.save().then(
              (res) => {
                _this.data.push({
                  id: res.id,
                  page: res.get("page"),
                  code: res.get("code"),
                  action: res.get("action"),
                  isNeedPay: res.get("isNeedPay"),
                  price: res.get("price"),
                  updatedAt: res.get("updatedAt"),
                  updatedBy: res.get("updatedBy"),
                });
                _this.loading = false;
              },
              (error) => {}
            );
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
