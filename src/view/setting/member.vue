<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix" style="display: flex">
      <div class="search-wrap clear-fix" style="flex: 1">
        <div class="search-keyword" style="width:280px">
          <Input
            v-model="search_keyword"
            size="large"
            placeholder="名称关键字搜索"
            style="width:200px"
          />
        </div>

        <div class="search-btn" style="width:150px;margin:0">
          <Button type="primary" class="search-btn" @click="search">搜索</Button></Col>
        </div>
      </div>
      <div style="width: 100px; text-align: right">
        <Button type="primary" @click="addClassify">新增</Button>
      </div>
    </div>
    <Row class="table-wrap">
      <Table :loading="loading" :columns="columns" :data="member_datas">
        <template slot-scope="{ row }" slot="action">
          <Button
            type="warning"
            size="small"
            style="margin-right: 5px"
            @click="EditFormShow(row)"
            >编辑</Button
          >
          <Button
            type="error"
            size="small"
            style="margin-right: 5px"
            @click="DelConfirmShow(row)"
            >删除</Button
          >
        </template>

        <template slot-scope="{ row }" slot="typeName">
          <span v-if="row.typeName == 1">黑金</span>
          <span v-if="row.typeName == 2">白金</span>
          <span v-if="row.typeName == 3">白银</span>
        </template>
      </Table>
      <div class="page-wrap">
        <Page :total="total" @on-change="pagechange" v-if="total != 0" />
      </div>
    </Row>
    <Modal
      v-model="isShowAddForm"
      :title="window_title"
      width="1000"
      mask
      scrollable
      :loading="modalLoading"
      @on-ok="add_member"
    >
      <div class="bodyForm">
        <Form
          v-if="isShowAddForm"
          ref="memberForm"
          :model="member_form"
          label-position="left"
          :label-width="90"
          :rules="ruleValidate"
        >
          <FormItem label="会员类型名称" prop="typeName">
            <Select
              size="large"
              class="choice"
              placeholder="会员类型名称"
              :clearable="true"
              v-model="member_form.typeName"
              style="width: 150px"
            >
              <Option value="1" :key="1">黑金</Option>
              <Option value="2" :key="2">白金</Option>
              <Option value="3" :key="3">白银</Option>
            </Select>
          </FormItem>

          <FormItem label="会员名称" prop="memberName">
          <Input
            v-model="member_form.memberName"
            placeholder="请输入会员名称"
          ></Input>
        </FormItem>
          <FormItem label="会员原价" prop="memberPrice">
            <Input
              v-model="member_form.memberPrice"
              placeholder="请输入会员原价"
            ></Input>
          </FormItem>
          <FormItem label="会员优惠价" prop="promotionPrice">
            <Input
              v-model="member_form.promotionPrice"
              placeholder="请输入会员优惠价"
            ></Input>
          </FormItem>

          <FormItem label="优惠截止时间" prop="">
            <div class="date-picker" style="width: 400px">
              <DatePicker
                v-model="member_form.expirationDate"
                size="large"
                type="date"
                placeholder="优惠截止时间"
              ></DatePicker>
            </div>
          </FormItem>

          <!-- <FormItem label="会员有效期" prop="memberPeriod">
            <Select
              size="large"
              class="choice"
              placeholder="会员有效期"
              :clearable="true"
              v-model="member_form.memberPeriod"
              style="width: 150px"
            >
              <Option value="perpetual" key="perpetual">永久</Option>
              <Option value="12" :key="12">12个月</Option>
              <Option value="11" :key="11">11个月</Option>
              <Option value="10" :key="10">10个月</Option>
              <Option value="9" :key="9">9个月</Option>
              <Option value="8" :key="8">8个月</Option>
              <Option value="7" :key="7">7个月</Option>
              <Option value="6" :key="6">6个月</Option>
              <Option value="5" :key="5">5个月</Option>
              <Option value="4" :key="4">4个月</Option>
              <Option value="3" :key="3">3个月</Option>
              <Option value="2" :key="2">2个月</Option>
              <Option value="1" :key="1">1个月</Option>
              <Option value="threeWeek" key="threeWeek">3周</Option>
              <Option value="twoWeek" key="twoWeek">2周</Option>
              <Option value="aWeek" key="aWeek">1周</Option>
            </Select>
          </FormItem> -->

          <FormItem label="购买说明">
            <Input
              type="textarea"
              :rows="6"
              v-model="member_form.explain"
              placeholder="购买说明"
              style="width: 400px"
            ></Input>
          </FormItem>
        </Form>

        <!-- 会员名片 -->
        <div class="card">
          <div
            class="img"
            v-for="(item, index) in imgList"
            :key="index"
            v-if="item.id == surfaceId"
          >
            <img :src="item.src" alt="" srcset="" ref="imgs" />
          </div>

          <div
            style="
              margin-top: 20px;
              display: flex;
              justify-content: center;
              font-size: 18px;
            "
          >
            <Button size="small" style="margin-right: 5px" @click="nextStep()"
              >下一步</Button
            >
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Editor from "@/components/editor";
import { verification } from "@/api/verification";
import myUpload from "@/components/myUpload";
import { tool } from "@/api/tool";
export default {
  name: "coursesmanageindex",
  components: {
    Editor,
    myUpload,
  },
  data() {
    return {
      surfaceId: 0,
      page: 1,
      pageSize: 10,
      total: 0,
      memberId: "",
      search_keyword: "",
      realname: "",
      route: [
        {
          id: "0",
          price: 0,
        },
      ],
      columns: [
        { title: "ID", key: "id" },
        {
          title: "会员类型名称",
          key: "typeName",
          slot: "typeName",
        },
        {
          title: "会员名称",
          key: "memberName",
        },
        { title: "会员价格", key: "memberPrice" },
        { title: "优惠价格", key: "promotionPrice" },
        { title: "截止优惠日期", key: "expirationDate" },
        { title: "操作", key: "action", width: 400, slot: "action" },
      ],
      member_datas: [],
      imgList: [
        {
          src: "https://art-eater.oss-cn-beijing.aliyuncs.com/video/heijin1.png",
          id: 0,
        },
        {
          src: "https://art-eater.oss-cn-beijing.aliyuncs.com/video/bojin2.png",
          id: 1,
        },
        {
          src: "https://art-eater.oss-cn-beijing.aliyuncs.com/video/baiyin3.png",
          id: 2,
        },
      ],
      member_form: {
        surface: "", //封面图
        typeName: "", //会员类型名称
        memberName: "", //会员名称
        memberPrice: "", //会员原价
        promotionPrice: 0, //会员优惠价
        expirationDate: "", //截止日期
        memberPeriod: "12", //会员有效期
        explain: "", //购买说明
      },
      ruleValidate: {
        memberName: [
          { required: true, message: "请输入会员名称", trigger: "blur" },
        ],
        memberPrice: [
          { required: true, message: "请输入会员原价", trigger: "blur" },
          {
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (
                !/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(
                  value
                )
              ) {
                return callback(
                  new Error("价格由整数、小数点和最多两个小数组成！")
                );
              }
              callback();
            },
          },
        ],
        promotionPrice: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              console.log(value);
              console.log(this.member_form.memberPrice);
              if (
                !/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(
                  value
                )
              ) {
                return callback(
                  new Error("价格由整数、小数点和最多两个小数组成！")
                );
              }
              if (Number(value) > Number(this.member_form.memberPrice)) {
                return callback(new Error("会员优惠价不能大于会员原价！"));
              }
              callback();
            },
          },
        ],

        // memberPeriod: [
        //   { required: true, message: "请输入会员有效期", trigger: "blur" },
        // ],
      },
      isShowAddForm: false,
      isShowContentForm: false,
      isShowCommentsForm: false,
      loading: true,
      modalLoading: true,
      window_title: "新增会员",
    };
  },
  mounted() {
    this.page_list(this.page);
  },
  methods: {
    // 下一步
    nextStep() {
      this.surfaceId == 2 ? (this.surfaceId = 0) : (this.surfaceId += 1);
      console.log(this.surfaceId);
    },
    cancel() {},
    handleVChange(r) {
      this.isShowImg = r;
    },
    handleVChange1(r) {
      this.isShowHeadImg = r;
    },
    handleShowImg(row) {
      this.isShowImg = true;
      this.currBackgroundImg = row.backgroundImg;
    },
    handleShowHeadImg(row) {
      this.isShowHeadImg = true;
      this.currBackgroundImg = row.headImg;
    },
    /*
     *获取会员设置编辑
     *作者：gzt
     *时间：2020-11-22 09:21:48
     */
    get_entity() {
      console.log("asc");
      console.log(this.memberId);
      var query = new this.ParseServer.Query("MemberType");
      query.get(this.memberId).then((res) => {
        console.log(res);
        console.log(res.get("memberName"));
        this.surfaceId = res.get("surfaceId");
        this.member_form.typeName = res.get("typeName");
        this.member_form.memberName = res.get("memberName");
        this.member_form.memberPrice = res.get("memberPrice");
        this.member_form.promotionPrice = res.get("promotionPrice");
        if (res.get("expirationDate")) {
          this.member_form.expirationDate = res.get("expirationDate");
        }
        this.member_form.memberPeriod = res.get("memberPeriod");
        this.member_form.explain = res.get("explain");
      });
    },
    /** 弹出添加会员设置分类弹框 */
    addClassify() {
      this.surfaceId = 0;
      this.memberId = "";
      this.member_form = {
        typeName: "", //会员类型名称
        memberName: "", //会员名称
        memberPrice: "", //会员原价
        promotionPrice: 0, //会员优惠价
        expirationDate: "", //截止日期
        memberPeriod: "12", //会员有效期
        explain: "", //购买说明
      };
      this.window_title = "会员设置";
      this.isShowAddForm = true;
    },

    /**
     * 弹出编辑窗口
     */
    EditFormShow(row) {
      console.log(row);
      this.memberId = row.id;
      this.surfaceId = row.surfaceId;
      this.member_form.surface = row.surface;
      this.isShowAddForm = true;
      this.window_title = "编辑会员设置";
      this.get_entity();
    },

    /*
     *新增会员设置模块
     */
    add_member() {
      let expirationDate;
      var imgs = this.imgList.find((value) => value.id == this.surfaceId);
      var members = this.ParseServer.Object.extend("MemberType");
      var member = new members();
      // 修改
      if (this.memberId) {
        this.updated_member();
      } else {
        this.member_form.surface = imgs.src;
        if (this.member_form.expirationDate) {
          expirationDate = this.dateToString(this.member_form.expirationDate);
          console.log(expirationDate);
        }
        this.$refs["memberForm"].validate((valid) => {
          if (!valid) {
            this.$Message.error("请检查表单项");
            this.modalLoading = false;
            setTimeout(() => {
              this.modalLoading = true;
            }, 100);
            return false;
          } else {
            console.log("保存11111111");
            // 保存
            member.set("memberName", this.member_form.memberName);
            member.set("typeName", this.member_form.typeName);
            member.set("surface", this.member_form.surface);
            member.set("surfaceId", this.surfaceId);
            member.set("memberPrice", this.member_form.memberPrice);
            member.set(
              "promotionPrice",
              Number(this.member_form.promotionPrice)
            );
            member.set("expirationDate", expirationDate);
            member.set("memberPeriod", this.member_form.memberPeriod);
            member.set("explain", this.member_form.explain);
            member.save().then(
              (member) => {
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

    //日期转字符串
    dateToString(date) {
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString();
      var day = date.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      var dateTime = year + "-" + month + "-" + day;
      return dateTime;
    },

    updated_member() {
      // console.log(this.memberId);
      let expirationDate;
      console.log(this.member_form.expirationDate);
      console.log(typeof this.member_form.expirationDate);
      if (
        this.member_form.expirationDate &&
        typeof this.member_form.expirationDate == "string"
      ) {
        expirationDate = this.member_form.expirationDate;
      } else if (this.member_form.expirationDate) {
        expirationDate = this.dateToString(this.member_form.expirationDate);
      } else {
        expirationDate = this.member_form.expirationDate;
      }

      var query = new this.ParseServer.Query("MemberType");
      query.get(this.memberId).then((item) => {
        console.log(item);
        item.set("memberName", this.member_form.memberName);
        item.set("typeName", this.member_form.typeName);
        item.set("surface", this.member_form.surface);
        item.set("surfaceId", this.surfaceId);
        item.set("memberPrice", this.member_form.memberPrice);
        item.set("promotionPrice", Number(this.member_form.promotionPrice));
        item.set("expirationDate", expirationDate);
        item.set("memberPeriod", this.member_form.memberPeriod);
        item.set("explain", this.member_form.explain);
        item.save().then(
          (item) => {
            this.$Message.success("修改成功");
            this.cancel();
            this.isShowAddForm = false;
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
      this.page = 1;
      this.page_list(this.page);
    },
    pagechange(e) {
      this.page = e;
      this.page_list();
    },

    page_list(page_index) {
      let _this = this;
      let query = new this.ParseServer.Query("MemberType");
      if (this.search_keyword) {
        query.contains("memberName", this.search_keyword);
      }
      query.descending("createdAt");
      query.count().then((count) => {
        _this.total = count;
      });
      query.skip((this.page - 1) * this.pageSize);
      query.limit(this.pageSize);
      query.find().then(
        (list) => {
          console.log(list);
          _this.member_datas = [];
          if (list && list.length > 0) {
            console.log(list);
            list.forEach((item) => {
              console.log(item.id);
              _this.member_datas.push({
                id: item.id,
                typeName: item.get("typeName"),
                memberName: item.get("memberName"),
                memberPrice: item.get("memberPrice"),
                surfaceId: item.get("surfaceId"),
                surface: item.get("surface"),
                promotionPrice: item.get("promotionPrice"),
                expirationDate: item.get("expirationDate"),
              });
            });
            console.log(this.member_datas);
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
      var query_deletes = new this.ParseServer.Query("MemberType");
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
        content: "<p>当前会员设置会被删除，确定要删除吗？</p>",
        onOk: () => {
          var query = new this.ParseServer.Query("MemberType");
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
    checkLogin() {},

    subjecTclassifyChange() {},
    courseClassifyChange() {},
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
.bodyForm {
  display: flex;
  justify-content: space-evenly;
}
.img {
  width: 355px;
  height: 250px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
