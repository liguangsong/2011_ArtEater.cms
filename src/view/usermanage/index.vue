<template>
  <div class="container-wrap">
    <div class="header-wrap clear-fix">
      <div class="search-wrap clear-fix">
        <div class="search-keyword" style="width:210px">
          <Input v-model="search_keyword" size="large" style="width:200px" placeholder="姓名 手机号关键字搜索" />
        </div>
        <div class="select-choice clear-fix" style="width:250px">
          <span style="width:50px">身份</span>
          <Select size="large" v-model="search_role" class="choice" :clearable="true" placeholder="请选择身份" style="width:200px">
            <Option v-for="item in roles" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="search-btn" style="width:100px">
          <Button type="primary" @click="search" size="large">查询</Button>
        </div>
      </div>
      <div class="operation-wrap">
        <Button class="func" type="primary" @click="handleShowAddForm">新增后台账号</Button>
      </div>
    </div>
    <Row class="table-wrap">
      <Table :loading="loading" :columns="columns" :data="users_datas"></Table>
      <div class="page-wrap">
        <Page :total="total" @on-change="page_list" v-if="total != 0" />
      </div>
    </Row>
    <Modal
      v-model="show_window"
      :title="window_title"
      :mask-closable="close"
      :loading="modalLoading"
      @on-ok="add_user"
    >
      <Form
        :model="user_forms"
        label-position="right"
        :label-width="60"
        ref="form"
        :rules="ruleValidate"
      >
        <FormItem label="姓名" prop="realname">
          <Input v-model="user_forms.realname" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="手机号" prop="phone">
          <Input v-model="user_forms.phone" placeholder="请输入手机号"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="password" v-model="user_forms.password" placeholder="请输入密码"></Input>
        </FormItem>
        <FormItem label="身份" prop="role">
          <Select v-model="user_forms.role" placeholder="请选择身份">
            <Option v-for="item in roles" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { verification } from "@/api/verification";
import { tool } from '@/api/tool'
export default {
  name: "usermanageindex",
  data () {
    return {
      close: true,
      RoleACLs:[],
      roles: [
        { value: "teacher", label: "老师"},
        { value: "admin", label: "管理" }
      ],
      page: 1,
      pageSize:10,
      total: 0,
      loading: true,
      modalLoading: true,
      user_id: "",
      window_title: "新增用户",
      see: false,
      show_window: false,
      search_keyword: "",
      search_role: "",
      columns: [
        { title: "姓名", key: "realname" },
        { title: "手机号", key: "phone" },
        { title: "身份", key: "role",
          render:(h, params)=>{
            var txt = params.row.role=='admin'?'管理':( params.row.role == 'teacher'?'老师':'学生')
            return h('div', txt)
          }
        },
        { title: "注册时间", key: "createdAt",sortable: true,
            render:(h, params)=>{
              var txt = tool.dateFormat(params.row.createdAt, 'yyyy-MM-dd HH:mm:ss')
              return h('div', txt)
            } 
        },
        { title: "操作", key: "action", align: "center",
          render: (h, params) => {
            var button = [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      let role = this.ParseServer.User.current().get('role')
                      if(role=='admin'){
                        this.user_id = params.row.id;
                        this.get_entity();
                        this.show_window = true;
                        this.window_title = "后台账号信息";
                      } else {
                        this.$Message.error('您没有编辑的权限')
                      }
                    }
                  }
                },
                "编辑"
              ),
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
      users_datas: [],
      user_forms: {
        id:'',
        realname: "",
        phone: "",
        role: "",
        password:''
      },
      ruleValidate: {
        realname: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
            validator: verification.validateIsNull
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
            validator: verification.validateIsNull
          },
          {
            required: true,
            message: "请输入正确的手机号",
            trigger: "blur",
            validator: verification.validatePhone
          }
        ],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}, {validator: verification.validatePass, trigger: 'blur'}],
        role: [
          {
            required: true,
            trigger: "change",
            validator: (rule, value, callback) => {
              if (value == "请选择身份") {
                callback(new Error("请选择身份"));
              } else {
                callback();
              }
            }
          },
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value == "请选择身份") {
                callback(new Error("请选择身份"));
              } else {
                callback();
              }
            }
          }
        ]
      },
      init_data: ""
    };
  },
  mounted () {
    this.page_list(this.page);
  },
  methods: {
    /** 新增 */
    handleShowAddForm(){
      this.show_window = true
      this.user_forms = {
        id: '',
        realname: "",
        phone: "",
        role: ""
      }
    },
    /*
     *新增用户
     *作者：gzt
     *时间：2020-11-22 14:50:34
     */
    add_user () {
      var self = this
      this.$refs["form"].validate(valid => {
        if (!valid) {
          self.$Message.error('请检查表单项')
          self.modalLoading = false
          setTimeout(() => {
              self.modalLoading = true
          }, 100)
          return false
        } else {
          if(!self.user_forms.id) { // 需要注册
            var user = new self.ParseServer.User();
            user.set("username", self.user_forms.phone);
            user.set("password", self.user_forms.password);
            user.set("realname", self.user_forms.realname);
            user.set("phone", self.user_forms.phone);
            user.set("role", self.user_forms.role);
            user.signUp().then((ruser)=> {
              var postACL = new self.ParseServer.ACL();
              postACL.setRoleWriteAccess("admin", true);
              postACL.setPublicReadAccess(true);
              ruser.setACL(postACL);
              ruser.save()
              var role = self.RoleACLs.find(t=>{
                return t.get('name') === self.user_forms.role
              })
              role.getUsers().add(user);
              role.save()
              self.page_list(self.page)
              this.$Message.success("新增成功");
              self.show_window = false
            },(error)=> {
              self.show_window = false
              console.log("Error: " + error.code + " " + error.message);
              this.$Message.error("新增失败，请确保手机号未在后台注册过");
            });
          } else {
            var query = new this.ParseServer.Query(this.ParseServer.User);
            query.get(this.user_id).then(user => {
              user.set('id',self.user_forms.id)
              user.set("realname", self.user_forms.realname);
              user.set("phone", self.user_forms.phone);
              user.set("role", self.user_forms.role);
              user.save().then(ruser=>{
                var role = self.RoleACLs.find(t=>{
                  return t.get('name') === self.user_forms.role
                })
                this.$Message.success("编辑成功");
                self.show_window = false
                role.getUsers().add(user);
                role.save()
                self.page_list(self.page)
              })
            })
          }
        }
      })
    },

    /*
     *获取用户
     *作者：gzt
     *时间：2020-11-22 09:21:48
     */
    get_entity () {
      var self = this
      var query = new this.ParseServer.Query(this.ParseServer.User);
      query.get(this.user_id).then(user => {
        self.user_forms = {
          id:user.id,
          realname: user.get('realname'),
          phone: user.get('phone'),
          role: user.get('role')
        }
      });
    },

    /*
     *搜索数据
     *作者：gzt
     *时间：2020-11-21 23:30:19
     */
    search () {
      this.page = 1;
      this.page_list(this.page);
    },
    /*
     *分页加载数据
     *作者：gzt
     *时间：2020-11-21 23:30:27
     */
    page_list (page_index) {
      this.loading = true;
      const role = this.ParseServer.Role;
      var roleQuery = new this.ParseServer.Query(role)
      roleQuery.find().then(res=>{
        this.RoleACLs = res
      })
      let user1 = new this.ParseServer.Query(this.ParseServer.User);
      user1.contains("realname", this.search_keyword);
      let user2 = new this.ParseServer.Query(this.ParseServer.User);
      user2.contains("phone", this.search_keyword);
      let user3 = new this.ParseServer.Query(this.ParseServer.User);
      if(this.search_role){
        user3.equalTo("role", this.search_role);
      } else {
        user3.containedIn('role', ['admin', 'teacher'])
      }
      var query = this.ParseServer.Query.and(
        this.ParseServer.Query.or(user1,user2),
        user3
      );
      
      query.count().then(count => {
        this.total = count;
      });
      query.descending('createdAt')
      query.skip((this.page - 1) * this.pageSize);
      query.limit(this.pageSize);
      query.find().then(list => {
        this.users_datas = [];
        if (list && list.length > 0) {
          this.users_datas = list.map(item => {
            var account = {
              id: item.id,
              realname: item.get("realname"),
              phone: item.get("phone"),
              role: item.get("role"),
              createdAt: item.get('createdAt')
            };
            return account;
          });
        }
        this.loading = false;
      },
      error => {
        console.log(error);
        this.$Message.error("保存失败");
      }
    );
  },

    /*
     * 删除用户
     *作者：gzt
     *时间：2020-11-22 08:41:53
     */
    delete (user_id) {
      let role = this.ParseServer.User.current().get('role')
      if(role=='admin'){
        let _this = this;
        this.$Modal.confirm({
          title: "删除提示",
          content: "<p>删除用户后，用户将无法使用系统，确定要删除吗？</p>",
          onOk: () => {
            var ObjectClass = _this.ParseServer.Object.extend("_User"); //.Query(_this.ParseServer.User);
            var query = new _this.ParseServer.Query(ObjectClass)
            query.get(user_id).then(
              user => {
                user.destroy().then(
                  delete_result => {
                    this.$Message.success("删除成功");
                    this.page_list(this.page);
                  },
                  error => {
                    console.log(error)
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
      } else {
        this.$Message.error('您没有删除的权限')
      }
    }
  }
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
      float: right;
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
  float: left;
  .func {
    float: right;
    margin-left: 10px;
  }
}
</style>
