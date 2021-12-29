<template>
    <div class="container-wrap">
        <!-- <div style="display:flex">
            <div style="flex:1">
                <Input v-model="keyword" size="large" placeholder="ID主题关键字搜索" style="width: 200px;margin-left:10px" />
                <Button type="primary" class="search-btn" @click="search">搜索</Button></Col>
            </div>
        </div> -->
        <Row class="table-wrap">
            <Table  :loading="loading" :columns="columns" :data="data">
                <!-- <template slot-scope="{ row }" slot="isNeedPay">
                    {{row.isNeedPay==1?'是':'否'}}
                </template>
                <template slot-scope="{ row }" slot="price">
                    {{row.price?row.price:'---'}}
                </template>
                <template slot-scope="{ row }" slot="updatedAt">
                    {{toDateFormat(row.updatedAt)}}
                </template> -->
                <template slot-scope="{ row }" slot="img">
                    <div style="margin:5px 0"><img v-if="row.img" :src="row.img" @click="handleShowImg(row)" width="84" height="38"></div>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <Button type="warning" size="small" style="margin-right:5px" @click="EditFormShow(row)">编辑</Button>
                    <!-- <Button type="warning" size="small" style="margin-right:5px" @click="CommentsFormShow(row)">介绍</Button> -->
                </template>
            </Table>
            <!-- <div class="page-wrap">
                <Page :total="total" @on-change="page_list"  v-if="total!=0" />
            </div> -->
        </Row>
         <Modal v-model="isShowAddForm"
            :title="window_title"
            width="500"
            mask scrollable
            :loading='modalLoading'
            @on-ok="update">
            <Form v-if="isShowAddForm" ref="form" :model="form" label-position="right" :label-width="100" :rules="ruleValidate">
                <FormItem label="位置">
                    <label>{{form.title}}</label>
                </FormItem>
                <FormItem label="背景图" prop="img">
                    <div>
                        <img v-if="form.img" :src="form.img" width="168" height="326"/>
                    </div>
                    <myUpload @complate="handleUploadComplate" :tips="form.area=='grzx'?'（推荐尺寸602*1066px）':'（推荐尺寸602*850px）'"></myUpload>
                </FormItem>
            </Form>
         </Modal>
        <Modal width="500" title="查看大图" v-model="isShowImg" :styles="{top: '20px'}">
            <div style="margin:5px 0;text-align:center"><img :src="currImg" width="450"></div>
        </Modal>
    </div>
</template> 

<script>
import myUpload from "@/components/myUpload"
import { tool } from '@/api/tool'
import { verification } from '@/api/verification'
export default {
    name: "subjectsmanageindex",
    components:{
        myUpload
    },
    data() {
        var self = this
        return {
            isShowCommentsForm: false,
            columns: [
                { title: "序号", type:'index', align: 'center' },
                { title: '位置', key: 'title'},
                { title: "图片", key: 'img',slot: 'img'},
                // { title: "最后更新时间", key: 'updatedAt'},
                // { title: "最后更新人", key: 'updatedBy'},
                { title: '操作', key: 'action',slot:'action' }
            ],
            form:{
                id: '',
                area: '',
                img: '',
                title: ''
            },
            ruleValidate: {
                img: [{ required: true, message: '请上传背景图', trigger: 'blur' }]
            },
            keyword:'',
            currImg: '',
            data: [],
            isShowImg: false,
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
        toDateFormat(date) {
            return tool.dateFormat(date,'yyyy-MM-dd HH:mm:ss')
        },
        
        handleUploadComplate(url){
            this.form.img = url
        },
        
        handleShowImg(row){
            this.isShowImg = true
            this.currImg = row.img
        },
        /**
         * 弹出编辑窗口
         */
        EditFormShow(row) {
            this.isShowAddForm = true
            this.form = row
            this.form.maxScoreMoney = row.maxScoreMoney ? row.maxScoreMoney : 0
            this.form.minScore = row.minScore ? row.minScore : 0
        },
        update(){
            var self = this
            var dbConfig = self.ParseServer.Object.extend("Sharebg")
            var config = new dbConfig()
            debugger
            config.set('id', self.form.id)
            self.$refs['form'].validate(valid => {
                if (!valid) {
                    self.$Message.error('请检查表单项')
                    self.modalLoading = false
                    setTimeout(() => {
                        self.modalLoading = true
                    }, 100)
                    return false
                } else {
                    debugger
                    config.set('area', self.form.area)
                    config.set('img', self.form.img)
                    config.set('title', self.form.title)
                    config.save().then((con)=>{
                        self.isShowAddForm = false
                        self.$Message.success('保存成功')
                        self.page_list()
                    },(error)=>{
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
        pagechange(e){
        this.page = e
        this.page_list()
        },
        /*
        *分页加载数据
        *作者：gzt
        *时间：2020-11-21 23:30:27
        */
        page_list(page_index){
            let _this=this
            let query = new this.ParseServer.Query('Sharebg')
            query.count().then(count => {
                if(count > 0) {
                    query.find().then(list => {
                        _this.data = []
                        if (list && list.length > 0) {
                            list.forEach((item) => {
                                _this.data.push({
                                    id: item.id,
                                    area: item.get("area"),
                                    title: item.get("title"),
                                    img:item.get('img'),
                                    updatedAt: item.get('updatedAt'),
                                    updatedBy: item.get('updatedBy')
                                })
                            })
                        }
                        this.loading=false
                    })
                } else {
                    var dbConfig = this.ParseServer.Object.extend("Sharebg")
                    var data = [
                        {area:'grzx',title: '个人中心分享', updatedBy:'管理员'},
                        {area:'kmwc',title: '科目完成分享', updatedBy:'管理员'},
                        {area:'mnst',title: '模拟试题分享', updatedBy:'管理员'},
                    ]
                    for(var i = 0; i < data.length; i++) {
                        var item = data[i]
                        var config = new dbConfig()
                        _this.loading = true
                        config.set('area',item.area)
                        config.set('title',item.title)
                        config.set('img', '')
                        config.set('updatedBy',item.updatedBy)
                        config.save().then(res=>{
                            _this.data.push({
                                id: res.id,
                                area: res.get("area"),
                                title: res.get("title"),
                                img: res.get('img'),
                                updatedAt: res.get('updatedAt'),
                                updatedBy: res.get('updatedBy')
                            })
                            _this.loading=false
                        },error=>{
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
