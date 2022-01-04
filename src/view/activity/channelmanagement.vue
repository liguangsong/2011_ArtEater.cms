<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix" style="display:flex" v-if="isAddChannel== false && isLookBill == false"> 
      <div class="search-wrap clear-fix" style="flex:1">
        <div class="search-keyword" style="width:230px">
          <Input
            v-model="search_keyword"
            size="large"
            placeholder="渠道名称关键字搜索"
            style="width:200px"
          />
        </div>
        <div class="select-choice clear-fix" style="width: 500px;
        display: flex;">
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
          <Button type="primary" class="search-btn" @click="search">搜索</Button></Col>
        </div>
    </div>
    <Row class="table-wrap" v-if="isAddChannel== false && isLookBill == false">
        <div style="width:100px; margin-left: auto;
    margin-bottom: 20px;">
        <Button type="primary" @click="addChannel">新增渠道</Button>
      </div>
      <Table :loading="loading" :columns="columns" :data="datas">

    <template slot-scope="{ row }" slot="qsCode">
     <span style="color:#0758a2;cursor: pointer;" @click="handleExamine(row)">查看</span>
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
            @click="ExamineBill(row)"
            >查看账单</Button
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
<!-- 新增渠道 -->
<div v-if="isAddChannel && isLookBill == false" style="margin-top:50px;margin-left:40px">
  <Form
        v-if="isAddChannel"
        ref="form"
        :model="form"
        label-position="left"
        :label-width="100"
        :rules="ruleValidate"
      >
          <FormItem label="渠道名称" prop="channelName">
          <Input
           style="width: 200px"
            v-model="form.channelName"
            placeholder="请输入渠道名称"
          ></Input>
        </FormItem>
          <FormItem label="黑金活动价格" prop="blackActivePrice">
          <Input
           style="width: 200px"
            v-model="form.blackActivePrice"
            placeholder="请输入黑金活动价格"
          ></Input>
        </FormItem>
          <!-- <FormItem label="铂金活动价格" prop="platinumActivePrice">
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
        </FormItem> -->
     <FormItem label="分成比例" prop="divideInto">
          <Input
           style="width: 200px"
            v-model="form.divideInto"
            placeholder="请输入分成比例(百分比)"
          ></Input>
          <span style="margin-left:10px">%</span>
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
   <Button
            style="margin-right:5px;cursor: pointer;"
            @click="goback"
            >返回</Button
          >
           <Button
            type="primary"
            style="margin-right:5px;cursor: pointer;"
            @click="add_channel"
            >保存</Button
          >
      </div>
</div>

<!-- 查看账单 -->
<div v-if="isAddChannel==false && isLookBill" style="margin-top:50px;margin-left:40px">
      <Row class="table-wrap" v-if="isLookBill">
        <div style="width:100px; margin-left: auto;
    margin-bottom: 20px;">
     <Button type="primary" @click="exportBill">导出账单</Button>
      </div>
      <Table :loading="loading" :columns="columns2" :data="datas2">
       <template slot-scope="{ row }" slot="memberType">
     <span v-if="row.memberType == 1">黑金</span>
       <span v-if="row.memberType == 2">铂金</span>
         <span v-if="row.memberType == 3">白银</span>
       </template>
      </Table>
      <div class="page-wrap">
        <Page :total="total2" @on-change="pagechange2" v-if="total2 != 0" />
      </div>
    </Row>
 <div class="bottom">
   <Button
            style="margin-right:5px;margin-top:20px;cursor: pointer;"
            @click="goback"
            >返回</Button
          >
      </div>
</div>

  <Modal @on-visible-change="handleVChange" width="450" title="二维码" v-model="isShowImg">
          <div style="margin:5px 0;text-align:center">
              <div class="qrcode" ref="qrCodeUrl"></div>
          </div>
        </Modal>
</div>
</template>

<script>
import Editor from "@/components/editor";
import QRCode from "qrcodejs2";
import { tool } from "@/api/tool";
import myUploadMuti from "@/components/myUploadMuti";
import excelUtil from "../../utils/dealwithExcelUtil";
export default {
  name: "coursesmanageindex",
  components: {
    Editor,
    myUploadMuti,
  },
  data() {
    return {
      isShowImg: false,
      isAddChannel: false,
      page: 1,
      page2: 1,
      pageSize: 10,
      total: 0,
      isall: false,
      total2: 0,
      search_keyword: "",
      search_start_date: "",
      search_end_date: "",
      isLookBill: false,
      columns: [
        { title: "ID", key: "id" },
        { title: "渠道名称", key: "channelName", width: 100 },
        { title: "黑金活动价格", key: "blackActivePrice" },
        // { title: "铂金活动价格", key: "platinumActivePrice" },
        // { title: "白银活动价格", key: "silverActivePrice" },
        { title: "分成比例", key: "divideInto" },
        { title: "提成总金额", key: "TotalAmountCommission", width: 100 },
        { title: "二维码", key: "qsCode", slot: "qsCode" },
        { title: "创建时间", key: "updatedAt" },
        { title: "操作", key: "action", width: 200, slot: "action" },
      ],
      columns2: [
        { title: "会员类型", key: "memberType", slot: "memberType" },
        { title: "活动金额", key: "price" },
        { title: "提成金额", key: "commissionPrice" },
        { title: "推广注册手机号", key: "commissionPrice" },
        { title: "创建时间", key: "createdAt" },
      ],
      datas: [],
      datas2: [],
      form: {
        channelName: "",
        blackActivePrice: 0,
        // platinumActivePrice: 0,
        // silverActivePrice: 0,
        divideInto: "", //分成比例
        TotalAmountCommission: "", //提成总金额
        amountCommission: "", //提成金额
        promoteRegistrationPhone: "", //推广注册手机号
        // qsCode:"",
        baseMap: "", //活动底图
        parentId: "", //查看账单 渠道id
      },
      Id: "",
      ruleValidate: {
        channelName: [
          { required: true, message: "请输入渠道名称", trigger: "blur" },
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
                  new Error(
                    "请输入黑金活动价格,价格由整数、小数点和最多两个小数组成！"
                  )
                );
              }
              callback();
            },
          },
        ],
        // platinumActivePrice: [
        //   {
        //     required: true,
        //     trigger: "blur",
        //     validator: (rule, value, callback) => {
        //       if (
        //         !/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(
        //           value
        //         )
        //       ) {
        //         return callback(
        //           new Error(
        //             "请输入铂金活动价格,价格由整数、小数点和最多两个小数组成！"
        //           )
        //         );
        //       }
        //       callback();
        //     },
        //   },
        // ],
        // silverActivePrice: [
        //   {
        //     required: true,
        //     trigger: "blur",
        //     validator: (rule, value, callback) => {
        //       if (
        //         !/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(
        //           value
        //         )
        //       ) {
        //         return callback(
        //           new Error(
        //             "请输入白银活动价格,价格由整数、小数点和最多两个小数组成！"
        //           )
        //         );
        //       }
        //       callback();
        //     },
        //   },
        // ],
      },
      loading: true,
    };
  },
  mounted() {
    this.init_data = JSON.stringify(this.form);
    this.page_list(this.page);
  },
  methods: {
    handleVChange(r) {
      this.isShowImg = r;
    },

    handleExamine(row) {
      this.creatQrCode(row);
      this.isShowImg = true;
    },

    //二维码
    creatQrCode(row) {
      this.$refs.qrCodeUrl.innerHTML = "";
      var qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: `https://www.arteater.cn/channel/Ji2vVK7htw.txt/?id=${row.id}`, // 需要转换为二维码的内容
        width: 100,
        height: 100,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    },

    addChannel() {
      this.isAddChannel = true;
      this.Id = "";
      this.form = {
        channelName: "",
        blackActivePrice: 0,
        // platinumActivePrice: 0,
        // silverActivePrice: 0,
        divideInto: "", //分成比例
        TotalAmountCommission: "", //提成总金额
        amountCommission: "", //提成金额
        promoteRegistrationPhone: "", //推广注册手机号
        baseMap: "",
      };
    },

    /**
     * 弹出编辑窗口
     */
    EditFormShow(row) {
      this.isAddChannel = true;
      this.Id = row.id;
      this.form.channelName = row.channelName;
      this.form.blackActivePrice = row.blackActivePrice;
      // this.form.platinumActivePrice = row.platinumActivePrice;
      // this.form.silverActivePrice = row.silverActivePrice;
      // this.form.qsCode = row.qsCode;
      this.form.divideInto = row.divideInto;
      this.form.TotalAmountCommission = row.TotalAmountCommission;
      this.form.amountCommission = row.amountCommission;
      this.form.promoteRegistrationPhone = row.promoteRegistrationPhone;
      this.form.PromotionTime = row.PromotionTime;
      this.form.baseMap = row.baseMap;
    },
    // 富文本说明
    change_value(html) {
      this.form.baseMap = html == "<p><br></p>" ? "" : html;
    },

    /*
     *新增渠道
     */
    add_channel() {
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
          var datas = this.ParseServer.Object.extend("ChannelManagement");
          var data = new datas();
          // 修改
          if (this.Id) {
            this.updated();
          } else {
            // 保存
            data.set("channelName", this.form.channelName);
            data.set("blackActivePrice", Number(this.form.blackActivePrice));
            // data.set(
            //   "platinumActivePrice",
            //   Number(this.form.platinumActivePrice)
            // );
            // data.set("silverActivePrice", Number(this.form.silverActivePrice));
            data.set("divideInto", this.form.divideInto);
            data.set("baseMap", this.form.baseMap);
            data.save().then(
              (data) => {
                this.$Message.success("保存成功");
                this.isAddChannel = false;
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
      var query = new this.ParseServer.Query("ChannelManagement");
      query.get(this.Id).then((item) => {
        item.set("channelName", this.form.channelName);
        item.set("blackActivePrice", Number(this.form.blackActivePrice));
        // item.set("platinumActivePrice", Number(this.form.platinumActivePrice));
        // item.set("silverActivePrice", Number(this.form.silverActivePrice));
        item.set("divideInto", this.form.divideInto);
        item.set("baseMap", this.form.baseMap);
        item.save().then(
          (item) => {
            this.$Message.success("修改成功");
            this.isAddChannel = false;
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
    pagechange2(e) {
      this.isall = false;
      this.page2 = e;
      this.billList(this.page2);
    },

    page_list(page_index) {
      this.loading = true;
      let _this = this;
      let query1 = new this.ParseServer.Query("ChannelManagement");
      query1.contains("channelName", this.search_keyword);
      let query2 = new this.ParseServer.Query("ChannelManagement");
      if (this.search_start_date) {
        query2.greaterThan("createdAt", this.search_start_date);
      }
      let query3 = new this.ParseServer.Query("ChannelManagement");
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
                channelName: item.get("channelName"),
                blackActivePrice: item.get("blackActivePrice"),
                // platinumActivePrice: item.get("platinumActivePrice"),
                // silverActivePrice: item.get("silverActivePrice"),
                divideInto: item.get("divideInto"),
                TotalAmountCommission: item.get("TotalAmountCommission"),
                amountCommission: item.get("amountCommission"),
                promoteRegistrationPhone: item.get("promoteRegistrationPhone"),
                PromotionTime: item.get("PromotionTime"),
                // qsCode: item.get("qsCode"),
                baseMap: item.get("baseMap"),
                updatedAt: tool.dateFormat(
                  item.get("updatedAt"),
                  "yyyy-MM-dd HH:mm:ss"
                ),
              });
            });
          }

          this.loading = false;
        },
        (error) => {}
      );
    },

    billList(page_index) {
      this.loading = true;
      let _this = this;
      let query = new this.ParseServer.Query("RoyaltyBill");
      query.equalTo("parentId", this.parentId);
      query.descending("createdAt");
      query.count().then((count) => {
        _this.total2 = count;
      });
      if (!this.isall) {
        query.skip((this.page2 - 1) * this.pageSize);
        query.limit(this.pageSize);
      }
      query.find().then(
        (list) => {
          _this.datas2 = [];
          if (list && list.length > 0) {
            list.forEach((item) => {
              _this.datas2.push({
                id: item.id,
                memberType: item.get("memberType"),
                price: item.get("price"),
                commissionPrice: item.get("commissionPrice"),
                createdAt: tool.dateFormat(
                  item.get("createdAt"),
                  "yyyy-MM-dd HH:mm:ss"
                    
                ),
              });
            });
          }

          this.loading = false;
        },
        (error) => {}
      );
    },

    delete(id) {
      var query_deletes = new this.ParseServer.Query("ChannelManagement");
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
      this.$Modal.confirm({
        title: "删除提示",
        content: "<p>当前活动会被删除，确定要删除吗？</p>",
        onOk: () => {
          var query = new this.ParseServer.Query("ChannelManagement");
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

    //查看账单
    ExamineBill(row) {
      this.parentId = row.id;
      this.isLookBill = true;
      this.isAddChannel = false;
      this.billList();
    },

    //返回
    goback() {
      this.isAddChannel = false;
      this.isLookBill = false;
    },
    get_entity() {
      var query = new this.ParseServer.Query("ChannelManagement");
      query.get(this.Id).then((res) => {
        this.form.channelName = res.get("channelName");
        this.form.blackActivePrice = res.get("blackActivePrice");
        // this.form.platinumActivePrice = res.get("platinumActivePrice");
        // this.form.silverActivePrice = res.get("silverActivePrice");
        this.form.divideInto = res.get("divideInto");
        this.form.TotalAmountCommission = res.get("TotalAmountCommission");
        this.form.baseMap = res.get("baseMap");
      });
    },
    //导出账单
    exportBill() {
      for (const key in this.datas2) {
        if (this.datas2[key].memberType == 1) {
          this.datas2[key].memberTypeName = "黑金";
        }
        if (this.datas2[key].memberType == 2) {
          this.datas2[key].memberTypeName = "铂金";
        }
        if (this.datas2[key].memberType == 3) {
          this.datas2[key].memberTypeName = "白银";
        }
      }
      this.isall = true;
      setTimeout(() => {
        this.billList();
        const initColumn = [
          {
            title: "ID",
            dataIndex: "id",
            key: "id",
          },
          {
            title: "会员类型",
            dataIndex: "memberTypeName",
            key: "memberTypeName",
          },
          {
            title: "活动金额",
            dataIndex: "price",
            key: "price",
          },
          {
            title: "提成金额",
            dataIndex: "commissionPrice",
            key: "commissionPrice",
          },
          {
            title: "创建时间",
            dataIndex: "createdAt",
            key: "createdAt",
          },
        ];
        excelUtil.exportExcel(initColumn, this.datas2, "查看账单数据.xlsx");
      }, 1000);
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
.qrcode {
  display: inline-block;
  img {
    width: 336px;
    height: 220px;
  }
}
</style>
