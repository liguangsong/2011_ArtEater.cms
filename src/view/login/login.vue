<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="logo-top-icon">
      <img src="../../assets/images/logo@4.png" class="icon"/>
      <span class="name">统一在线管理平台</span>
    </div>
    <div class="login-con">
      <Card icon="log-in" title="用户登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" :userType="userTypes"></login-form>
        </div>
      </Card>
    </div>
    <div class="footer">
      <p>西安爱儿派教育科技有限公司</p>
      <p>备案号：陕ICP备13005305号-3Copyright©2015-2017..All Rights Reserved</p>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  data () {
    return {
      userTypes: 'null',
      usertype: []
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    selectType (index) {
      this.userTypes = index
    },
    handleSubmit ({userName, password}) {
      sessionStorage.setItem('userType', this.userTypes)
      this.$Loading.finish()
          sessionStorage.setItem('UserInfo', JSON.stringify({token: "123131", Id: 1, userAccount: "admin", headIcon:"12131", realName:"管理员", loginName: "admin"}))
          this.$Message.success('登录成功跳转')
          this.$router.push({
            name: 'index'
          })
    }
  }
}
</script>
<style>
</style>
