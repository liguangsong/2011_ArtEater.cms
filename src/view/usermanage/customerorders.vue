<template>
  <div class="container-wrap">
    <div class="header-wrap">
      <div class="search-wrap clear-fix">
        <div class="search-keyword" style="width: 200px">
          <Input
            v-model="search_keyword"
            size="large"
            style="width: 200px"
            placeholder="请输入订单内容关键字"
          />
        </div>
        <div class="select-choice clear-fix" style="width: 500px">
          <span>注册时间</span>
          <div class="date-picker-wrap clear-fix" style="width: 400px">
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
        <div class="search-btn">
          <Button type="primary" @click="search" size="large">查询</Button>
        </div>
        <Button type="info" @click="exports">全部导出</Button>
      </div>
    </div>
    <Row class="table-wrap">
      <Table :loading="loading" :columns="columns" :data="datas">
        <!-- <template slot-scope="{ row }" slot="memberType">
          <span v-if="row.memberType == '0'">黑金会员</span>
          <span v-if="row.memberType == '1'">铂金会员</span>
          <span v-if="row.memberType == '2'">白银会员</span>
        </template> -->
      </Table>
      <div class="page-wrap">
        <Page
          :total="total"
          :page="page"
          @on-change="pagechange"
          v-if="total > 0"
        />
      </div>
    </Row>
  </div>
</template>

<script>
import { tool } from "@/api/tool";
import excelUtil from "../../utils/dealwithExcelUtil";
export default {
  name: "studentindex",
  data() {
    return {
      page: 1,
      pages: 1,
      total: 0,
      totals: 0,
      openIds: [],
      user_datas: [],
      orders: [],
      flag: 1,
      loading: true,
      search_keyword: "",
      search_start_date: "",
      search_end_date: "",
      datas: [],
      datas2: [],
      columns: [
        { title: "订单号", key: "orderNo" },
        { title: "ID", key: "id" },
        { title: "昵称", key: "nickName" },
        { title: "姓名", key: "realName" },
        { title: "手机号", key: "phone" },
        { title: "订单内容", key: "subjectName" },
        { title: "消费金额", key: "cash" },
           { title: "原价", key: "price" },
        // { title: "课程内容", key: "subjectName" },
        {
          title: "购买时间",
          key: "createdAt",
        },

        // {
        //   title: "操作",
        //   key: "action",
        //   align: "center",
        //   slot: "action",
        // },
      ],
    };
  },
  mounted() {
    this.customerOrders(this.page);
  },
  methods: {
    search() {
      this.flag = 1;
      this.page = 1;
      this.customerOrders(this.page);
    },

    pagechange(e) {
      this.flag = 1;
      this.page = e;
      this.customerOrders();
    },

    async page_list(page_index) {
      let counts = 0;
      this.loading = true;
      this.user_datas = [];
      let query = new this.ParseServer.Query(this.ParseServer.User);
      query.containedIn("openid", this.openIds);
      query.descending("createdAt");
      await query.count().then((count) => {
        counts = count;
      });
      query.limit(counts);
      query.find().then(
        (list) => {
          if (list && list.length > 0) {
            list.map((item) => {
              this.user_datas.push({
                openId: item.get("openid"),
                memberType: item.get("memberType"),
                realName: item.get("realname"),
                nickName: item.get("nickName"),
                phone: item.get("phone"),
              });
            });
            for (const i in this.orders) {
              for (const j in this.user_datas) {
                if (this.orders[i].openId == this.user_datas[j].openId) {
                  if (this.flag == 1) {
                    this.datas.push({
                      ...this.orders[i],
                      ...this.user_datas[j],
                    });
                  } else {
                    this.datas2.push({
                      ...this.orders[i],
                      ...this.user_datas[j],
                    });
                  }
                }
              }
            }
          }
          this.loading = false;
        },
        (error) => {
          this.$Message.error("列表获取失败");
        }
      );
    },

    //查询用户消费订单
    customerOrders() {
      this.orders = [];
      this.openIds = [];
      let query = new this.ParseServer.Query("Order");
      query.contains("subjectName", this.search_keyword);
      if (this.search_start_date) {
        query.greaterThan("createdAt", this.search_start_date);
      }
      if (this.search_end_date) {
        query.lessThan("createdAt", tool.addDays(this.search_end_date, 1));
      }
      query.count().then((count) => {
        if (this.flag == 1) {
          this.total = count;
        }
      });
      query.descending("createdAt");
      if (this.flag == 1) {
        this.datas = [];
        query.skip((this.page - 1) * 10);
        query.limit(10);
      } else {
        this.datas2 = [];
        query.limit(this.total);
      }
      query.find().then(
        (list) => {
          if (list && list.length > 0) {
            list.map((item) => {
              this.openIds.push(item.get("openId"));
              this.orders.push({
                id: item.id,
                openId: item.get("openId"),
                orderNo: item.get("orderNo"),
                subjectName: item.get("subjectName"),
                cash: item.get("cash"),
                price: item.get("price"),
                createdAt: tool.dateFormat(
                  item.get("createdAt"),
                  "yyyy-MM-dd HH:mm:ss"
                ),
              });
            });
            this.openIds = [...new Set(this.openIds)];
            this.page_list();
          } else {
            this.datas = [];
            this.datas2 = [];
          }
          this.loading = false;
        },
        (error) => {
          this.$Message.error("列表获取失败");
        }
      );
    },

    //导出
    exports() {
      this.flag = 2;
      this.customerOrders();
      setTimeout(() => {
        if (this.datas2.length <= 0) return;
        const initColumn = [
          {
            title: "ID",
            dataIndex: "id",
            key: "id",
          },
          {
            title: "昵称",
            dataIndex: "nickName",
            key: "nickName",
          },
          {
            title: "姓名",
            dataIndex: "realName",
            key: "realName",
          },
          {
            title: "手机号",
            dataIndex: "phone",
            key: "phone",
          },
          {
            title: "订单内容",
            dataIndex: "subjectName",
            key: "subjectName",
          },
          {
            title: "消费金额",
            dataIndex: "cash",
            key: "cash",
          },
          {
            title: "原价",
            dataIndex: "price",
            key: "price",
          },
          {
            title: "订单号",
            dataIndex: "orderNo",
            key: "orderNo",
          },
          {
            title: "购买时间",
            dataIndex: "createdAt",
            key: "createdAt",
          },
        ];
        excelUtil.exportExcel(initColumn, this.datas2, "用户订单数据.xlsx");
      }, 2000);
    },
  },
};
</script>

<style lang="less" scoped>
.search-wrap {
  .search-keyword {
    float: left;
    width: 20%;
  }
  .select-choice {
    float: left;
    width: 40%;
    span {
      width: 20%;
      display: block;
      float: left;
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
    width: 10%;
    margin: 0 20px;
  }
}

.date-picker-wrap {
  float: left;
  width: 80%;
  .date-picker {
    float: left;
    width: 45%;
  }
  .label-split {
    // margin: 0 10px;
    padding: 0 10px;
    width: 10%;
    box-sizing: border-box;
    display: block;
    float: left;
    text-align: center;
  }
}
.form .myFormShow {
  min-height: 30px;
  line-height: 30px;
  display: flex;
}

.myFormShow .head {
  width: 230px;
  text-align: right;
  font-size: 14px;
  font-weight: bold;
  padding-right: 10px;
  display: inline-block;
  vertical-align: middle;
}
.myFormShow .cont {
  flex: 1;
  text-align: left;
  font-size: 14px;
  padding-left: 10px;
}
.form .myFormShow:first-child .head {
  line-height: 50px;
}
</style>
