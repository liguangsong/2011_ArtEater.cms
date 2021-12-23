<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix" style="display: flex">
      <div class="search-wrap clear-fix" style="flex: 1">
        <div class="search-keyword" style="width: 230px">
          <Input
            v-model="search_keyword"
            size="large"
            placeholder="渠道名称关键字搜索"
            style="width: 200px"
          />
        </div>
        <div
          class="select-choice clear-fix"
          style="width: 500px; display: flex"
        >
          <span>注册时间</span>
          <div
            class="date-picker-wrap clear-fix"
            style="width: 400px; display: flex"
          >
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
      <div class="search-btn" style="width: 150px; margin: 0">
        <Button type="primary" class="search-btn" @click="search">搜索</Button>
      </div>
    </div>
    <Row class="table-wrap">
      <div style="width: 100px; margin-left: auto; margin-bottom: 20px">
        <Button type="primary" @click="handleAdd">添加优惠券</Button>
      </div>
      <Table :loading="loading" :columns="columns" :data="couponData">

   <template slot-scope="{ row }" slot="couponType">
            <span v-if="row.couponType =='manuallySend'">手动发送</span>
                <span v-if="row.couponType =='automaticallySend'">自动发送</span>
        </template>

          <template slot-scope="{ row }" slot="couponRange">
            <span v-if="row.couponRange =='all'">全部通用</span>
                <span v-if="row.couponRange =='blackGold'">黑金</span>
                    <span v-if="row.couponRange =='platinum'">铂金</span>
                        <span v-if="row.couponRange =='silver'">白银</span>
                            <span v-if="row.couponRange =='blackGoldNew'">黑金拉新</span>
                                <span v-if="row.couponRange =='platinumGoldNew'">铂金拉新</span>
                                    <span v-if="row.couponRange =='silverGoldNew'">白银拉新</span>
                                       <span v-if="row.couponRange =='newUser'">注册新用户</span>
                                       <span v-if="row.couponRange =='pullNewUser'">拉新用户</span>
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button
          v-if="row.couponType =='manuallySend'"
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="handleSend(row)"
            >发送</Button
          >
          <Button
            type="warning"
            size="small"
            style="margin-right: 5px"
            @click="handleEdit(row)"
            >编辑</Button
          >
          <Button type="error" size="small" @click="handleRemove(row)"
            >删除</Button
          >
        </template>
      </Table>
      <div class="page-wrap">
        <Page :total="total" @on-change="pagechange" v-if="total != 0" />
      </div>
    </Row>
    <Modal
      v-model="isShowCouponWindow"
      :loading="couponLoading"
      :title="window_title"
      @on-ok="handleSaveCoupon"
    >
      <Form
        v-if="isShowCouponWindow"
        :model="coupon_form"
        label-position="right"
        :label-width="100"
        ref="form"
        :rules="ruleValidate"
      >
        <FormItem label="优惠券名称" prop="couponName">
          <Input
            v-model="coupon_form.couponName"
            placeholder="请输入优惠券名称"
          ></Input>
        </FormItem>
        <FormItem label="优惠卷金额" prop="amount">
          <Input
            v-model="coupon_form.amount"
            type="number"
            placeholder="请输入优惠金额"
          ></Input>
        </FormItem>
        <FormItem label="优惠卷类型" prop="couponType">
          <Select v-model="coupon_form.couponType" @change="couponTypeChange">
            <Option
              v-for="item in couponTypes"
              :value="item.type"
              :key="item.type"
              >{{ item.title }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="优惠卷使用范围" prop="couponRange">
          <Select v-model="coupon_form.couponRange">
            <Option
              v-for="item in coupon_form.couponType == 'manuallySend' ? couponRanges : couponRanges2 "
              :value="item.type"
              :key="item.type"
              >{{ item.title }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="使用截止时间" prop="useEndTime">
          <DatePicker
            type="datetime"
            v-model="coupon_form.useEndTime"
            placeholder="请选择使用截止时间"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="isShowCouponSendWindow"
      :loading="couponSendLoading"
      width="800px"
      :title="'发送优惠券'"
      @on-ok="handleSendCoupon"
    >
      <div style="margin-bottom: 10px">
        <RadioGroup v-model="sendMode" @on-change="handleChangeStuMode">
          <Radio label="all">
            <span>全部学生</span>
          </Radio>
          <Radio label="part">
            <span>部分学生</span>
          </Radio>
        </RadioGroup>
      </div>
      <Card style="margin-top: 20px" v-if="sendMode == 'part'">
        <div>
          <div style="display: flex; margin-bottom: 10px">
            <div class="search-keyword" style="width: 300px">
              <Input
                v-model="search_student_keyword"
                size="large"
                placeholder="请输入学生昵称/手机号关键字搜索"
                style="width: 280px"
              />
            </div>
            <div class="search-btn">
              <Button type="primary" @click="handleSearchstudent" size="large"
                >查询</Button
              >
            </div>
          </div>
          <Table
            ref="studentTable"
            :columns="studentColmns"
            :data="students"
            @on-selection-change="handleSelectStudent"
          ></Table>
        </div>
            <div>
              <div v-if="!studentLoading" @click="handleLoadMore" style="cursor: pointer;text-align:center;height:50px;line-height:50px">点击加载更多</div>
              <div v-else  style="cursor: pointer;text-align:center;height:50px;line-height:50px;position:relative">
                <Spin fix>加载中...</Spin>
              </div>
            </div>
      </Card>
    </Modal>
  </div>
</template>

<script>
import { tool } from "@/api/tool";
import { verification } from "@/api/verification";
export default {
  name: "messageindex",
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      search_keyword: "",
      search_start_date: "",
      search_end_date: "",
      sendMode: "all",
      search_student_keyword: "",
      studentPageIndex: 1,
      couponLoading: true,
      couponSendLoading: true,
      loading: true,
      studentLoading: false,
      window_title: "添加优惠券",
      isShowCouponWindow: false,
      isShowCouponSendWindow: false,
      columns: [
        { title: "序号", type: "index", width: 60, align: "center" },
        { title: "优惠券名称", key: "couponName" },
        { title: "优惠卷金额", key: "amount" },
         { title: "优惠卷类型", key: "couponType",slot:"couponType", },
           { title: "使用范围", key: "couponRange",slot:"couponRange", },
        {
          title: "使用截止时间",
          key: "useEndTime",
          render: (h, params) => {
            if (params.row.useEndTime) {
              var txt = tool.dateFormat(
                params.row.useEndTime,
                "yyyy-MM-dd HH:mm:ss"
              );
              var color = "#515a6e";
              if (params.row.useEndTime < new Date()) {
                color = "#c5c8ce";
              }
              return h("div", { style: { color: color } }, txt);
            } else {
              return "";
            }
          },
        },
        {
          title: "注册时间",
          key: "createdAt",
          render: (h, params) => {
            var txt = tool.dateFormat(
              params.row.createdAt,
              "yyyy-MM-dd HH:mm:ss"
            );
            return h("div", txt);
          },
        },
        { title: "添加人", key: "createBy" },
        { title: "操作", key: "action", align: "center", slot: "action" ,width: 190, },
      ],
      studentColmns: [
        { title: "序号", type: "index", width: 60, align: "center" },
        { title: "昵称", key: "nickName" },
        { title: "学生姓名", key: "realname" },
        { title: "手机号", key: "phone" },
                { type: "selection", width: 60, align: "center", title: "全选" },
      ],
      couponData: [],
      students: [],
      couponTypes: [
        { type: "manuallySend", title: "手动发送" },
        { type: "automaticallySend", title: "自动发送" },
      ],
      couponRanges: [
        { type: "all", title: "全部通用" },
        { type: "blackGold", title: "黑金" },
        { type: "platinum", title: "铂金" },
        { type: "silver", title: "白银" },
      ],
      couponRanges2: [
        { type: "blackGoldNew", title: "黑金拉新" },
        { type: "platinumGoldNew", title: "铂金拉新" },
        { type: "silverGoldNew", title: "白银拉新" },
        { type: "newUser", title: "注册新用户" },
        { type: "pullNewUser", title: "拉新用户" },
      ],
      coupon_form: {
        id: "",
        couponName: "",
        couponType: "manuallySend",
        couponRange: "all",
        amount: 0,
        useEndTime: "",
      },
      coupon_curr: null,
      ruleValidate: {
        couponName: [
          { required: true, message: "请输入优惠券名称", trigger: "blur" },
        ],
        amount: [
          {
            required: true,
            message: "请输入正确的优惠金额",
            trigger: "blur",
            validator: verification.validateFloat2,
          },
        ],
           couponTypes:[
          {
            trigger: "change",
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("优惠卷类型不能为空"));
              }  callback();
            },
          },
        ],
         couponRange:[
          {
            trigger: "change",
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("优惠卷使用范围不能为空"));
              }  callback();
            },
          },
        ],
        useEndTime: [
          {
            trigger: "change",
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入使用截止时间"));
              } else {
                if (value < new Date()) {
                  callback(new Error("截止时间必须是未来的某个时间"));
                } else {
                  callback();
                }
              }
            },
          },
        ],
      },
      init_data: "",
    };
  },
  mounted() {
    var self = this;
    this.init_data = JSON.stringify(this.message_form);
    this.page_list(this.page);
    this.student_page_list();
  },
  methods: {
    search() {
      this.page = 1;
      this.page_list(this.page);
    },
    pagechange(e) {
      this.page = e;
      this.page_list();
    },
      couponTypeChange(){
      console.log('dfc')
      },

    /** 添加优惠券 */
    handleAdd() {
      this.window_title = "添加优惠券";
      this.coupon_form = {
        id: "",
        couponName: "",
        couponType: "manuallySend",
        couponRange: "",
        amount: 0,
        useEndTime: "",
      };
      this.isShowCouponWindow = true;
    },
    /** 编辑优惠券 */
    handleEdit(row) {
      console.log(row)
      self.window_title = "编辑优惠券";
      this.coupon_form = {
        id: row.id,
        couponName: row.couponName,
        couponType: row.couponType,
        couponRange: row.couponRange,
        amount: row.amount,
        useEndTime: row.useEndTime,
      };
      this.isShowCouponWindow = true;
    },
    /** 发送优惠券 */
    handleSend(row) {
      console.log(row)
      var self = this;
      this.selectedStudent = [];
      this.coupon_curr = row;
      if (self.$refs.studentTable) {
        var objData = self.$refs.studentTable.$refs.tbody.objData;
        if (objData) {
          for (let i = 0; i < self.students.length; i++) {
            let _item = objData[i];
            if (_item) {
              var c = self.selectedStudent.find((t) => {
                return t.id == _item.id;
              });
              if (c) {
                _item._isChecked = true;
              } else {
                _item._isChecked = false;
              }
            }
          }
        }
      }
      this.isShowCouponSendWindow = true;
    },
    /** 选择学生 */
    handleSelectStudent(selection) {
      var self = this;
      selection.forEach((t) => {
        console.log(t)
        var item = self.selectedStudent.find((_t) => {
          return _t.id == t.id;
        });
        console.log(item)
        if (!item) {
          self.selectedStudent.push(t);
        }
      });
      // this.selectedStudent = selection
    },
    /** 删除学生 */
    handleTagClose(item) {
      var self = this;
      self.selectedStudent.forEach((c, _index) => {
        if (c.id == item.id) {
          self.selectedStudent.splice(_index, 1);
        }
      });
      if (self.$refs.studentTable) {
        var objData = self.$refs.studentTable.$refs.tbody.objData;
        if (objData) {
          for (let i = 0; i < self.students.length; i++) {
            let _item = objData[i];
            if (_item) {
              var c = self.selectedStudent.find((t) => {
                return t.id == _item.id;
              });
              if (c) {
                _item._isChecked = true;
              } else {
                _item._isChecked = false;
              }
            }
          }
        }
      }
    },
    /** 选择发送模式 */
    handleChangeStuMode(mode) {
      this.selectedStudent = [];
    },
  
    handleSaveCoupon() {
      console.log(this.coupon_form)
      if(this.coupon_form.couponType == 'automaticallySend'){
        // console.log(this.coupon_form.useEndTime.getTime()+ 1000 * 60 * 60 * 24 * 365)
        // this.coupon_form.useEndTime = new Date(this.coupon_form.useEndTime.getTime()+ 1000 * 60 * 60 * 24 * 365)
      }
       var self = this;
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          self.$Message.error("请检查表单项");
          self.couponLoading = false;
          setTimeout(() => {
            self.couponLoading = true;
          }, 100);
          return false;
        } else {
          var CouponInfos = self.ParseServer.Object.extend("NewCouponInfo");
          var coupon = new CouponInfos();
          if (self.coupon_form.id) {
            coupon.set("id", self.coupon_form.id);
          }
          coupon.set("couponName", self.coupon_form.couponName);
          coupon.set("amount", parseFloat(self.coupon_form.amount));
          coupon.set("couponType", self.coupon_form.couponType);
          coupon.set("couponRange", self.coupon_form.couponRange);
          var realname = self.ParseServer.User.current().get("realname");
          coupon.set("createBy", realname);
          coupon.set("useEndTime", self.coupon_form.useEndTime);
          coupon.save().then(
            (response) => {
              self.isShowCouponWindow = false;
              self.$Message.success("保存成功");
              self.page_list();
            },
            (error) => {
              debugger;
              this.$Message.error("保存失败");
            }
          );
        }
      });
    },
    /** 发送优惠券 */
    handleSendCoupon() {
      var self = this;
      var CouponRecords = self.ParseServer.Object.extend("NewCouponRecord");

      if (self.coupon_curr) {
        var list = [];
        if (self.sendMode == "all") {
          // 发送给全部用户
          let query = new this.ParseServer.Query(this.ParseServer.User);
          query.equalTo("role", "student");
          query.limit(1000000);
          query.find().then((students) => {
            students.forEach((item) => {
              var couponRecord = new CouponRecords();
              couponRecord.set("couponId", self.coupon_curr.id);
              couponRecord.set("couponName", self.coupon_curr.couponName);
              couponRecord.set("amount", parseFloat(self.coupon_curr.amount));
              couponRecord.set("useEndTime", self.coupon_curr.useEndTime);
              couponRecord.set("openid", item.get("openid"));
              couponRecord.set("mode", self.sendMode);
              couponRecord.set("couponType", self.coupon_curr.couponType);
              couponRecord.set("couponRange", self.coupon_curr.couponRange);
               couponRecord.set("state", 0);
              // couponRecord.set("orderNo", "");
              couponRecord.set("useTime", new Date());
              list.push(couponRecord);
            });
            if (list && list.length > 0) {
              self.ParseServer.Object.saveAll(list).then((resList) => {
                self.isShowCouponSendWindow = false;
                self.$Message.success("赠送成功");
              });
            }
          });
        } else {
          // 发送给部分用户
          self.selectedStudent.forEach((item) => {
            var couponRecord = new CouponRecords();
            couponRecord.set("couponId", self.coupon_curr.id);
            couponRecord.set("couponName", self.coupon_curr.couponName);
            couponRecord.set("amount", parseFloat(self.coupon_curr.amount));
            couponRecord.set("useEndTime", self.coupon_curr.useEndTime);
            couponRecord.set("openid", item.openid);
            couponRecord.set("mode", self.sendMode);
            couponRecord.set("couponType", self.coupon_curr.couponType);
            couponRecord.set("couponRange", self.coupon_curr.couponRange);
            couponRecord.set("state", 0);
            // couponRecord.set("orderNo", "");
            couponRecord.set("useTime", new Date());
            list.push(couponRecord);
          });
          if (list && list.length > 0) {
            self.ParseServer.Object.saveAll(list).then((resList) => {
              self.isShowCouponSendWindow = false;
              self.$Message.success("赠送成功");
            });
          } else {
            self.$Message.error("请选择要赠送优惠券的学生");
            self.couponSendLoading = false;
            setTimeout(() => {
              self.couponSendLoading = true;
            }, 100);
            return false;
          }
        }
      }
    },
  
    get_entity() {
      var query = new this.ParseServer.Query("NewCouponInfo");
      query.get(this.message_id).then((response) => {
        Object.keys(this.message_form).forEach((key) => {
          this.message_form[key] = response.get(key);
        });
      });
    },

    pagechange(e) {
      this.page = e;
      this.page_list();
    },
    
    page_list() {
      this.loading = true;
      let query1 = new this.ParseServer.Query("NewCouponInfo");
      query1.contains("couponName", this.search_keyword);
      let query2 = new this.ParseServer.Query("NewCouponInfo");
      if (this.search_start_date) {
        query2.greaterThan("createdAt", this.search_start_date);
      }
      let query3 = new this.ParseServer.Query("NewCouponInfo");
      if (this.search_end_date) {
        query3.lessThan("createdAt", tool.addDays(this.search_end_date, 1));
      }
      var query = this.ParseServer.Query.and(
        this.ParseServer.Query.or(query1),
        query2,
        query3
      );
      query.descending("createdAt");
      query.count().then((count) => {
        this.total = count;
      });
      query.skip((this.page - 1) * 10);
      query.limit(10);
      
      query.find().then(
        (list) => {
          this.couponData = [];
          if (list && list.length > 0) {
            this.couponData = list.map((item) => {
              var message = {
                id: item.id,
                couponName: item.get("couponName"),
                amount: item.get("amount"),
                couponType: item.get("couponType"),
                   couponRange: item.get("couponRange"),
                createBy: item.get("createBy"),
                useEndTime: item.get("useEndTime"),
                createdAt: item.get("createdAt"),
              };
              return message;
            });
          }
          this.loading = false;
        },
        (error) => {
          console.log(error);
          this.$Message.error("获取失败");
        }
      );
    },
    handleSearchstudent() {
      this.students = [];
      this.studentPageIndex = 1;
      this.student_page_list();
    },
    /** 分页加载学生信息 */
    student_page_list() {
      var self = this;
      this.studentLoading = true;
      let query1 = new this.ParseServer.Query(this.ParseServer.User);
      query1.equalTo("role", "student");
      let querya = new this.ParseServer.Query(this.ParseServer.User);
      querya.contains("nickName", this.search_student_keyword);
      let queryc = new this.ParseServer.Query(this.ParseServer.User);
      queryc.contains("phone", this.search_student_keyword);
      let query2 = this.ParseServer.Query.or(querya, queryc);
      let query = this.ParseServer.Query.and(query1, query2);
      query.ascending("createdAt");
      query.skip((self.studentPageIndex - 1) * 10);
      query.limit(10);
      query.find().then(
        (list) => {
          if (list && list.length > 0) {
            var _students = list.map((item) => {
              return {
                id: item.id,
                nickName: item.get("nickName"),
                realname: item.get("realname"),
                openid: item.get("openid"),
                phone: item.get("phone"),
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
                      var c = self.selectedStudent.find((t) => {
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
        (error) => {
          console.log(error);
          self.$Message.error("获取失败");
        }
      );
    },
    /** 加载更多学生 */
    handleLoadMore() {
      var self = this;
      self.studentPageIndex = self.studentPageIndex + 1;
      this.student_page_list();
    },
    handleRemove(row) {
      let _this = this;
      this.$Modal.confirm({
        title: "删除提示",
        content: "<p>删除后将无法恢复，确定要删除吗？</p>",
        onOk: () => {
          var query = new this.ParseServer.Query("NewCouponInfo");
          query.get(row.id).then(
            (response) => {
              response.destroy().then(
                (delete_result) => {
                  this.$Message.success("删除成功");
                  this.page = 1;
                  this.page_list(this.page);
                },
                (error) => {
                  this.$Message.error("删除失败");
                }
              );
            },
            (error) => {
              this.$Message.error("清确保删除的数据真实存在");
            }
          );
        },
        // onCancel: () => {
        //   this.$Message.info("取消了操作");
        // }
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
