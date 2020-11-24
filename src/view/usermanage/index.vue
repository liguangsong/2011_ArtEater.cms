<template>
    <div class="container-wrap">
        <Row>
        <Col span="6"><Input v-model="search_keyword" size="large" placeholder="请输入用户名" style="width: 400px" /><Button type="primary" class="search-btn" @click="search">搜索</Button></Col>
        <Col span="18">
            <div class="operation-wrap">
                <Button type="success" @click="show_window=true">新增用户</Button>
            </div>
        </Col>
        </Row>
        <Row class="table-wrap">
             <Table  :loading="loading" :columns="columns" :data="users_datas">
             </Table>
             <div class="page-wrap">
             <Page :total="total" @on-change="page_list"  v-if="total!=0" />
             </div>
        </Row>
        <Modal v-model="show_window"
        :title="window_title"
        @on-ok="add_user"
        @on-cancel="cancel">

        <Form :model="user_forms" label-position="right" :label-width="60">
        <FormItem label="头像">
            <Avatar icon="ios-person" size="large" v-if="user_forms.avatarUrl!=''" />
             <Avatar v-else :src="user_forms.avatarUrl" size="large" />
        </FormItem>
        <FormItem label="昵称">
            <Input v-model="user_forms.nickName" placeholder="请输入用户昵称"></Input>
        </FormItem>
        <FormItem label="姓名">
            <Input v-model="user_forms.realname" placeholder="请输入姓名"></Input>
        </FormItem>
          <FormItem label="手机号">
            <Input v-model="user_forms.phone" placeholder="请输入手机号"></Input>
        </FormItem>
         <FormItem label="身份">
           <RadioGroup v-model="user_forms.role">
                <Radio label="老师">老师</Radio>
                <Radio label="学生">学生</Radio>
                <Radio label="管理">管理</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="消费金额" v-if="see">
            <Input v-model="user_forms.amount" disabled></Input>
        </FormItem>
        <FormItem label="积分" v-if="see">
            <Input v-model="user_forms.score" disabled></Input>
        </FormItem>
        <FormItem label="报考专业">
            <Input v-model="user_forms.speciality" placeholder="请输入报告专业"></Input>
        </FormItem>
        <FormItem label="目标院校">
            <Input v-model="user_forms.university" placeholder="请输入目标院校"></Input>
        </FormItem>
          <FormItem label="所在区域">
            <Input v-model="user_forms.proviceName" placeholder="请输入所在区域"></Input>
        </FormItem>
    </Form>
    </Modal>
    </div>
</template> 

<script>

export default {
    name: "usermanageindex",
    data() {
        return {
            page:1,
            total:0,
            loading: true,
            user_id:"",
            window_title:"新增用户",
            see:false,
            show_window:false,
            search_keyword:'',
             columns: [
                    {
                        title: '昵称',
                        key: 'nickName'
                    },
                    {
                        title: '姓名',
                        key: 'realname'
                    },
                    {
                        title: "手机号",
                        key: 'phone'
                    },
                    {
                        title: "用户身份",
                        key: 'role'
                    },
                     {
                        title: "消费金额",
                        key: 'amount'
                    },
                     {
                        title: "积分",
                        key: 'score'
                    },
                     {
                        title: "注册时间",
                        key: 'registration_time'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            var button=[
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {

                                           this.user_id=params.row.id
                                           this.get_entity()
                                            this.show_window=true
                                            this.window_title="修改用户"
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.user_id=params.row.id
                                            this.show_window=true
                                            this.see=true
                                            this.get_entity()
                                            this.window_title="查看用户"
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                     style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.delete(params.row.id)
                                        }
                                    }
                                }, '删除')
                            ]
                            return h('div', button);
                        }
                    }
                ],
            users_datas: [],
            user_forms:{
                nickName:"",
                realname:"",
                phone:"",
                role:"老师",
                amount:"",
                score:"",
                avatarUrl:"",
                speciality:"",
                university:"",
                proviceName:"",
                registration_time:""
            },
            init_data:""
        }
    },
      mounted() {
          this.init_data=JSON.stringify(this.user_forms)
        this.page_list(this.page)
    },
    methods: {
        
        /*
        *取消操作
        *作者：gzt
        *时间：2020-11-22 14:42:57
        */
        cancel(){
            this.show_window=false
            this.see=false
            this.window_title="新增用户"
            console.log(this.init_data)
            this.user_forms=JSON.parse(this.init_data)
        },
        
        /*
        *新增用户
        *作者：gzt
        *时间：2020-11-22 14:50:34
        */
        add_user(){
            var Accounts=this.ParseServer.Object.extend("Accounts")
            var account=new Accounts()
            if(this.user_id){
                account.set('id',this.user_id)
            }
            account.set('nickName',this.user_forms.nickName)
            account.set("realname",this.user_forms.realname)
            account.set("phone",this.user_forms.phone)
            account.set("role",this.user_forms.role)
            account.set("free",this.user_forms.free)
            account.set("speciality",this.user_forms.speciality)
            account.set("university",this.user_forms.university)
            account.set("proviceName",this.user_forms.proviceName)
            account.set("registration_time",this.user_forms.registration_time)
            account.save().then((account)=>{
                this.$Message.success('保存成功')
                this.user_forms=JSON.parse(this.init_data)
                this.page_list(this.page)
            },(error)=>{
                this.$Message.error('保存失败')
            })
        },


         /*
        *获取用户
        *作者：gzt
        *时间：2020-11-22 09:21:48
        */
        get_entity(){
            var query = new this.ParseServer.Query("Accounts")
            console.log(this.user_id)
            query.get(this.user_id).then((response)=>{
                Object.keys(this.user_forms).forEach(key => {
                    this.user_forms[key]=response.get(key)
                })
            })
        },

        /*
        *搜索数据
        *作者：gzt
        *时间：2020-11-21 23:30:19
        */
        search(){
            this.page=1
           this.page_list(this.page) 
        },
        /*
        *分页加载数据
        *作者：gzt
        *时间：2020-11-21 23:30:27
        */
        page_list(page_index){
            this.loading=true
            let query = new this.ParseServer.Query('Accounts')
            query.descending("createdAt")
            if(this.search_keyword){
                query.startWith("realname",this.search_keyword)
            }
            query.count().then(count=>{
                this.total=count
            })
            query.skip((this.page-1)*10)
            query.limit(10)

            query.find().then(list => {
                this.users_datas=[]
                if (list && list.length>0){
                    this.users_datas=list.map((item)=>{
                        var account={
                            id:item.id,
                            nickName:item.get("nickName"),
                            realname:item.get("realname"),
                            phone:item.get("phone"),
                            role:item.get("role"),
                            amount:item.get("amount"),
                            score:item.get("score"),
                            registration_time:item.get("registration_time")
                        }
                        return account
                    })
                }
                this.loading=false
            },(error)=>{
                console.log(error)
                this.$Message.error('保存失败')
            })
        },

        /*
        * 删除科目
        *作者：gzt
        *时间：2020-11-22 08:41:53
        */
        delete(subject_id){
            let _this=this
            this.$Modal.confirm({
                    title: '删除提示',
                    content: '<p>删除用户后，用户将无法使用系统，确定要删除吗？</p>',
                    onOk: () => {
                        var query = new this.ParseServer.Query("Accounts")
                        query.get(subject_id).then((response)=>{
                            // 删除当前组件
                            response.destroy().then((delete_result)=>{
                                this.$Message.success('删除成功');
                                this.page_list(this.page)
                            })
                        })
                    },
                    onCancel: () => {
                        this.$Message.info('取消了操作');
                    }
                });
        }
    }
}
</script>

<style lang="less" scoped>
</style>
