<template>
    <div class="container-wrap">
        <Row>
        <Col span="6"><Input v-model="search_keyword" size="large" placeholder="请输入科目名称/ID" style="width: 400px" /><Button type="primary" class="search-btn" @click="search">搜索</Button></Col>
        <Col span="18">
            <div class="operation-wrap">
                <Button type="success" @click="show_window=true">新增科目</Button>
            </div>
        </Col>
        </Row>
        <Row class="table-wrap">
             <Table  :loading="loading" :columns="columns" :data="subjects_datas">
             </Table>
             <div class="page-wrap">
             <Page :total="total" @on-change="page_list"  v-if="total!=0" />
             </div>
        </Row>

         <Modal v-model="show_window"
        :title="window_title"
         width="800"
        @on-ok="add_subjects"
        @on-cancel="cancel">
        <Form :model="subject_form" label-position="right" :label-width="80">
            <FormItem label="科目名称">
                <Input v-model="subject_form.subject_name" placeholder="请输入科目名称"></Input>
            </FormItem>
            <FormItem label="科目ID">
                <Input v-model="subject_form.subject_ID" placeholder="请输入科目ID"></Input>
            </FormItem>
            <FormItem label="是否收费">
                <i-switch v-model="subject_form.free" size="large">
                    <span slot="false">收费</span>
                    <span slot="true">免费</span>
                </i-switch>
            </FormItem>
            <FormItem label="收费金额" v-if="show_price">
                <Input v-model="subject_form.price" placeholder="请输入收费金额"></Input>
            </FormItem>
            <FormItem label="说明">
                <Editor :value="subject_form.content" @on-change="change_value"></Editor>
            </FormItem>
        </Form>
         </Modal>
    </div>
</template> 

<script>
import Editor from "@/components/editor"

export default {
    name: "subjectsmanageindex",
    data() {
        return {
            query_subject_id:this.$route.query.subjectid,
            page:1,
            total:0,
            loading: true,
            search_keyword:'',
            columns: [
                    {
                        title: '科目名称',
                        key: 'subject_name'
                    },
                    {
                        title: 'ID',
                        key: 'subject_ID'
                    },
                    {
                        title: "内容添加",
                        key: 'has_content'
                    },
                    {
                        title: "收费状态",
                        key: 'price'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            var button=[
                                  h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.parentid=params.row.id
                                            this.show_window=true
                                            this.window_title="新增科目"
                                        }
                                    }
                                }, '添加下一级'),
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
                                            this.subjectid=params.row.id
                                            this.show_window=true
                                            this.window_title="编辑科目"
                                            this.get_entity()
                                        }
                                    }
                                }, '编辑'),
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
                            if (params.row.has_down_level){
                                button.push(h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({"name":"subjectsmanageindex",params:{"subjectid":params.row.id}})
                                        }
                                    }
                                }, '查看下一级'))
                            }
                            return h('div', button);
                        }
                    }
                ],
            subjects_datas: [],
            subject_form:{
                subject_name:'',
                subject_ID:'',
                free:false,
                price:"",
                content:'',
                has_content:false,
                has_down_level:false,
                parent_ID:'0'
            },
            old_price:0,
            init_data:"",
            parentid:"0",
            subjectid:"",
            show_window:false,
            window_title:"新增科目"
        }
    },
      components:{
        Editor
    },
    computed:{
        show_price(){
            return this.subject_form.free
        }
    },
      mounted() {
        this.init_data=JSON.stringify(this.subject_form)
        this.page_list(this.page)
    },
    methods: {
        
        cancel(){
            this.parentid=""
            this.subjectid=""
            this.subject_form=JSON.parse(this.init_data)
            this.show_window=false,
            this.window_title="新增科目"
        },

         /*
        *获取科目实体
        *作者：gzt
        *时间：2020-11-22 09:21:48
        */
        get_entity(){
            var query = new this.ParseServer.Query("Subjects")
            query.get(this.subjectid).then((response)=>{
                Object.keys(this.subject_form).forEach(key => {
                    this.subject_form[key]=response.get(key)
                })
                this.old_price=response.get("price")==null?0:response.get("price")
            })
        },

          /*
        *新增科目
        *作者：gzt
        *时间：2020-11-21 23:41:37
        */
        add_subjects(){
            var subjects=this.ParseServer.Object.extend("Subjects")
            var subject=new subjects()
            if(this.subjectid){
                subject.set('id',this.subjectid)
            }
            if(this.parentid){
                this.subject_form.parent_ID=this.parentid
            }
            subject.set('subject_name',this.subject_form.subject_name)
            subject.set("subject_ID",this.subject_form.subject_ID)
            subject.set("content",this.subject_form.content)
            subject.set("price",this.subject_form.price)
            subject.set("free",this.subject_form.free)
            subject.set("parent_ID",this.subject_form.parent_ID)
            subject.set("has_content",this.subject_form.has_content)
            subject.set("has_down_level",this.subject_form.has_down_level)
            subject.save().then((subject)=>{
                if (this.subject_form.parent_ID!="0"||this.subject_form.parent_ID!=0){
                var query = new this.ParseServer.Query("Subjects")
                query.get(this.subject_form.parent_ID).then((response)=>{
                    response.set("has_down_level",true)
                    if(this.subject_form.price!=""){
                        var price=response.get('price')==null?0:parseFloat(response.get('price')) -this.old_price
                        response.set("price",String(parseFloat(price)+parseFloat(this.subject_form.price)))
                    }
                    response.save().then((result)=>{
                        this.$Message.success('保存成功')
                        this.page_list(1)
                        this.cancel()
                    })
                })
            }else{
                this.$Message.success('保存成功')
                this.page_list(1)
                this.cancel()
            }

            },(error)=>{
                console.log(error)
                this.$Message.error('保存失败')
            })
        },

        /*
        *富文本编辑框的内容发生变化
        *作者：gzt
        *时间：2020-11-22 00:37:46
        */
        change_value(html,text){
            this.subject_form.content=html
            if(html!="<p><br></p>"){
                this.subject_form.has_content=true
            }else{
                this.subject_form.has_content=false
            }
            console.log(this.has_content)
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
            let query = new this.ParseServer.Query('Subjects')
            if (this.query_subject_id!=0){
                
            }
            query.count().then(count=>{
                _this.total=count
            })
            query.skip((this.page-1)*10)
            query.limit(10)
            query.find().then(list => {
                _this.subjects_datas=[]
                if (list && list.length>0){
                    list.forEach((item)=>{
                        _this.subjects_datas.push({
                            id:item.id,
                            subject_name:item.get("subject_name"),
                            parent_ID:item.get("parent_ID"),
                            subject_ID:item.get("subject_ID"),
                            price:item.get("price"),
                            has_content: item.get("has_content")==true?"已添加":"----",
                            has_down_level: item.get("has_down_level")
                        })
                    })
                }
                this.loading=false
            })
        },

        /*
        *递归删除科目
        *作者：gzt
        *时间：2020-11-22 11:57:11
        */
        recursive_delete(parent_id){
            var query_deletes=new this.ParseServer.Query("Subjects")
            query_deletes.equalTo("parent_ID",parent_id)
            query_deletes.find().then((response)=>{
                if(response&&response.length>0){
                    response.forEach((data)=>{
                        data.destroy().then((result)=>{
                            this.recursive_delete(data.id)
                        })
                    })
                }
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
                    content: '<p>删除当前科目后，包含的子科目都会被删除，确定要删除吗？</p>',
                    onOk: () => {
                        var query = new this.ParseServer.Query("Subjects")
                        query.get(subject_id).then((response)=>{

                            // 删除所有的子组件
                           this.recursive_delete(response.id)
                            // 删除当前组件
                            response.destroy().then((delete_result)=>{
                                // 更新当前的父级组件是否还存在其他的子组件
                                    query.equalTo("parent_ID",response.get("parent_ID"))
                                    query.find().then((result)=>{
                                        if(result.length==0){
                                            var query_get = new this.ParseServer.Query("Subjects")
                                            if(response.get("parent_ID")=="0"||response.get("parent_ID")==""){
                                                this.$Message.success('删除成功');
                                                _this.page_list(this.page)
                                                return
                                            }
                                            query_get.get(response.get("parent_ID")).then((subject)=>{
                                                subject.set('has_down_level',false)
                                                subject.save().then((r)=>{
                                                     this.$Message.success('删除成功');
                                                    _this.page_list(this.page)
                                                })
                                            })
                                        }else{
                                            this.$Message.success('删除成功');
                                            _this.page_list(this.page)
                                        }
                                    })
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
