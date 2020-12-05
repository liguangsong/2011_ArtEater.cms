<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator" />
      <span>&nbsp;{{userNamess}}</span>
      <Icon :size="iconSize" type="md-arrow-dropdown" style="color: #FFFFFF !important;"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="updatepwd">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal v-model='isShowUpdatePwd' mask title="修改密码" :loading='loading' ok-text="确认修改" @on-ok="handleUpdatePwd" width='450'>
        <div class="divDetail">
          <Form ref="form" :model="form" :label-width="100" :rules="ruleValidate">
            <FormItem label='新密码:' prop='NewPwd'>
              <Input v-model="form.NewPwd" placeholder="请输入新密码" type="password" password :maxlength="15" style="width:270px;" />
            </FormItem>
            <FormItem label='重复新密码:' prop='NewPwd1'>
              <Input v-model="form.NewPwd1" placeholder="请再次输入新密码"type="password" password :maxlength="15" style="width:270px;" />
            </FormItem>
          </Form>
        </div>
      </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import { verification } from '@/api/verification'
import { UpdateUserPwd } from '@/api/limit/userapi'
export default {
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    iconSize: {
      type: Number,
      default: 12
    },
    userNamess: {
      type: String,
      default: 'System'
    }
  },
  data () {
    return {
      isShowUpdatePwd: false,
      userName: 'BOSS',
      loading: true,
      form: {
        UserId: '',
        OldPwd: '',
        NewPwd: '',
        NewPwd1: ''
      },
      ruleValidate: {
        OldPwd: [{required: true, message: '请输入旧密码', trigger: 'blur'}],
        NewPwd: [{required: true, message: '请输入新密码', trigger: 'blur'}, {validator: verification.validatePass, trigger: 'blur'}],
        NewPwd1: [{required: true, message: '请输入新密码', trigger: 'blur'}, {validator: verification.validatePass1, trigger: 'blur'}],
      },
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.handleLogOut().then(() => {
            var userinfo = JSON.parse(sessionStorage.getItem('UserInfo'))
            if (userinfo != null) {
              sessionStorage.setItem('UserInfo', 'null')
            }
            this.$router.push('login')
          })
          break
        case 'updatepwd':
          this.form.OldPwd=''
          this.form.NewPwd=''
          this.form.NewPwd1=''
          this.isShowUpdatePwd = true
          break
      }
    },
    /** 修改密码 */
    handleUpdatePwd(){
      var self = this
      this.$refs['form'].validate(valid => {
        if (!valid) {
          // this.$Message.error('请填写的完整。')
          this.loading = false
          setTimeout(() => {
            this.loading = true
          }, 100)
          return false
        } else {
          var user = self.ParseServer.User.current()
          user.set('password',self.form.NewPwd)
          user.save().then(res=>{
            this.$Message.success('修改成功')
            self.isShowUpdatePwd = false
          },error=>{
            this.loading = false
            this.$Message.error(res.data.Message)
          })
        }
      })
    }
  }
}
</script>
