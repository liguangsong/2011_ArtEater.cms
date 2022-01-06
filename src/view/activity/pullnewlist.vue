<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix" style="display: flex">
      <div class="search-wrap clear-fix" style="flex: 1">
        <div class="search-keyword" style="width: 230px">
          <Input
            v-model="search_keyword"
            size="large"
            placeholder="会员昵称/手机号关键字搜索"
            style="width: 200px"
          />
        </div>
        <div
          class="select-choice clear-fix"
          style="display: flex; align-items: center"
        >
          <div style="display: flex">
            <span style="width: 100px; padding: 0">是否处理:</span>
            <Select
              size="large"
              v-model="search_type"
              class="choice"
              placeholder="全部"
              :clearable="true"
              style="width: 80px; margin-left: 20px"
            >
              <Option :value="1" :key="1">是</Option>
              <Option :value="2" :key="2">否</Option>
            </Select>
          </div>
          <div class="search-btn" style="width: 150px">
            <Button type="primary" class="search-btn" @click="search"
              >搜索</Button
            >
          </div>
        </div>
      </div>
    </div>
    <Row class="table-wrap">
      <Table :loading="loading" :columns="columns" :data="datas">
        <template slot-scope="{ row }" slot="isDispose">
          <i-switch
            v-model="row.isDispose"
            @on-change="changeDispose(row)"
            size="large"
          />
        </template>
        <template slot-scope="{ row }" slot="memberType">
          <span v-if="row.memberType == '1'">黑金</span>
          <span v-if="row.memberType == '2'">铂金</span>
          <span v-if="row.memberType == '3'">白银</span>
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
export default {
  name: "pullnewlist",
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      search_keyword: "",
      search_start_date: "",
      search_end_date: "",
      columns: [
        { title: "ID", key: "id" },
        { title: "姓名", key: "name" },
        { title: "会员昵称", key: "nickName" },
        { title: "手机号", key: "phone" },
        { title: "会员类型", key: "memberType", slot: "memberType" },
        { title: "拉新人数", key: "buyUser" },
        { title: "黑金后拉新", key: "upgradeBuyArr" },
        { title: "是否处理", key: "isDispose", slot: "isDispose" },
        // { title: "创建时间", key: "createdAt" },
      ],
      datas: [],
      search_type: "",
      form: {
        nickName: "",
        phone: "",
        memberType: "",
        isDispose: false,
      },
      Id: "",
      ruleValidate: {},
      loading: true,
    };
  },
  mounted() {
    this.init_data = JSON.stringify(this.form);
    this.page_list(this.page);
  },
  methods: {
    //是否处理
    changeDispose(data) {
      this.form.isDispose = data.isDispose;
      this.Id = data.id;
      this.updateds();
    },

    // 修改是否使用
    updateds() {
      var query = new this.ParseServer.Query("PullNew");
      query.get(this.Id).then((item) => {
        item.set("isDispose", this.form.isDispose);
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
    search() {
      this.page = 1;
      this.page_list(this.page);
    },
    pagechange(e) {
      this.page = e;
      this.page_list();
    },

    page_list(page_index) {
      this.loading = true;
      let _this = this;
      let query1 = new this.ParseServer.Query("PullNew");
      query1.contains("nickName", this.search_keyword);
      let query2 = new this.ParseServer.Query("PullNew");
      query2.contains("phone", this.search_keyword);
      let query3 = new this.ParseServer.Query("PullNew");
      if (this.search_type) {
        let type;
        this.search_type == 1 ? (type = true) : (type = false);
        query3.equalTo("isDispose", type);
      }
      let q = this.ParseServer.Query.or(query1,query2)
      var query = this.ParseServer.Query.and(q, query3);
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
                nickName: item.get("nickName"),
                phone: item.get("phone"),
                memberType: item.get("memberType"),
                // buyNum: item.get("buyNum"),
                buyUser: item.get("buyUser") ? item.get("buyUser").length : 0,
                silverActivePrice: item.get("silverActivePrice"),
                upgradeBuyArr: item.get("upgradeBuyArr")
                  ? item.get("upgradeBuyArr").length
                  : 0,
                isDispose: item.get("isDispose"),
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
  },
};
</script>

<style lang="less" scoped>
.search-wrap {
  float: left;
  width: 60%;
  .label-split {
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
    // float: left;
    // width: 35%;
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
