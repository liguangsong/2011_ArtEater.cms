<template>
    <div class="container-wrap">
        <Row>
        <Col span="6"><Input v-model="search_keyword" size="large" placeholder="ID 昵称 姓名关键字查询" style="width: 400px" /></Col>
         <Col span="2">注册时间</Col>
         <Col span="6"><DatePicker type="date" :start-date="new Date(2020, 1, 1)" placeholder="请输入开始时间" style="width: 200px"></DatePicker></Col>~
         <Col span="6"><DatePicker type="date" :start-date="new Date(2020, 1, 1)" placeholder="请输入结束时间" style="width: 200px"></DatePicker></Col>
          <Col span="4"> <Button type="primary" class="search-btn" @click="search">查询</Button></Col>
       
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
        @on-ok="cancel">
        <Form :model="user_forms" label-position="right" :label-width="60">
        <FormItem label="头像">
            <Avatar icon="ios-person" size="large" v-if="user_forms.avatarUrl!=''" />
             <Avatar v-else :src="user_forms.avatarUrl" size="large" />
        </FormItem>
        <FormItem label="昵称">
            <Input v-model="user_forms.nickName" disabled></Input>
        </FormItem>
        <FormItem label="姓名">
            <Input v-model="user_forms.realname" disabled></Input>
        </FormItem>
          <FormItem label="手机号">
            <Input v-model="user_forms.phone" disabled></Input>
        </FormItem>
        <FormItem label="报考专业">
            <Input v-model="user_forms.speciality" disabled></Input>
        </FormItem>
              <FormItem label="目标院校">
            <Input v-model="user_forms.university" disabled></Input>
        </FormItem>
             <FormItem label="所在地区">
            <Input v-model="user_forms.proviceName" disabled></Input>
        </FormItem>
        <FormItem label="消费金额(元)" v-if="see">
            <Input v-model="user_forms.amount" disabled></Input>
        </FormItem>
        <FormItem label="积分" v-if="see">
            <Input v-model="user_forms.score" disabled></Input>
        </FormItem>
    </Form>
    </Modal>
    </div>
</template> 

<script>

export default {
    name: "studentindex",
    data() {
        return {
            page:1,
            total:0,
            loading: true,
            user_id:"",
            window_title:"用户信息",
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
                        title: "注册时间",
                        key: 'registration_time'
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
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            var button=[
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
                                        }
                                    }
                                }, '用户信息'),
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
                amount:"",
                score:"",
                avatarUrl:"",
                speciality:"",
                university:"",
                proviceName:"",
                registration_time:""
            },
        }
    },
      mounted() {
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
        },
        
         /*
        *获取用户
        *作者：gzt
        *时间：2020-11-22 09:21:48
        */
        get_entity(){
            var query = new this.ParseServer.Query("UserInfo")
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
            let query = new this.ParseServer.Query('UserInfo')
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
                            amount:item.get("amount"),
                            score:item.get("score"),
                            registration_time:item.get("registration_time")
                        }
                        return account
                    })
                }
                this.loading=false
            },(error)=>{
                this.$Message.error('用户列表获取失败')
            })
        },

        /*
        *删除用户
        *作者：gzt
        *时间：2020-11-25 23:17:56
        */
        delete(user_id){
            let _this=this
            this.$Modal.confirm({
                    title: '删除提示',
                    content: '<p>删除用户后，用户将无法使用系统，确定要删除吗？</p>',
                    onOk: () => {
                        var query = new this.ParseServer.Query("UserInfo")
                        query.get(user_id).then((response)=>{
                            // 删除用户
                            response.destroy().then((delete_result)=>{
                                this.$Message.success('删除成功');
                                this.page_list(this.page)
                            },(error)=>{
                                this.$Message.error('删除失败');
                            })
                        },(error)=>{
                            this.$Message.error('删除的用户不存在');
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
