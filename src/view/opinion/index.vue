<template>
  <div class="container-wrap">
    <div class="header-wrap">
      <Row>
        <Col span="20">
          <div class="search-wrap clear-fix">
            <div class="search-keyword">
              <Input
                v-model="search_keyword"
                size="large"
                placeholder="ID 主题关键字搜索"
              />
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
        <Page :total="total" @on-change="page_list" v-if="total != 0" />
      </div>
    </Row>
  </div>
</template>

<script>
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
          title: "会员",
          key: "nick_name"
        },
        {
          title: "联系方式",
          key: "phone"
        },
        {
          title: "时间",
          key: "create_date"
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
    /*
     *分页加载数据
     *作者：gzt
     *时间：2020-11-21 23:30:27
     */
    page_list(page_index) {
      this.loading = true;
      let query = new this.ParseServer.Query("Opinions");
      query.descending("createdAt");
      if (this.search_keyword) {
        query.startWith("content", this.search_keyword);
      }
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
                nick_name: item.get("nick_name"),
                phone: item.get("phone"),
                create_date: item.get("create_date"),
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
    width: 20%;
    margin: 0 20px;
    button {
      width: 70%;
    }
  }
}
</style>
