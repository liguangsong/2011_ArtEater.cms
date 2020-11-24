<template>
    <div class="container-wrap">
        <Row>
        <Col span="6"><Input v-model="search_keyword" size="large" placeholder="请输入试题名称" style="width: 400px" /><Button type="primary" class="search-btn" @click="search">搜索</Button></Col>
        <Col span="18">
            <div class="operation-wrap">
                <Button type="success" @click="show_window=true">新增试题</Button>
            </div>
        </Col>
        </Row>
        <Row class="table-wrap">
             <Table  :loading="loading" :columns="columns" :data="question_datas">
             </Table>
             <div class="page-wrap">
             <Page :total="total" @on-change="page_list"  v-if="total!=0" />
             </div>
        </Row>
         <Modal v-model="show_window"
        :title="window_title"
         width="800"
        @on-ok="add_questions"
        @on-cancel="cancel">
        <Form :model="question_form" label-position="right" :label-width="80">
            <FormItem label="试题类型">
                <RadioGroup v-model="question_form.typename">
                    <Radio label="单选">单选</Radio>
                    <Radio label="多选">多选</Radio>
                    <Radio label="填空">填空</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="是否重点">
                <i-switch v-model="question_form.free" size="large">
                    <span slot="false">重点</span>
                    <span slot="true">非重点</span>
                </i-switch>
            </FormItem>
            <FormItem label="科目章节">
                <CheckboxGroup v-model="question_form.subjects">
                    <Checkbox :label="item" v-for="(item,index) in subjects" :key="index"></Checkbox>
                </CheckboxGroup>
             </FormItem>
            <FormItem label="题干">
                <Input v-model="question_form.title" placeholder="请输入题干名称"></Input>
            </FormItem>
           <FormItem label="图文说明">
               <UploadImage :images="images" :action="upload_address" @upload-success="upload_success"></UploadImage>
            </FormItem>
            <FormItem label="单选选项" v-if="question_form.typename=='单选'">
                <Single :exam_options="options" @change-option="change_option"></Single>
            </FormItem>
            <FormItem label="多选选项" v-if="question_form.typename=='多选'">
                <Multi :exam_options="options" @change-option="change_option"></Multi>
            </FormItem>
            <FormItem label="答案解析">
                <Input  :rows="3" type="textarea" v-model="question_form.title" placeholder="请输入答案解析"></Input>
            </FormItem>
             <FormItem label="参考答案">
                <Input v-model="question_form.answer" disabled></Input>
            </FormItem>
        </Form>
         </Modal>
    </div>
</template> 

<script>
import Editor from "@/components/editor"
import UploadImage from "./components/upload/index"
import Single from "./components/single/index"
import Multi from "./components/multiselect/index"
export default {
    name: "testquestions",
    data() {
        return {
            page:1,
            total:0,
            loading: true,
            search_keyword:'',
            columns: [
                    {
                        title: '题干',
                        key: 'title'
                    },
                    {
                        title: '类型',
                        key: 'typename'
                    },
                    {
                        title: "维护人",
                        key: 'has_content'
                    },
                    {
                        title: "维护时间",
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
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.question_id=params.row.id
                                            this.show_window=true
                                            this.window_title="编辑试题"
                                            this.get_entity()
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
                                            this.question_id=params.row.id
                                            this.show_window=true
                                            this.window_title="查看试题"
                                            this.get_entity()
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
            question_datas: [],
            subjects:["中文",'.NET','python'],
            question_form:{
                title:'',
                free:false,
                price:"",
                content:'',
                has_content:false,
                has_down_level:false,
                parent_ID:'0',
                imaegs:"",
                options:[],
                answer:"A",
                typename:"单选",
                subjects:[]

            },
            options:[],
            init_data:"",
            question_id:"0",
            show_window:false,
            window_title:"新增试题",
            upload_address:"http://1.w2wz.com/upload.php"
        }
    },
      components:{
        Editor,
        UploadImage,
        Single,
        Multi
    },
    computed:{
        images(){
            if (this.question_form.imaegs!=""){
                debugger
                return this.question_form.images.split(',')
            }
            return []
        }
    },
    mounted() {
        this.init_data=JSON.stringify(this.question_form)
        this.page_list(this.page)
    },
    methods: {

        /*
        *上传成功
        *作者：gzt
        *时间：2020-11-22 20:26:31
        */
        upload_success(data){
            console.log('------------------')
            console.log(data)
             console.log('------------------')
            // this.question_form.imaegs=data.map((item)=>{
            //     return item.name
            // }).join(',')
        },

        /*
        * 取消操作
        *作者：gzt
        *时间：2020-11-22 18:49:58
        */
        cancel(){
            this.question_id=""
            this.question_form=JSON.parse(this.init_data)
            this.show_window=false,
            this.window_title="新增科目"
        },

         /*
        *获取科目实体
        *作者：gzt
        *时间：2020-11-22 09:21:48
        */
        get_entity(){
            var query = new this.ParseServer.Query("TestQuestions")
            query.get(this.subjectid).then((response)=>{
                Object.keys(this.question_form).forEach(key => {
                    this.question_form[key]=response.get(key)
                })
            })
        },

          /*
        *新增科目
        *作者：gzt
        *时间：2020-11-21 23:41:37
        */
        add_questions(){
            var subjects=this.ParseServer.Object.extend("TestQuestions")
            var subject=new subjects()
            if(this.subjectid){
                subject.set('id',this.subjectid)
            }
            if(this.parentid){
                this.question_form.parent_ID=this.parentid
            }
            subject.set('title',this.question_form.title)
            subject.set("subject_ID",this.question_form.subject_ID)
            subject.set("content",this.question_form.content)
            subject.set("price",this.question_form.price)
            subject.set("free",this.question_form.free)
            subject.set("parent_ID",this.question_form.parent_ID)
            subject.set("has_content",this.question_form.has_content)
            subject.set("has_down_level",this.question_form.has_down_level)
            subject.save().then((subject)=>{
                this.$Message.success('保存成功')
                this.page_list(1)
                this.cancel()
            },(error)=>{
                this.$Message.error('保存失败')
            })
        },

        /*
        *富文本编辑框的内容发生变化
        *作者：gzt
        *时间：2020-11-22 00:37:46
        */
        change_value(html,text){
            this.question_form.content=html
            if(html!="<p><br></p>"){
                this.question_form.has_content=true
            }else{
                this.question_form.has_content=false
            }
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
            let query = new this.ParseServer.Query('TestQuestions')
            query.count().then(count=>{
                _this.total=count
            })
            query.skip((this.page-1)*10)
            query.limit(10)
            query.find().then(list => {
                _this.question_datas=[]
                if (list && list.length>0){
                    list.forEach((item)=>{
                        _this.question_datas.push({
                            id:item.id,
                            title:item.get("title"),
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
                        var query = new this.ParseServer.Query("TestQuestions")
                        query.get(subject_id).then((response)=>{
                            // 删除当前组件
                            response.destroy().then((delete_result)=>{
                               
                            })
                        })
                    },
                    onCancel: () => {
                        this.$Message.info('取消了操作');
                    }
                });
        },




        //----------------------------------------------------------试题的选项操作相关-----------------------------------------

        change_option(optinos){
            console.log(optinos)
        }
    }
}
</script>

<style lang="less" scoped>
</style>
