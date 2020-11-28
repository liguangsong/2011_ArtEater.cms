<template>
    <div class="container-wrap">
        <div style="display:flex">
            <div style="flex:1">
                <Input v-model="keyword" size="large" placeholder="ID主题关键字搜索" style="width: 200px;margin-left:10px" />
                <Button type="primary" class="search-btn" @click="search">搜索</Button></Col>
            </div>
        </div>
        <Row class="table-wrap">
            <Table  :loading="loading" :columns="columns" :data="data">
                <template slot-scope="{ row }" slot="isNeedPay">
                    {{row.isNeedPay==1?'是':'否'}}
                </template>
                <template slot-scope="{ row }" slot="action">
                    <Button type="warning" size="small" style="margin-right:5px" @click="EditFormShow(row)">编辑</Button>
                </template>
            </Table>
            <!-- <div class="page-wrap">
                <Page :total="total" @on-change="page_list"  v-if="total!=0" />
            </div> -->
        </Row>
         <Modal v-model="isShowAddForm"
            :title="window_title"
            width="400"
            mask scrollable
            :loading='modalLoading'
            @on-ok="update">
            <Form ref="form" :model="form" label-position="right" :label-width="80" :rules="ruleValidate">
                <FormItem label="页面">
                    <label>{{form.page}}</label>
                </FormItem>
                <FormItem label="功能名称">
                    <label>{{form.action}}</label>
                </FormItem>
                <FormItem label="是否收费">
                    <Select v-model="form.isNeedPay">
                        <Option :value="1" :key="1">是</Option>
                        <Option :value="0" :key="0">否</Option>
                    </Select>
                </FormItem>
                <FormItem label="收费金额" prop="price">
                    <Input v-model="form.price" placeholder="请输入收费金额"></Input>
                </FormItem>
            </Form>
         </Modal>
    </div>
</template> 

<script>
import { verification } from '@/api/verification'
export default {
    name: "subjectsmanageindex",
    data() {
        var self = this
        return {
            columns: [
                { title: '页面',key: 'page'},
                { title: '功能名称', key: 'action'},
                { title: "是否收费", key: 'isNeedPay',slot: 'isNeedPay'},
                { title: "收费金额（元）", key: 'price'},
                { title: "更新时间", key: 'updatedAt'},
                { title: "更新人", key: 'updatedBy'},
                { title: '操作', key: 'action',slot:'action' }
            ],
            form:{
                id: '',
                page:'',
                action:'',
                isNeedPay: 0,
                price: '0',
            },
            ruleValidate: {
                price: [{ trigger: 'blur', 
                        validator: (rule, value, callback) => {
                            if(self.form.isNeedPay == 1) {
                                if (value === '' ) {
                                    callback(new Error('请输入价格'))
                                } else if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
                                    return callback(new Error('价格由整数、小数点和最多两个小数组成！'))
                                } else {
                                    callback()
                                }
                            } else {
                                callback()
                            }
                        }
                    }
                ]
            },
            keyword:'',
            data:[],
            isShowAddForm: false,
            loading: true,
            modalLoading: true,
            window_title:"编辑功能信息"
        }
    },
    computed:{
    },
    mounted() {
        this.page_list()
    },
    methods: {

        /**
         * 弹出编辑窗口
         */
        EditFormShow(row) {
            this.isShowAddForm = true
            this.form = row
        },
        update(){
            var self = this
            var dbConfig = this.ParseServer.Object.extend("ActionConfig")
            var config = new dbConfig()
            config.set('id', this.form.id)
            this.$refs['form'].validate(valid => {
                if (!valid) {
                    self.$Message.error('请检查表单项')
                    self.modalLoading = false
                    setTimeout(() => {
                        self.modalLoading = true
                    }, 100)
                    return false
                } else {
                    config.set('isNeedPay', self.form.isNeedPay)
                    config.set('price', self.form.isNeedPay == 1 ? self.form.price: '')
                    config.save().then((con)=>{
                        this.isShowAddForm = false
                        self.$Message.success('保存成功')
                        self.page_list()
                    },(error)=>{
                        console.log(error)
                        self.$Message.error('保存失败')
                    })
                }
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
            let _this=this
            let query = new this.ParseServer.Query('ActionConfig')
            query.count().then(count => {
                if(count > 0) {
                    query.find().then(list => {
                        _this.data = []
                        if (list && list.length > 0) {
                            list.forEach((item) => {
                                _this.data.push({
                                    id: item.id,
                                    page: item.get("page"),
                                    code: item.get("code"),
                                    action:item.get('action'),
                                    isNeedPay: item.get('isNeedPay'),
                                    price: item.get('price'),
                                    updatedBy: item.get('updatedBy')
                                })
                            })
                        }
                        this.loading=false
                    })
                } else {
                    var dbConfig = this.ParseServer.Object.extend("ActionConfig")
                    var data = [
                        {page: '首页',code:'cuotiji',action:'错题集',isNeedPay:1, price:'50.10',updatedBy:'管理员'},
                        {page: '首页',code:'zhongdiantiku',action:'重点题库',isNeedPay:0, price:'',updatedBy:'管理员'},
                        {page: '首页',code:'monishiti',action:'模拟试题',isNeedPay:1, price:'60.00',updatedBy:'管理员'},
                        {page: '首页',code:'lunbotu',action:'轮播图',isNeedPay:0, price:'',updatedBy:'管理员'},
                        {page: '我的',code:'gerenxinxi',action:'个人信息',isNeedPay:0, price:'',updatedBy:'管理员'},
                        {page: '我的',code:'wodecuotiji',action:'错题集',isNeedPay:0, price:'',updatedBy:'管理员'},
                        {page: '我的',code:'qiandao',action:'签到',isNeedPay:0, price:'',updatedBy:'管理员'},
                        {page: '我的',code:'yigouxiangmu',action:'已购项目',isNeedPay:0, price:'',updatedBy:'管理员'},
                        {page: '我的',code:'jifenpaihangbang',action:'积分排行榜',isNeedPay:0, price:'',updatedBy:'管理员'},
                        {page: '我的',code:'xiaoxizhongxin',action:'消息中心',isNeedPay:0, price:'',updatedBy:'管理员'},
                        {page: '我的',code:'yijianfankui',action:'意见反馈',isNeedPay:0, price:'',updatedBy:'管理员'}
                    ]
                    for(var i = 0; i < data.length; i++) {
                        var item = data[i]
                        var config = new dbConfig()
                        _this.loading = true
                        config.set('page',item.page)
                        config.set('code',item.code)
                        config.set('action',item.action)
                        config.set('isNeedPay',item.isNeedPay)
                        config.set('updatedBy',item.updatedBy)
                        config.set('price',item.price)
                        config.save().then(res=>{
                            _this.data.push({
                                id: res.id,
                                page: res.get("page"),
                                code: res.get("code"),
                                action: res.get('action'),
                                isNeedPay: res.get('isNeedPay'),
                                price: res.get('price'),
                                updatedBy: res.get('updatedBy')
                            })
                            _this.loading=false
                        })
                    }
                }
            })
        },
    }
}
</script>

<style lang="less" scoped>
</style>
