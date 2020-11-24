<template>
  <div>
    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
      <FormItem prop="userName">
        <Input v-model="form.userName" placeholder="请输入用户名" />
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="form.password" placeholder="请输入密码" />
      </FormItem>
      <!-- <FormItem>
          <CheckboxGroup @on-change="RememberPd">
              <Checkbox v-model="form.checkbox"  label="记住密码"></Checkbox>
          </CheckboxGroup>
          <span class="forget" @click="modal1 = true">忘记密码</span>
      </FormItem> -->
      <FormItem>
          <Button type="primary" style="width:100%;" @click="handleSubmit" long>登录</Button>
          <!-- <Button type="default" class="ivu-btn-sign" @click="register">注册</Button> -->
      </FormItem>
    </Form>
    <!--忘记密码弹窗-->
    <Modal
        v-model="modal1"
        title="找回密码"
        @on-ok="ResetPassword"
        class-name="vertical-center-modal"
        ok-text="提交"
        cancel-text="">
        <Form :model="formItem" :label-width="60">
        <FormItem label="手机号">
          <Input v-model="formItem.tel" placeholder="请输入手机号" />
        </FormItem>
        <FormItem label="验证码">
          <Row>
            <Col span="18">
              <Input type="text" v-model="formItem.code" placeholder="请输入验证码" />
            </Col>
            <Col span="4" offset="1">
              <Button @click="sendCode" class="send"><b v-if="formItem.show">发送验证码</b><b v-if="!formItem.show" class="codeTime">{{formItem.count}}s后重发</b></Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="新密码">
          <Input v-model="formItem.newpd" />
        </FormItem>
        <FormItem label="确认密码">
          <Input v-model="formItem.confirmpd" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
// import { getYZMCode } from '@/api/user'
// import { urlConfig } from '@/api/urlconfig'
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        userName: '',
        password: '',
        checkbox: false,
        select: ''
      },
      formItem: {
        tel: '',
        coed: '',
        newpd: '',
        confirmpd: '',
        count: '',
        timer: null,
        show: true
      },
      modal1: false
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules
      }
    }
  },
  mounted () {
    let userInfo = JSON.parse(localStorage.getItem('UserInfo'))
    if (userInfo) {
      this.form.userName = userInfo.name
      this.form.password = userInfo.password
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password
          })
        }
      })
    },
    // 根据手机号找回密码
    ResetPassword () {
    },
    // 发短信验证码
    sendCode () {
      // getYZMCode(this.formItem.tel).then(res => {
      //   if (res.data.Status) {
      //     const TIME_COUNT = 120
      //     if (!this.formItem.timer) {
      //       this.formItem.count = TIME_COUNT
      //       this.formItem.show = false
      //       this.formItem.timer = setInterval(() => {
      //         if (this.formItem.count > 0 && this.formItem.count <= TIME_COUNT) {
      //           this.formItem.count--
      //         } else {
      //           this.formItem.show = true
      //           clearInterval(this.formItem.timer)
      //           this.formItem.timer = null
      //         }
      //       }, 1000)
      //     }
      //   }
      // })
    },
    // 企业注册
    register () {
      this.$router.push({
        path: '/register'
      })
    },
    // 记住密码
    RememberPd () {
      if (this.form.checkbox) {
        if (this.form.userName && this.form.password) {
          let otadatainfo = {name: this.form.userName, password: this.form.password}
          localStorage.setItem('UserInfo', JSON.stringify(otadatainfo))
        } else {
          this.$Modal.confirm({
            title: '系统提示',
            content: '<p>填写账号密码后可操作</p>'
          })
          this.form.checkbox = false
        }
      } else {
        localStorage.removeItem('UserInfo')
      }
    }
  }
}
</script>
<style  lang="less">

    .ivu-col-offset-1{margin-left: 1.166667%;}
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;
        .ivu-modal{
            top: 0;
        }
        .ivu-modal-footer .ivu-btn{width: 146px;height: 50px;font-size: 18px;}
        .ivu-modal-footer .ivu-btn:first-child{
          display: none;
        }
        .ivu-modal-footer .ivu-btn:last-child{
          margin: 0 auto;display: block;
        }
        .ivu-form-item-content{
          line-height: 50px;
        }
        .ivu-input{height: 50px;}
        .ivu-form .ivu-form-item-label{
          line-height: 50px;padding: 0 10px 0 0 ;color: #333;
        }
        .send{height: 50px;}
    }
    .ivu-modal{
      .ivu-modal-body{
          padding: 38px;
      }
    }
    .codeTime{color: red;}
</style>
