<template>
  <div class="container-wrap">
    <div class="header-wrap">
      <Row>
        <Col span="12">
          <div class="search-wrap clear-fix">
            <div class="search-keyword" style="width:200px">
              <Input v-model="search_keyword" size="large" placeholder="请输入ID/用户昵称/反馈内容" style="width:200px" />
            </div>
            <div class="search-btn">
              <Button type="primary" @click="search" size="large">查询</Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <Row class="table-wrap">
      <Table :loading="loading" :columns="columns" :data="message_datas">
      </Table>
      <div class="page-wrap">
        <Page :total="total" @on-change="pagechange" v-if="total != 0" />
      </div>
    </Row>
  </div>
</template>

<script>
import { tool } from '@/api/tool'
export default {
  name: "opinionindex",
  data() {
    return {
      page: 1,
      total: 0,
      loading: true,
      search_keyword: "",
      columns: [
        {
          title: "ID",
          key: "id"
        },
        {
          title: "会员",
          key: "nickName"
        },
        {
          title: "联系方式",
          key: "phone"
        },
        {
          title: "时间",
          key: "createdAt"
        },
        {
          title: "意见反馈",
          key: "content"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            var button = [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.delete(params.row.id);
                    }
                  }
                },
                "删除"
              )
            ];
            return h("div", button);
          }
        }
      ],
      message_datas: []
    };
  },
  mounted() {
    this.init_data = JSON.stringify(this.message_form);
    this.page_list(this.page);
  },
  methods: {
    /*
     *搜索数据
     *作者：gzt
     *时间：2020-11-21 23:30:19
     */
    search() {
      this.page = 1;
      this.page_list(this.page);
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
    page_list(page_index) {
      this.loading = true;
      
      let query1 = new this.ParseServer.Query("Opinions");
      query1.contains('objectId', this.search_keyword)
      let query2 = new this.ParseServer.Query("Opinions");
      query2.contains('nickName', this.search_keyword)
      let query3 = new this.ParseServer.Query("Opinions");
      query3.contains('content', this.search_keyword)
      var query = this.ParseServer.Query.or(query1, query2, query3);

      query.descending("createdAt");
      query.count().then(count => {
        this.total = count;
      });
      query.skip((this.page - 1) * 10);
      query.limit(10);

      query.find().then(
        list => {
          this.message_datas = [];
          if (list && list.length > 0) {
            this.message_datas = list.map(item => {
              var message = {
                id: item.id,
                nickName: item.get("nickName"),
                phone: item.get("phone"),
                createdAt: tool.dateFormat(item.get("createdAt"), 'yyyy-MM-dd HH:mm:ss'),
                content: item.get("content")
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

    /*
     * 删除反馈信息
     *作者：gzt
     *时间：2020-11-22 08:41:53
     */
    delete(opinion_id) {
      let _this = this;
      this.$Modal.confirm({
        title: "删除提示",
        content: "<p>删除信息后将无法恢复，确定要删除吗？</p>",
        onOk: () => {
          var query = new this.ParseServer.Query("Opinions");
          query.get(opinion_id).then(
            response => {
              response.destroy().then(
                delete_result => {
                  this.$Message.success("删除成功");
                  this.page = 1
                  this.page_list(this.page);
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
      float: right;
    }
  }
  .search-btn {
    float: left;
    width: 18%;
    margin: 0 20px;
  }
}
</style>
