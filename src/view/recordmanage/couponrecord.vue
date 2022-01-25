<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix" style="display: flex">
      <div class="search-wrap">
        <div class="search-keyword" style="width: 200px">
          <Input
            v-model="search_keyword"
            size="large"
            placeholder="优惠券名称、操作人关键字搜索"
            style="width: 200px"
          />
        </div>
      </div>
      <div class="select-choice clear-fix" style="width:300px">
        <span style="width:100px; padding: 0 10px;box-sizing:border-box;">会员类型</span>
        <Select
          size="large"
          v-model="search_type"
          class="choice"
          :clearable="true"
          placeholder="全部类型"
          style="width:200px"
        >
          <Option v-for="item in roles" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="select-choice clear-fix" style="width: 500px; display: flex;align-items: center;">
        <span style="padding: 0 10px;box-sizing:border-box;">发送时间</span>
        <div class="date-picker-wrap clear-fix" style="width: 400px; display: flex">
          <div class="date-picker" style="width: 180px">
            <DatePicker v-model="search_start_date" size="large" type="date" placeholder="请输入开始时间"></DatePicker>
          </div>
          <div class="label-split" style="height: 36px; line-height: 36px;margin:0 10px;">-</div>
          <div class="date-picker" style="width: 180px">
            <DatePicker v-model="search_end_date" size="large" type="date" placeholder="请输入结束时间"></DatePicker>
          </div>
        </div>
      </div>
      <div class="search-btn" style="width: 150px; margin: 0">
        <Button type="primary" @click="search" size="large">查询</Button>
      </div>
      <Button type="info" @click="exports">全部导出</Button>
    </div>
    <Row class="table-wrap">
      <Table :loading="loading" :columns="columns" :data="couponData">
        <template slot-scope="{ row }" slot="couponRange">
          <span v-if="row.couponRange == 'all'">全部通用</span>
          <span v-if="row.couponRange == 'blackGold'">黑金</span>
          <span v-if="row.couponRange == 'platinum'">铂金</span>
          <span v-if="row.couponRange == 'silver'">白银</span>
          <span v-if="row.couponRange == 'blackGoldNew'">黑金拉新</span>
          <span v-if="row.couponRange == 'platinumGoldNew'">铂金拉新</span>
          <span v-if="row.couponRange == 'silverGoldNew'">白银拉新</span>
          <span v-if="row.couponRange == 'newUser'">注册新用户</span>
          <!-- <span v-if="row.couponRange =='pullNewUser'">拉新用户</span> -->
          <span v-if="row.couponRange == 'blackGoldPullNewUser'">黑金拉新用户</span>
          <span v-if="row.couponRange == 'silverPullNewUser'">白银拉新用户</span>
          <span v-if="row.couponRange == 'platinumPullNewUser'">铂金拉新用户</span>
        </template>
        <template slot-scope="{ row }" slot="state">
          <span v-if="row.state == 0">未使用</span>
          <span v-if="row.state == 1">已过期</span>
          <span v-if="row.state == 2">已使用</span>
        </template>
      </Table>
      <div class="page-wrap">
        <Page :total="total" @on-change="pagechange" v-if="total != 0" />
      </div>
    </Row>
  </div>
</template>

<script>
import { tool } from "@/api/tool";
import { verification } from "@/api/verification";
import excelUtil from "../../utils/dealwithExcelUtil";
export default {
  name: "couponrecord",
  data() {
    return {
      page: 1,
      total: 0,
      search_keyword: "",
      search_start_date: "",
      search_end_date: "",
      sendMode: "all",
      search_student_keyword: "",
      studentPageIndex: 1,
      loading: true,
      studentLoading: false,
      search_type: "",
      columns: [
        { title: "序号", type: "index", key: "id", width: 60, align: "center" },
        { title: "优惠券名称", key: "couponName" },
        { title: "优惠券类型", key: "couponRange", slot: "couponRange" },
        { title: "优惠券金额", key: "amount" },
        {
          title: "发送时间",
          key: "createdAt",
          render: (h, params) => {
            var txt = tool.dateFormat(
              params.row.createdAt,
              "yyyy-MM-dd HH:mm:ss"
            );
            return h("div", txt);
          }
        },
        {
          title: "操作人",
          key: "sendBy",
          render: (h, params) => {
            var txt = params.row.sendBy;
            var color = "#ff0000";
            return h("div", { style: { color: color } }, txt);
          }
        },
        { title: "使用情况", key: "state", slot: "state" },
        {
          title: "使用时间",
          key: "updatedAt",
          render: (h, params) => {
            if (params.row.updatedAt && params.row.state == 2) {
              var txt = tool.dateFormat(
                params.row.updatedAt,
                "yyyy-MM-dd HH:mm:ss"
              );
              return h("div", txt);
            } else {
              return h("div", "--");
            }
          }
        }
      ],
      roles: [
        { value: "all", label: "全部通用" },
        { value: "blackGold", label: "黑金" },
        { value: "platinum", label: "铂金" },
        { value: "silver", label: "白银" },
        { value: "blackGoldNew", label: "黑金拉新" },
        { value: "platinumGoldNew", label: "铂金拉新" },
        { value: "silverGoldNew", label: "白银拉新" },
        { value: "newUser", label: "注册新用户" },
        { value: "blackGoldPullNewUser", label: "黑金拉新用户" },
        { value: "silverPullNewUser", label: "白银拉新用户" },
        { value: "platinumPullNewUser", label: "铂金拉新用户" }
      ],
      studentColmns: [
        { title: "序号", type: "index", width: 60, align: "center" },
        { title: "昵称", key: "nickName" },
        { title: "学生姓名", key: "realname" },
        { title: "手机号", key: "phone" },
        { type: "selection", width: 60, align: "center", title: "全选" }
      ],
      couponData: [],
      couponData2: [],
      students: [],
      couponRanges: [
        { type: "manuallySend", title: "手动发送" },
        { type: "automaticallySend", title: "自动发送" }
      ],
      states: [
        { type: "all", title: "全部通用" },
        { type: "blackGold", title: "黑金" },
        { type: "silver", title: "白银" },
        { type: "platinum", title: "铂金" }
      ],
      states2: [
        { type: "blackGoldNew", title: "黑金拉新" },
        { type: "platinumGoldNew", title: "铂金拉新" },
        { type: "silverGoldNew", title: "白银拉新" },
        { type: "newUser", title: "注册新用户" },
        // { type: "pullNewUser", title: "拉新用户" },
        { type: "blackGoldPullNewUser", title: "黑金拉新用户" },
        { type: "platinumPullNewUser", title: "铂金拉新用户" },
        { type: "silverPullNewUser", title: "白银拉新用户" }
      ],
      coupon_form: {
        id: "",
        couponName: "",
        couponRange: "manuallySend",
        state: "all",
        amount: 0,
        termValidity: 0,
        updatedAt: ""
      },
      ruleValidate: {
        couponName: [
          { required: true, message: "请输入优惠券名称", trigger: "blur" }
        ],
        amount: [
          {
            required: true,
            message: "请输入正确的优惠金额",
            trigger: "blur",
            validator: verification.validateFloat2
          }
        ],
        couponRanges: [
          {
            trigger: "change",
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("优惠券类型不能为空"));
              }
              callback();
            }
          }
        ],
        state: [
          {
            trigger: "change",
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("优惠券使用情况不能为空"));
              }
              callback();
            }
          }
        ],
        updatedAt: [
          {
            trigger: "change",
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入使用时间"));
              } else {
                if (value < new Date()) {
                  callback(new Error("截止时间必须是未来的某个时间"));
                } else {
                  callback();
                }
              }
            }
          }
        ],
        termValidity: [
          {
            required: true,
            message: "请输入正确的有效期",
            trigger: "blur",
            validator: verification.validateFloat2
          }
        ]
      },
      init_data: ""
    };
  },
  mounted() {
    var self = this;
    this.init_data = JSON.stringify(this.message_form);
    this.page_list(this.page);
    this.student_page_list();
    this.page_list2();
  },
  methods: {
    search() {
      this.page = 1;
      this.page_list(this.page);
      this.page_list2();
    },
    pagechange(e) {
      this.page = e;
      this.page_list();
    },
    page_list() {
      this.loading = true;
      let query1 = new this.ParseServer.Query("NewCouponRecord");
      query1.contains("couponName", this.search_keyword);
      let query5 = new this.ParseServer.Query("NewCouponRecord");
      query5.contains("sendBy", this.search_keyword);
      let query2 = new this.ParseServer.Query("NewCouponRecord");
      if (this.search_start_date) {
        query2.greaterThan("createdAt", this.search_start_date);
      }
      let query3 = new this.ParseServer.Query("NewCouponRecord");
      if (this.search_end_date) {
        query3.lessThan("createdAt", tool.addDays(this.search_end_date, 1));
      }
      let query4 = new this.ParseServer.Query("NewCouponRecord");
      if (this.search_type) {
        query4.equalTo("couponRange", this.search_type);
      }
      var query = this.ParseServer.Query.and(
        this.ParseServer.Query.or(query1, query5),
        query2,
        query3,
        query4
      );
      query.descending("createdAt");
      query.count().then(count => {
        this.total = count;
      });
      query.skip((this.page - 1) * 10);
      query.limit(10);

      query.find().then(
        list => {
          this.couponData = [];
          if (list && list.length > 0) {
            this.couponData = list.map(item => {
              var message = {
                id: item.id,
                couponName: item.get("couponName"),
                amount: item.get("amount"),
                couponRange: item.get("couponRange"),
                state: item.get("state"),
                sendBy: item.get("sendBy"),
                updatedAt: item.get("updatedAt"),
                termValidity: item.get("termValidity"),
                createdAt: item.get("createdAt")
              };
              return message;
            });
          }
          this.loading = false;
        },
        error => {
          this.$Message.error("获取失败");
        }
      );
    },
    async page_list2() {
      let counts = 0;
      let query1 = new this.ParseServer.Query("NewCouponRecord");
      query1.contains("couponName", this.search_keyword);
      let query5 = new this.ParseServer.Query("NewCouponRecord");
      query5.contains("sendBy", this.search_keyword);
      let query2 = new this.ParseServer.Query("NewCouponRecord");
      if (this.search_start_date) {
        query2.greaterThan("createdAt", this.search_start_date);
      }
      let query3 = new this.ParseServer.Query("NewCouponRecord");
      if (this.search_end_date) {
        query3.lessThan("createdAt", tool.addDays(this.search_end_date, 1));
      }
      let query4 = new this.ParseServer.Query("NewCouponRecord");
      if (this.search_type) {
        query4.equalTo("couponRange", this.search_type);
      }
      var query = this.ParseServer.Query.and(
        this.ParseServer.Query.or(query1, query5),
        query2,
        query3,
        query4
      );
      query.descending("createdAt");
      await query.count().then(count => {
        counts = count;
      });
      query.limit(counts);
      query.find().then(
        list => {
          this.couponData2 = [];
          if (list && list.length > 0) {
            this.couponData2 = list.map(item => {
              var message = {
                id: item.id,
                couponName: item.get("couponName"),
                amount: item.get("amount"),
                couponRange: item.get("couponRange"),
                state: item.get("state"),
                sendBy: item.get("sendBy"),
                updatedAt: tool.dateFormat(
                  item.updatedAt,
                  "yyyy-MM-dd HH:mm:ss"
                ),
                termValidity: item.get("termValidity"),
                createdAt: tool.dateFormat(
                  item.createdAt,
                  "yyyy-MM-dd HH:mm:ss"
                )
              };
              return message;
            });
          }
        },
        error => {
          this.$Message.error("获取失败");
        }
      );
    },
    /** 分页加载学生信息 */
    student_page_list() {
      let query1;
      let querya;
      let queryc;
      let openIds = [];
      if (this.sendMode == "all" || this.sendMode == "part") {
        query1 = new this.ParseServer.Query(this.ParseServer.User);
        query1.equalTo("role", "student");
        querya = new this.ParseServer.Query(this.ParseServer.User);
        queryc = new this.ParseServer.Query(this.ParseServer.User);
        this.generalUser(query1, querya, queryc);
      }

      if (this.sendMode == 0 || this.sendMode == 1 || this.sendMode == 2) {
        query1 = new this.ParseServer.Query("MemberList");
        query1.equalTo("memberType", this.sendMode);
        querya = new this.ParseServer.Query("MemberList");
        queryc = new this.ParseServer.Query("MemberList");
        this.generalUser(query1, querya, queryc);
      }

      //个别学生
      if (this.sendMode == "ordinary") {
        let query = new this.ParseServer.Query("MemberList");
        query1 = new this.ParseServer.Query(this.ParseServer.User);
        querya = new this.ParseServer.Query(this.ParseServer.User);
        queryc = new this.ParseServer.Query(this.ParseServer.User);
        query.limit(10000);
        query.find().then(
          list => {
            if (list && list.length > 0) {
              list.forEach(item => {
                openIds.push(item.get("openId"));
              });
              query1.notContainedIn("openid", openIds);
              query1.equalTo("role", "student");
              this.generalUser(query1, querya, queryc);
            } else {
              this.generalUser(query1, querya, queryc);
            }
          },
          error => {}
        );
      }
    },
    //查询普通学生
    generalUser(query1, querya, queryc) {
      var self = this;
      if (self.studentPageIndex <= 1) {
        self.students = [];
      }
      let query2;
      querya.contains("nickName", this.search_student_keyword);
      queryc.contains("phone", this.search_student_keyword);
      query2 = this.ParseServer.Query.or(querya, queryc);
      let query = this.ParseServer.Query.and(query1, query2);
      this.studentLoading = true;
      query.ascending("createdAt");
      query.skip((self.studentPageIndex - 1) * 10);
      query.limit(10);
      query.find().then(
        list => {
          if (list && list.length > 0) {
            var _students = list.map(item => {
              return {
                id: item.id,
                nickName: item.get("nickName"),
                realname: item.get("realname"),
                openid: item.get("openid"),
                phone: item.get("phone")
              };
            });
            for (let i = 0; i < _students.length; i++) {
              let student = _students[i];
              self.students.push(student);
            }
            self.$nextTick(() => {
              if (self.$refs.studentTable) {
                var objData = self.$refs.studentTable.$refs.tbody.objData;
                if (objData) {
                  for (let i = 0; i < self.students.length; i++) {
                    let item = objData[i];
                    if (item) {
                      var c = self.selectedStudent.find(t => {
                        return t.id == item.id;
                      });
                      if (c) {
                        item._isChecked = true;
                      }
                    }
                  }
                }
              }
            });
          }
          self.studentLoading = false;
        },
        error => {
          self.$Message.error("获取失败");
        }
      );
    },
    // 全部导出
    async exports() {
      var format_data = this.couponData2;
      format_data.forEach((item, index) => {
        item.id = index + 1;
        item.sendBy = item.sendBy ? item.sendBy : "--";
        item.state =
          item.state == "0"
            ? "未使用"
            : item.state == "1"
            ? "已过期"
            : item.state == "2"
            ? "已使用"
            : "--";
        if (item.couponRange == "all") {
          item.couponRange = "全部通用";
        }
        if (item.couponRange == "blackGold") {
          item.couponRange = "黑金";
        }
        if (item.couponRange == "platinum") {
          item.couponRange = "铂金";
        }
        if (item.couponRange == "silver") {
          item.couponRange = "白银";
        }
        if (item.couponRange == "blackGoldNew") {
          item.couponRange = "黑金拉新";
        }
        if (item.couponRange == "platinumGoldNew") {
          item.couponRange = "铂金拉新";
        }
        if (item.couponRange == "silverGoldNew") {
          item.couponRange = "白银拉新";
        }
        if (item.couponRange == "newUser") {
          item.couponRange = "注册新用户";
        }
        if (item.couponRange == "blackGoldPullNewUser") {
          item.couponRange = "黑金拉新用户";
        }
        if (item.couponRange == "silverPullNewUser") {
          item.couponRange = "白银拉新用户";
        }
        if (item.couponRange == "platinumPullNewUser") {
          item.couponRange = "铂金拉新用户";
        }
      });
      setTimeout(() => {
        excelUtil.exportExcel(this.columns, format_data, "优惠券记录.xlsx");
      }, 3000);
    }
  }
};
</script>

<style lang="less" scoped>
.search-wrap {
  float: left;
  width: 220px;
  .label-split {
    margin: 0 10px;
    padding: 0 10px;
    width: 10%;
    box-sizing: border-box;
    display: block;
    float: left;
    text-align: center;
  }
  .search-keyword {
    float: left;
    width: 35%;
  }
  .select-choice {
    float: left;
    width: 35%;
    span {
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

