<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="logo-top-icon">
      <img src="../../assets/images/logo@4.png" class="icon" />
      <span class="name">统一在线管理平台</span>
    </div>
    <div class="login-con">
      <Card icon="log-in" title="用户登录" :bordered="false">
        <div class="form-con">
          <login-form
            @on-success-valid="handleSubmit"
            :userType="userTypes"
          ></login-form>
        </div>
      </Card>
    </div>
    <div class="footer">
      <!-- <p>西安爱儿派教育科技有限公司</p>
      <p>备案号：陕ICP备13005305号-3Copyright©2015-2017..All Rights Reserved</p> -->
    </div>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";
export default {
  components: {
    LoginForm
  },
  data() {
    return {
      userTypes: "null",
      usertype: []
    };
  },
  methods: {
    ...mapActions(["handleLogin", "getUserInfo"]),
    selectType(index) {
      this.userTypes = index;
    },
    handleSubmit({ userName, password }) {
      sessionStorage.setItem("userType", this.userTypes);
      this.$Loading.finish();

      this.ParseServer.User.logIn(userName, password).then(
        user => {
          // sessionStorage.setItem('UserInfo', JSON.stringify(user))
          // var Post = this.ParseServer.Object.extend("UserInfo");
          // var publicPost = new Post();
          // var postACL = new this.ParseServer.ACL(this.ParseServer.User.current());
          // postACL.setPublicWriteAccess(true);
          // publicPost.setACL(postACL);
          // publicPost.save().then(t=>{
          //   debugger
          // },(e)=>{
          //   debugger
          // })
          sessionStorage.setItem(
            "UserInfo",
            JSON.stringify({
              token: user.get("sessionToken"),
              Id: user.id,
              userAccount: user.get("username"),
              headIcon: "",
              realName: user.get("realname"),
              loginName: user.get("username")
            })
          );
          this.$Message.success("登录成功跳转");
          this.$nextTick(() => {
            this.$router.push({
              name: "index"
            });
          });
        },
        (user, error) => {
          this.$Message.error("登录失败，请检查您的用户名密码");
        }
      );
      // sessionStorage.setItem('UserInfo', JSON.stringify({token: "123131", Id: 1, userAccount: "admin", headIcon:"12131", realName:"管理员", loginName: "admin"}))
    }
  }
};
</script>
<style></style>
