<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix" style="display: flex">
      <div class="search-wrap clear-fix" style="flex: 1">
        <div class="search-keyword" style="width: 260px">
          <span style="width: 50px; padding: 0 5px">名称 </span>
          <Input
            v-model="search_keyword"
            size="large"
            placeholder="请输入轮播图名称"
            style="width: 200px"
          />
        </div>
        <div class="select-choice clear-fix" style="width: 170px">
          <span style="width: 50px; padding: 0 5px">状态 </span>
          <Select
            size="large"
            v-model="search_state"
            class="choice"
            placeholder="状态"
            :clearable="true"
            style="width: 100px"
          >
            <Option :value="-1" :key="-1">全部</Option>
            <Option :value="1" :key="1">已上架</Option>
            <Option :value="0" :key="0">已下架</Option>
          </Select>
        </div>
        <div class="search-btn" style="width: 100px; margin: 0">
          <Button type="primary" @click="search" size="large">查询</Button>
        </div>
      </div>
      <div class="operation-wrap" style="width: 175px">
        <Button
          style="margin-right: 10px"
          type="primary"
          @click="handleAddBanner"
          >添加</Button
        >
      </div>
    </div>
    <Row class="table-wrap">
      <Table :loading="loading" :columns="columns" :data="data">
        <template slot-scope="{ row }" slot="img">
          <div style="margin: 5px 0">
            <img
              v-if="row.img"
              :src="row.img"
              @click="handleShowImg(row)"
              width="84"
              height="38"
            />
          </div>
        </template>
        <template slot-scope="{ row }" slot="state">
          <span v-if="row.state == 0">已下架</span>
          <span v-if="row.state == 1">已上架</span>
        </template>
      </Table>
      <div class="page-wrap">
        <Page
          :total="total"
          :pageSize="pageSize"
          @on-change="pagechange"
          v-if="total != 0"
        />
      </div>
    </Row>
    <Modal
      v-model="show_window"
      :loading="editLoading"
      :title="window_title"
      mask
      scrollable
      width="600"
      @on-ok="add_Banner"
    >
      <Form
        v-if="show_window"
        :model="form"
        label-position="right"
        :label-width="100"
        ref="form"
        :rules="ruleValidate"
      >
        <FormItem label="轮播图名称" prop="title">
          <Input v-model="form.title" placeholder="请输入轮播图名称"></Input>
        </FormItem>
        <FormItem label="轮播图" prop="img">
          <div>
            <img v-if="form.img" :src="form.img" width="345" height="160" />
          </div>
          <myUpload
            @complate="handleUploadComplate"
            tips="（推荐尺寸690*320px）"
          ></myUpload>
        </FormItem>
        <FormItem label="链接" prop="src">
          <Input v-model="form.src" placeholder="请输入跳转链接"></Input>
        </FormItem>
        <FormItem label="排序" prop="sort">
          <Input v-model="form.sort" placeholder="请输入排序字段"></Input>
        </FormItem>
        <FormItem label="是否上架" prop="state">
          <i-switch
            v-model="form.state"
            :true-value="1"
            :false-value="0"
            size="large"
          >
            <span slot="open">上架</span>
            <span slot="close">下架</span>
          </i-switch>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input
            type="textarea"
            :rows="4"
            v-model="form.remark"
            placeholder="请输入备注"
          ></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal width="740" title="查看大图" v-model="isShowImg">
      <div style="margin: 5px 0; text-align: center">
        <img :src="currImg" width="690" height="320" />
      </div>
    </Modal>
    <Modal
      v-model="isShowDetail"
      title="查看轮播图详情"
      mask
      scrollable
      width="600"
    >
      <Form :model="form" label-position="right" :label-width="100" ref="form">
        <FormItem label="轮播图名称" prop="title">
          <span>{{ form.title }}</span>
        </FormItem>
        <FormItem label="轮播图" prop="img">
          <div>
            <img v-if="form.img" :src="form.img" width="345" height="160" />
          </div>
        </FormItem>
        <FormItem label="链接" prop="src">
          <span>{{ form.src }}</span>
        </FormItem>
        <FormItem label="排序" prop="sort">
          <span>{{ form.sort }}</span>
        </FormItem>
        <FormItem label="是否上架" prop="state">
          <span>{{ form.state == 0 ? "未上架" : "已上架" }}</span>
        </FormItem>
        <FormItem label="备注">
          <text>{{ form.remark }}</text>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { tool } from "@/api/tool";
import { verification } from "@/api/verification";
import myUpload from "@/components/myUpload";
export default {
  name: "messageindex",
  components: {
    myUpload,
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      editLoading: true,
      isShowImg: false,
      isShowDetail: false,
      currImg: "",
      message_id: "",
      window_title: "添加轮播图",
      show_window: false,
      search_keyword: "",
      search_state: -1,
      columns: [
        { title: "序号", type: "index", align: "center" },
        { title: "轮播图名称", key: "title" },
        { title: "图片", key: "img", slot: "img" },
        { title: "链接", key: "src", width: 300 },
        { title: "排序", key: "sort" },
        { title: "状态", key: "state", slot: "state" },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            var button = [
              h(
                "Button",
                {
                  props: { type: "info", size: "small" },
                  style: { marginRight: "5px" },
                  on: {
                    click: () => {
                      this.form.id = params.row.id;
                      this.get_entity();
                      this.isShowDetail = true;
                      this.window_title = "查看";
                    },
                  },
                },
                "查看"
              ),
              h(
                "Button",
                {
                  props: { type: "primary", size: "small" },
                  style: { marginRight: "5px" },
                  on: {
                    click: () => {
                      this.form.id = params.row.id;
                      this.get_entity();
                      this.show_window = true;
                      this.window_title = "编辑轮播图";
                    },
                  },
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: { type: "error", size: "small" },
                  style: { marginRight: "5px" },
                  on: {
                    click: () => {
                      this.delete(params.row);
                    },
                  },
                },
                "删除"
              ),
            ];
            return h("div", button);
          },
        },
      ],
      data: [],
      form: {
        id: "",
        title: "",
        img: "",
        src: "",
        sort: "",
        state: 0,
        remark: "",
      },
      ruleValidate: {
        title: [
          {
            required: true,
            message: "请输入轮播图名称",
            trigger: "blur",
            validator: verification.validateIsNull,
          },
        ],
        img: [
          {
            required: true,
            message: "请上传轮播图",
            trigger: "blur",
            validator: verification.validateIsNull,
          },
        ],
        // src: [{required: true, message: "请输入链接", trigger: "blur", validator: verification.validateIsNull}],
        // sort: [{required: true, message: "请输入排序", trigger: "blur", validator: verification.validateIsNull}],
      },
      init_data: "",
    };
  },
  mounted() {
    var self = this;
    // this.init_data = JSON.stringify(this.form);
    this.page_list();
  },
  methods: {
    /** 添加Banner图 */
    handleAddBanner() {
      (this.form = {
        id: "",
        title: "",
        img: "",
        src: "",
        sort: "",
        state: 0,
        remark: "",
      }),
        (this.show_window = true);
    },

    handleShowImg(row) {
      this.isShowImg = true;
      this.currImg = row.img;
    },
    /**
     * 图片上传完成
     */
    handleUploadComplate(urls) {
      this.form.img = urls;
    },

    /*
     *发布消息
     *作者：gzt
     *时间：2020-11-22 14:50:34
     */
    add_Banner() {
      var self = this;
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          self.$Message.error("请检查表单项");
          self.editLoading = false;
          setTimeout(() => {
            self.editLoading = true;
          }, 100);
          return false;
        } else {
          var Banners = this.ParseServer.Object.extend("Banner");
          var Banner = new Banners();
          if (this.form.id) {
            Banner.set("id", this.form.id);
          }
          Banner.set("title", this.form.title);
          Banner.set("img", this.form.img);
          Banner.set("src", this.form.src);
          Banner.set("sort", this.form.sort);
          Banner.set("state", this.form.state);
          Banner.set("remark", this.form.remark);
          Banner.save().then(
            (response) => {
              this.$Message.success("保存成功");
              this.show_window = false;
              this.page_list();
            },
            (error) => {
              debugger;
              this.$Message.error("保存失败");
            }
          );
        }
      });
    },

    /*
     *获取消息
     *作者：gzt
     *时间：2020-11-22 09:21:48
     */
    get_entity() {
      var query = new this.ParseServer.Query("Banner");
      query.get(this.form.id).then((res) => {
        this.form.id = res.id;
        this.form.title = res.get("title");
        this.form.img = res.get("img");
        this.form.src = res.get("src");
        this.form.sort = res.get("sort");
        this.form.state = res.get("state");
        this.form.remark = res.get("remark");
      });
    },

    /*
     *搜索数据
     *作者：gzt
     *时间：2020-11-21 23:30:19
     */
    search() {
      this.page = 1;
      this.page_list();
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
    page_list() {
      var self = this;
      this.loading = true;
      let query1 = new this.ParseServer.Query("Banner");
      query1.contains("title", this.search_keyword);
      let query2 = new this.ParseServer.Query("Banner");
      if (this.search_state == -1) {
        query2.notEqualTo("state", -1);
      } else {
        query2.equalTo("state", this.search_state);
      }
      var query = this.ParseServer.Query.and(query1, query2);
      query.ascending("sort");
      query.count().then((count) => {
        self.total = count;
      });
      query.skip((this.page - 1) * this.pageSize);
      query.limit(this.pageSize);
      query.find().then(
        (list) => {
          this.data = [];
          if (list && list.length > 0) {
            this.data = list.map((item) => {
              var _data = {
                id: item.id,
                title: item.get("title"),
                img: item.get("img"),
                src: item.get("src"),
                sort: item.get("sort"),
                state: item.get("state"),
                remark: item.get("remark"),
                createdAt: item.get("createdAt"),
                updatedAt: tool.dateFormat(
                  item.get("updatedAt"),
                  "yyyy-MM-dd HH:mm:ss"
                ),
              };
              return _data;
            });
          }
          this.loading = false;
        },
        (error) => {
          this.$Message.error("获取失败");
        }
      );
    },

    /*
     * 删除消息
     *作者：gzt
     *时间：2020-11-22 08:41:53
     */
    delete(row) {
      if (row.state == 1) {
        this.$Message.error("请先下架");
        return false;
      }
      let _this = this;
      this.$Modal.confirm({
        title: "删除提示",
        content: "<p>删除消息后将无法恢复，确定要删除吗？</p>",
        onOk: () => {
          var query = new this.ParseServer.Query("Banner");
          query.get(row.id).then(
            (response) => {
              response.destroy().then(
                (delete_result) => {
                  this.$Message.success("删除成功");
                  this.page = 1;
                  this.page_list();
                },
                (error) => {
                  this.$Message.error("删除失败");
                }
              );
            },
            (error) => {
              this.$Message.error("请确保删除的数据真实存在");
            }
          );
        },
        onCancel: () => {
          this.$Message.info("取消了操作");
        },
      });
    },
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
</style>
