<template>
    <div class="container-wrap">
        <div class="header-wrap clear-fix" style="display:flex">
            <div class="search-wrap clear-fix" style="flex:1">
                <div class="search-keyword" style="width:150px">
                    <span style="width:50px">ID：</span>
                    <Input v-model="search_ID" size="large" style="width:100px" placeholder="请输入ID" />
                </div>
                <div class="search-keyword" style="width:225px">
                    <span style="width:85px">科目名称：</span>
                    <Input v-model="search_subject_name" size="large" style="width:150px" placeholder="请输入科目名称" />
                </div>
                <div class="select-choice clear-fix" style="width:140px">
                    <span style="width:50px;padding:0">题型：</span>
                    <Select size="large" v-model="search_type" class="choice" placeholder="题型" :clearable="true" style="width:70px">
                        <Option :value="1" :key="1">单选</Option>
                        <Option :value="2" :key="2">多选</Option>
                        <Option :value="3" :key="3">填空</Option>
                    </Select>
                </div>
                <div class="search-keyword" style="width:160px">
                    <span style="width:85px">更新人：</span>
                    <Input v-model="search_updateBy" size="large" style="width:100px" placeholder="更新人姓名" />
                </div>
                <div class="select-choice clear-fix" style="width:200px">
                    <span style="width:85px;padding:0">是否重点：</span>
                    <Select size="large" v-model="search_important" class="choice" :clearable="true" style="width:100px">
                        <Option :value="1" :key="1">是</Option>
                        <Option :value="0" :key="0">否</Option>
                    </Select>
                </div>
                <div class="search-btn" style="width:100px;margin:0">
                    <Button type="primary" @click="search" size="large">查询</Button>
                </div>
            </div>
            <div class="operation-wrap" style="width:175px">
                <Button style="margin-right:10px" type="primary" @click="handleAddQuestion">新增试题</Button>
                <Button type="info" @click="isUploadData=true">批量导入</Button>
            </div>
        </div>
        <Row class="table-wrap">
            <Table  :loading="loading" :columns="columns" :data="question_datas">
                <template slot-scope="{ row }" slot="subjects">
                    <strong v-for="(_sub,_idx) in row.subjects">{{getSubjectName(_sub)+(_idx==row.subjects.length-1?'':'；')}}</strong>
                </template>
                <template slot-scope="{ row }" slot="answer">
                    <strong v-if="row.type==3">{{row.options.length>1?(row.options[0].value[0].txt+'...'):(row.options[0].value.length>1?(row.options[0].value[0].txt + '|' + row.options[0].value[1].txt +'...'):(row.options[0].value[0].txt))}}</strong>
                    <strong v-else>{{getRightAnswer(row.options)}}</strong>
                </template>
                <template slot-scope="{ row }" slot="isImportant">
                    <span v-if="row.isImportant==1">是</span>
                    <span v-else>否</span>
                </template>
                <template slot-scope="{ row }" slot="type">
                    <strong v-if="row.type==1">单选</strong>
                    <strong v-if="row.type==2">多选</strong>
                    <strong v-if="row.type==3">填空</strong>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <Button type="info" size="small" style="margin-right:5px" @click="handleShowQuestion(row)">查看</Button>
                    <Button type="warning" size="small" style="margin-right:5px" @click="handleEditQuestion(row)">编辑</Button>
                    <Button type="error" size="small" @click="handleRemove(row)">删除</Button>
                </template>
            </Table>
            <div class="page-wrap">
                <Page :total="total" @on-change="pagechange"  v-if="total!=0" />
            </div>
        </Row>
         <Modal v-model="show_window"
            :title="window_title"
            width="600"
            :loading='modalLoading'
            @on-ok="add_questions"
            @on-cancel="cancel">
            <Form v-if="show_window" ref="form" :model="question_form" label-position="right" :label-width="80" :rules="ruleValidate">
                <FormItem label="科目章节" prop="subjects">
                    <selectTree id="mySelectTree" v-model="question_form.subjects" multiple :treeData="subjectTreeData"></selectTree>
                </FormItem>
                <FormItem label="试题类型" prop="type">
                    <RadioGroup v-model="question_form.type" @on-change="handleQuesTypeChange">
                        <Radio :disabled="question_form.id&&question_form.id!=''" :label="1">单选</Radio>
                        <Radio :disabled="question_form.id&&question_form.id!=''" :label="2">多选</Radio>
                        <Radio :disabled="question_form.id&&question_form.id!=''" :label="3">填空</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="试题图片">
                    <myUploadMuti :images="question_form.images" @complate="handleUploadComplate"></myUploadMuti>
                </FormItem>
                <FormItem label="题干" prop="title">
                    <Tooltip :disabled="question_form.type!=3" placement="top" style="width:100%">
                        <div style="display:flex;">
                            <div style="flex:1">
                                <Input id='title' :rows="3" type="textarea" @input="initAnswers" v-model="question_form.title" placeholder="请输入题干"></Input>
                            </div>
                            <div v-if="question_form.type==3" style="width:120px;text-align:center">
                                <Button type="primary" @click="insertInputTxt">插入填空</Button>
                            </div>
                        </div>
                        <div v-if="question_form.type==3" slot="content">
                            <p>提示：4个英文下划线(_)代表一个填空</p>
                            <p>导入时一样，在框内输入____试试</p>
                        </div>
                    </Tooltip>
                </FormItem>
                <FormItem label="选项" prop="options">
                    <RadioGroup v-if="question_form.type==1" v-model="rightAnswer" @on-change="changeAnswer" style="width:100%">
                        <div class="optionItem" v-for="(option, index) in question_form.options">
                            <div class="code">{{option.code}}</div>
                            <div class="content">
                                <Input v-model="option.content" placeholder="请输入答案"></Input>
                            </div>
                            <div class="right">
                                <Radio v-if="question_form.type==1" :label="option.code">正确答案</Radio>
                            </div>
                            <div class="del">
                                <div>
                                    <Button v-if="index > 2 && index < 7 && index == question_form.options.length-1" type="primary" size="small" shape="circle" icon="md-add" @click="addCOptions"></Button>
                                </div>
                                <div>
                                    <Button v-if="index > 3" type="primary" size="small" shape="circle" icon="md-remove" @click="removeCOption(option)"></Button>
                                </div>
                            </div>
                        </div>
                    </RadioGroup>
                    <CheckboxGroup v-if="question_form.type==2" v-model="rightMultiAnswer" @on-change="changeAnswer" style="width:100%">
                        <div class="optionItem" v-for="(option, index) in question_form.options">
                            <div class="code">{{option.code}}</div>
                            <div class="content">
                                <Input v-model="option.content" placeholder="请输入答案"></Input>
                            </div>
                            <div class="right">
                                <Checkbox :label="option.code">正确答案</Checkbox>
                            </div>
                            <div class="del">
                                <div>
                                    <Button v-if="index > 2 && index < 7 && index == question_form.options.length-1" type="primary" size="small" shape="circle" icon="md-add" @click="addCOptions"></Button>
                                </div>
                                <div>
                                    <Button v-if="index > 3" type="primary" size="small" shape="circle" icon="md-remove" @click="removeCOption(option)"></Button>
                                </div>
                            </div>
                        </div>
                    </CheckboxGroup>
                    <div v-if="question_form.type==3" v-for="(option, index) in question_form.options">
                        <div class="optionItem" v-for="(item, _idx) in option.value">
                            <div class="code" style="width:80px">
                                <template v-if="_idx==0"><strong style="font-weight:bold">答案{{index+1}}</strong></template>
                                <template v-else>(备选){{_idx}}</template>
                            </div>
                            <div class="content">
                                <Input v-model="item.txt" placeholder="请输入答案"></Input>
                            </div>
                            <div class="del">
                                <div>
                                    <Button v-if="_idx == option.value.length-1" type="primary" size="small" shape="circle" icon="md-add" @click="addCOptions(option)"></Button>
                                </div>
                                <div>
                                    <Button v-if="_idx > 0" type="primary" size="small" shape="circle" icon="md-remove" @click="removeCOption(option,_idx)"></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="答案解析" prop="comments">
                    <!-- <Input  :rows="3" type="textarea" v-model="question_form.comments" placeholder="请输入答案解析"></Input> -->
                    <Editor v-model="question_form.comments" placeholder="请输入答案解析" @on-change="change_value"></Editor>
                </FormItem>
                <FormItem label="是否重点">
                    <RadioGroup v-model="question_form.isImportant">
                        <Radio :label="1">是</Radio>
                        <Radio :label="0">否</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
         </Modal>
         <Modal v-model="isShowDetail" title="查看试题" width="600">
            <Form label-position="right" :label-width="100">
                <FormItem label="科目章节">
                    <label><strong v-for="(_sub,_idx) in question_form.subjects">{{getSubjectName(_sub)+(_idx==question_form.subjects.length-1?'':'；')}}</strong></label>
                </FormItem>
                <FormItem label="类型">
                    <strong v-if="question_form.type==1">单选</strong>
                    <strong v-if="question_form.type==2">多选</strong>
                    <strong v-if="question_form.type==3">填空</strong>
                </FormItem>
                <FormItem v-if="question_form.images" label="试题图片">
                    <img :src="img" v-for="img in question_form.images" width="400px" style="margin-bottom:5px" />
                </FormItem>
                <FormItem label="题干">
                    <div>{{question_form.title}}</div>
                </FormItem>
                <FormItem label="选项" v-if="question_form.type==1||question_form.type==2">
                    <div v-for="option in question_form.options">选项{{option.code}}：{{option.content}}</div>
                </FormItem>
                <FormItem label="答案">
                    <template v-if="question_form.type==3">
                        <div v-for="(option, index) in question_form.options">答案{{index + 1}}：{{option.value[0].txt}}
                            <span v-if="option.value.length>1">(
                                <span v-for="(val,idx) in option.value">{{idx > 0 ? ('备选' + idx + '：' + val.txt + (idx == (option.value.length - 1) ? '' : '；')):''}}</span>
                                )</span>
                        </div>
                    </template>
                    <template v-else>
                        <div>{{getRightAnswer(question_form.options)}}</div>
                    </template>
                </FormItem>
                <FormItem label="答案解析">
                    <div v-html="showComments" class="comments"></div>
                </FormItem>
                <FormItem label="是否作为重点">
                    <div>{{question_form.isImportant==1?'是':'否'}}</div>
                </FormItem>     
            </Form>
         </Modal>
         <Modal v-model="isUploadData" title="导入试题" width="300" :footer-hide="true">
            <div style="height:100px;text-align:center">
                <div v-if="uploadCount==0" style="display:inline-block;margin-top:30px">
                    <myUpload v-if="isUploadData" @complate="handleUpload" type='excel'>
                        <Button icon="ios-cloud-upload-outline">选择要导入的文件</Button>
                    </myUpload>
                </div>
                <div v-if="uploadCount>0">
                    <label>共读取到{{uploadCount}}条数据，当前正在导入第{{uploadIndex}}条</label>
                </div>
            </div>
         </Modal>
    </div>
</template> 

<script>
import Editor from "@/components/editor"
import myUpload from "@/components/myUpload"
import myUploadMuti from "@/components/myUploadMuti"
// import Single from "./components/single/index"
// import Multi from "./components/multiselect/index"
import { urlConfig } from '@/api/urlconfig'
import selectTree from '@/components/iview-select-tree'
import { verification } from '@/api/verification'
import { tool } from '@/api/tool'
import XLSX,{utils} from 'xlsx'
import JsZip from 'jszip'
import x2js from 'x2js'
import editorVue from '../../components/editor/editor.vue'
export default {
    name: "testquestions",
    components:{
        Editor,
        selectTree,
        myUpload,
        myUploadMuti,
        // Single,
        // Multi
    },
    watch:{
        uploadIndex(val){
            if(val==this.uploadCount&&val!=0){
                this.$Message.success('导入成功')
                setTimeout(() => {
                    this.uploadIndex = 0
                    this.uploadCount = 0
                    this.isUploadData = false
                }, 2000);
            }
        }
    },
    data() {
        var self = this
        return {
            code:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            uploadCount:0,
            uploadIndex:0,
            page:1,
            pSize: 10,
            total: 0,
            loading: true,
            modalLoading: true,
            search_ID:'',
            search_subject_name:'',
            search_type:-1,
            search_updateBy:'',
            search_important:-1,
            subjectTreeData:[],
            subjects:[], // 所有科目和章节信息
            showComments:'',
            columns: [
                { title: 'ID', key: 'id',width:150 },
                { title: '科目', key: 'subjects', slot: 'subjects',width:200 },
                { title: '类型', key: 'type', slot: 'type',width:100 },
                { title: '重点题库', key: 'isImportant', slot: 'isImportant',width:100 },
                { title: '题干', key: 'title' },
                { title: "答案", key: 'answer', slot: 'answer',width:150 },
                { title: "更新人", key: 'updatedBy',width:170},
                { title: "更新时间", key: 'updatedAt',width:170,sortable:true},
                { title: '操作', key: 'action', slot: 'action', align: 'center',width:180}
                ],
            question_datas: [],
            question_form:{
                title: '',
                isImportant: 0,
                images: [],
                options:[
                    { code:'A',content:'',value:'' },
                    { code:'B',content:'',value:'' },
                    { code:'C',content:'',value:'' },
                    { code:'D',content:'',value:'' }
                ],
                oldType:1,
                type: 1,
                subjects:[],
                comments:''
            },
            rightMultiAnswer: [],
            rightAnswer:'',
            ruleValidate: {
                subjects:  [{ required: true, message: '请选择科目/章节', trigger: 'change', 
                            validator: (rule, value, callback) => {
                                if(value.length==0){
                                    callback(new Error('请选择科目/章节'))
                                } else {
                                    callback()
                                }
                            }
                }],
                type:  [{ required: true, message: '请选择题型', trigger: 'change',validator: verification.validateIsNull }],
                title:  [{ required: true, message: '请输入题干', trigger: 'blur' },{ required: true, message: '请输入题干', trigger: 'change' }],
                options:  [{ required:true, trigger: 'change',validator: (rule, value, callback) => { self.validateOptions(rule, value, callback, self)}},
                            { required:true, trigger: 'blur', validator:  (rule, value, callback) => { self.validateOptions(rule, value, callback, self)}}],
                comments:  [{ required: true, message: '请输入答案解析', trigger: 'blur' },{ required: true, message: '请输入答案解析', trigger: 'change' }],
            },
            // options:[],
            init_data:"",
            maxIndex: 0,// 最大索引值
            question_id:"0",
            isUploadData: false, // 是否上传
            isShowDetail: false, // 是否查看
            show_window:false,
            window_title:"新增试题"
        }
    },
    computed:{
        
    },
    mounted() {
        var self = this
        this.init_data=JSON.stringify(this.question_form)
        this.page_list(this.page)
        this.bindSubjectTree()
        
        var query = new this.ParseServer.Query("TestQuestions")
        query.descending('createdAt')
        query.first().then(res=>{
            if(res){
                self.maxIndex = res.get('index')
            } else {
                self.maxIndex = 0
            }
        })
    },
    methods: {
        handleDownLoad(){
        },
        /** 添加试题 */
        handleAddQuestion(){
            this.show_window = true
            this.question_form = {
                title: '',
                isImportant: 0,
                images: [],
                options:[
                    { code:'A',content:'',value:'' },
                    { code:'B',content:'',value:'' },
                    { code:'C',content:'',value:'' },
                    { code:'D',content:'',value:'' }
                ],
                oldType:1,
                type: 1,
                subjects:[],
                comments:''
            }
            this.rightMultiAnswer = []
            this.rightAnswer = ''
        },
        /** 查看题目 */
        handleShowQuestion(row){
            this.isShowDetail = true
            let _comments = row.comments.replace(/<img/g,"<img style='max-width:100%;height:auto;'")
            this.showComments = _comments
            this.question_form = {
                title: row.title,
                isImportant: row.isImportant,
                images: row.images,
                options: row.options,
                oldType: row.type,
                type: row.type,
                subjects: row.subjects,
                comments: row.comments
            }
        },
        /** 编辑试题 */
        handleEditQuestion(row) {
            this.show_window = true
            this.question_form = {
                id: row.id,
                title: row.title,
                isImportant: row.isImportant,
                images: row.images,
                options: row.options,
                oldType: row.type,
                type: row.type,
                subjects: row.subjects,
                comments: row.comments
            }
            row.options.forEach((item)=>{
                if(item.value=='1'){
                    this.rightMultiAnswer.push(item.code)
                    this.rightAnswer = item.code
                }
            })
        },
        /**
         * 切换题型
         */
        handleQuesTypeChange(){
            var type = this.question_form.type
            if(type == 1||type==2) {
                if(this.question_form.oldType==3) {
                    this.question_form.options=[
                        { code:'A',content:'',value:'1' },
                        { code:'B',content:'',value:'' },
                        { code:'C',content:'',value:'' },
                        { code:'D',content:'',value:'' }
                    ]
                } else {
                    this.question_form.options.forEach((_item,_index)=>{
                        _item.value = ''
                    })
                    this.rightAnswer = ''
                    this.rightMultiAnswer = []
                }
            } else {
                this.initAnswers()
            }
            this.question_form.oldType = type
        },
        /** 构造填空题的答案 */
        initAnswers(){
            if(this.question_form.type == 3){
                let txt = eval("/____/ig")
                var count = this.question_form.title.indexOf('____')==-1?0: this.question_form.title.match(txt).length;
                let _options = []
                for(var i = 0; i < count; i++) {
                    _options.push({code:'A',content:'',value:[{txt:''}]})
                }
                this.question_form.options = _options
            }
        },
        /** 添加答案 */
        addCOptions(option){
            var type = this.question_form.type
            if(type == 1||type==2) {
                this.question_form.options.push(
                    { code: this.code[this.question_form.options.length] ,content:'',value:'' },
                )
            } else {
                option.value.push({txt:''})
                console.log(option)
            }
        },
        /** 选择正确答案 */
        changeAnswer() {
            var self = this
            self.question_form.options.forEach((_item,_index)=>{
                if(self.question_form.type==1) {
                    if(_item.code == self.rightAnswer){
                        _item.value='1'
                    } else {
                        _item.value=''
                    }
                } else if(self.question_form.type == 2) {
                    if(self.rightMultiAnswer.indexOf(_item.code) != -1){
                        _item.value='1'
                    } else {
                        _item.value=''
                    }
                }
            })
        },
        /** 答案输入验证 */
        validateOptions: (rule, value, callback, self) => {
            let _question_form = self.question_form
            let hasNullContent = false
            let answerCount = 0
            value.forEach((_option, _index)=>{
                if(_question_form.type==3){
                    _option.value.forEach((_val)=>{
                        if(!_val.txt){
                            hasNullContent = true
                        }
                    })
                } else {
                    if((_question_form.type == 1 || _question_form.type == 2)&&!_option.content){
                        hasNullContent = true
                    }
                    if(_option.value=='1'){
                        answerCount++
                    }
                }
            })
            if(value.length==0&&_question_form.type==3){
                callback(new Error('还没有需要填空的'))
            }
            if(hasNullContent){
                callback(new Error('请输入答案'))
            }
            console.log('answerCount:'+answerCount)
            if(answerCount==0&&_question_form.type==1) {
                callback(new Error('请选择正确答案'))
            } else if(answerCount < 2 && _question_form.type==2) {
                callback(new Error('请选择至少两个正确答案'))
            } else {
                callback()
            }
        },
        /** 删除答案 */
        removeCOption(option, _idx){
            var type = this.question_form.type
            if(type == 1||type==2) {
                let _options = []
                this.question_form.options.forEach((item,index)=>{
                    if(item.code != option.code){
                        item.code = this.code[_options.length]
                        _options.push(item)
                    }
                })
                this.question_form.options = _options
            } else {
                let txts = []
                option.value.forEach((item,index)=>{
                    if(_idx != index) {
                        txts.push(item)
                    }
                })
                option.value = txts
            }
        },
        /** 插入填空 */
        async insertInputTxt() {
            var txt = '____'
             const myField = document.querySelector('#title textarea');
            if(myField.selectionStart || myField.selectionStart === 0) {
                let startPos = myField.selectionStart;
                let endPos = myField.selectionEnd;
                this.question_form.title = myField.value.substring(0, startPos) + txt
                            + myField.value.substring(endPos, myField.value.length);
                await this.$nextTick() // 这句是重点, 圈起来
                myField.focus();
                myField.setSelectionRange(endPos + txt.length, endPos + txt.length);
            } else {
                this.question_form.title = txt;
            }
            this.question_form.options.push({
                code:'A',content:'',value:[{txt:''}]
            })
        },
        /**
         * 图片上传完成
         */
        handleUploadComplate(urls){
            this.question_form.images = urls
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
        * 保存题目
        * 作者：gzt
        * 时间：2020-11-21 23:41:37
        */
        add_questions(){
            var self = this
            var questions=this.ParseServer.Object.extend("TestQuestions")
            var question=new questions()
            if(this.question_form.id){
                question.set('id', this.question_form.id)
                let realName = this.ParseServer.User.current().get('realname')
                question.set('updatedBy', realName)
            } else {
                question.set('index', self.maxIndex + 1)
            }
            this.$refs['form'].validate(valid => {
                if (!valid) {
                    self.$Message.error('请检查表单项')
                    self.modalLoading = false
                    setTimeout(() => {
                        self.modalLoading = true
                    }, 100)
                    return false
                } else {
                    question.set('title',self.question_form.title)
                    question.set("subjects",self.question_form.subjects)
                    question.set("isImportant",self.question_form.isImportant)
                    question.set("type",self.question_form.type)
                    question.set("options",self.question_form.options)
                    question.set("comments",self.question_form.comments)
                    question.set("images",self.question_form.images)
                    question.save().then((qres)=>{
                        self.maxIndex++
                        self.$Message.success('保存成功')
                        self.page_list(1)
                        self.cancel()
                    },(error)=>{
                        debugger
                        self.$Message.error('保存失败')
                    })
                }
            })
        },
        /** 加载树形科目 */
        bindSubjectTree(){
            var self = this
            var query = new this.ParseServer.Query("Subjects")
            query.ascending('createdAt')
            query.find().then(res=>{
                this.subjects = res
                var tree = self.initSubjectTree(res,'0')
                self.subjectTreeData = tree
            })
        },
        /** 构造树形科目 */
        initSubjectTree(subjects, parentId){
            var self = this
            var treeValue = []
            let _subjects = subjects.filter((_item)=>{
                return _item.get('parent_ID') == parentId
            })
            _subjects.forEach((_subject, _index)=> {
                let subject = {
                    title: _subject.get('subject_name'),
                    value: _subject.id,
                }
                let childrens = subjects.filter(_item=>{
                    return _item.get('parent_ID') == _subject.id
                })
                if(childrens.length>0){
                    subject.children = self.initSubjectTree(subjects, _subject.id)
                }
                treeValue.push(subject)
            })
            return treeValue
        },
        /**
         * @description  解析表格文件数据，返回表格中内容，目前暂不支持导入有单元格合并的表格
         * @param    {Object} file    导入的文件，二进制数据流
         * @returns  {Object} data    返回的表格数据
         * @returns  {Array}  data.title   表头
         * @returns  {Array}  data.body    表格数据
         */
        importFromLocal(file) {
            var self = this
            return new Promise(function (resolve, reject) {
                self.readerWorkBookFromLocal(file).then(workBook=>{
                    let workSheet = workBook.Sheets[workBook.SheetNames[0]]
                    let content = utils.sheet_to_json(workSheet)
                    let data = {};
                    data.title = Object.keys(content[0]);
                    data.body = content;
                    resolve(data)
                })
            })
        },
        /**
         * @description              本地读取文件的方法
         * @param {Object} file      文件流
         */
        readerWorkBookFromLocal(file) {
            const reader = new FileReader();
            reader.readAsBinaryString(file);
            return new Promise(function (resolve, reject) {
                reader.onload = function (e) {
                    const fileData = e.target.result;
                    if (reader.readyState === 2) {
                        const workBook = XLSX.read(fileData, { type: 'binary' });
                        resolve(workBook);
                    } else {
                        reject('读取文件失败');
                    }
                }
            })
        },
        /** 读取excel中的图片 */
        readExcelImg(file){
            return new Promise(function (resolve, reject) {
                var new_zip = new JsZip();
                new_zip.loadAsync(file).then(function() {
                    var rels = new_zip.file("xl/drawings/_rels/drawing1.xml.rels")
                    if(rels){
                        rels.async("string").then(con=> {
                            var _x2js = new x2js()
                            var pathData = _x2js.xml2js(con)
                            new_zip.file("xl/drawings/drawing1.xml").async("string").then(function (areaContent) {
                                var areaData = _x2js.xml2js(areaContent)
                                var rowcell = Array.isArray(areaData.wsDr.twoCellAnchor)?areaData.wsDr.twoCellAnchor:[areaData.wsDr.twoCellAnchor]
                                var pics = []
                                rowcell.forEach((_item,_index)=>{
                                    let colIndex = _item.from.col.__text
                                    let rowIndex = _item.from.row.__text
                                    let Id = _item.pic.blipFill.blip["_r:embed"]
                                    let ships = Array.isArray(pathData.Relationships.Relationship)?pathData.Relationships.Relationship:[pathData.Relationships.Relationship]
                                    let _parhdata = ships.find(p=>{
                                        return p._Id == Id
                                    })
                                    let flename = _parhdata._Target.substring(_parhdata._Target.lastIndexOf('/')+1,_parhdata._Target.length)
                                    pics.push({col: parseInt(colIndex), row: parseInt(rowIndex), id: Id, path: _parhdata._Target, filename: flename})
                                })
                                resolve(pics)
                            })
                        });
                    } else {
                        resolve(null)
                    }
                })
            });
        },
        /** 上传图片 */
        uploadImg(excelfile, fileName){
            var self = this
            var new_zip = new JsZip();
            return new Promise(function (resolve, reject) {
                new_zip.loadAsync(excelfile).then(function() {
                    new_zip.file('xl/media/'+fileName).async("base64").then(img=>{
                        var parseFile = new self.ParseServer.File('excelimg.jpg',{base64:img});
                        parseFile.save().then(res=>{
                            if(res._url) {
                                resolve(res._url)
                            } else {
                                self.$Message.error("图片上传失败");
                            }
                        })
                    })
                })
            })
        },
        /**
         * 导入模板
         */
        handleUpload(e){
            var self = this
            var excelFile = e[0]
            self.readExcelImg(excelFile).then(imgs=>{
                if(imgs.length > 0) {
                    imgs.forEach(img=>{
                        // self.uploadImg(img.filename).then(url=>{})
                    })
                }
                self.importFromLocal(excelFile).then(res=>{
                    let data = []
                    res.body.forEach((item, index)=>{
                        var img = imgs.find(t=>{
                            return (t.row-1) == index
                        })
                        data.push({
                            subjects:item["科目ID\n（多项以英文,隔开）"],
                            title:item["题目\n4个英文下划线(_)代表一个填空"],
                            isImportant:item['是否重点\n(是、否)'],
                            type:item['题型\n（单选、多选、填空）'],
                            comments:item["题目解析"],
                            rightAnswer:item["正确答案\n（多选以英文,隔开）\n填空题除外"],
                            option1:item["选项1\n（填空题请在此处输入填空1的正确答案，有备选答案请用英文,隔开）"],
                            option2:item["选项2\n（填空题请在此处输入填空2的正确答案，有备选答案请用英文,隔开）"],
                            option3:item["选项3\n（填空题请在此处输入填空3的正确答案，有备选答案请用英文,隔开）"],
                            option4:item["选项4\n（填空题请在此处输入填空4的正确答案，有备选答案请用英文,隔开）"],
                            option5:item["选项...\n（填空题请在此处输入填空4的正确答案，有备选答案请用英文,隔开）"],
                            imgFileName:img? img.filename:''
                        })
                        self.uploadCount = data.length
                    })
                    // var list = []
                    
                    var Questions = self.ParseServer.Object.extend("TestQuestions")
                    let _subjectIndex = self.maxIndex + 1
                    data.forEach((ques,index)=>{
                        // var _subject = self.subjects.find((_item,_index)=>{
                        //     return _item.id == ques.subjects
                        // })
                        var question = new Questions()
                        var _subjects = ques.subjects.split(',')
                        if(_subjects.length > 0) {
                            question.set('subjects', _subjects)
                        }
                        let _type = (ques.type=='单选'?1:(ques.type=='多选'?2:(ques.type=='填空'?3:0)))
                        question.set('title', ques.title)
                        question.set('comments', ques.comments)
                        question.set('isImportant', (ques.isImportant=='是'?1:0))
                        question.set('type', _type)
                        question.set('index', _subjectIndex)
                        question.set('options', self.getOptions(ques,_type))
                        if(ques.imgFileName){
                            self.uploadImg(excelFile, ques.imgFileName).then(url=>{
                                question.set('images', [url])
                                question.save().then(_question=>{
                                    // self.isUploadData = false
                                    self.page_list()
                                    self.maxIndex += 1
                                    self.uploadIndex +=1
                                    _subjectIndex++
                                })
                            })
                        } else {
                            question.save().then(_question=>{
                                // self.isUploadData = false
                                self.page_list()
                                self.maxIndex += 1
                                self.uploadIndex +=1
                                _subjectIndex++
                            })
                        }
                    })
                })
            })

            return ''
        },
        /**
         * 构造options
         */
        getOptions(question,type) {
            var self = this
            let options = []
            if(question.option1){
                options.push(self.buildOption(type,'A',question.rightAnswer?(question.rightAnswer.indexOf('A')==-1?'':'1'):'',question.option1))
            }
            if(question.option2){
                options.push(self.buildOption(type,'B',question.rightAnswer?(question.rightAnswer.indexOf('B')==-1?'':'1'):'',question.option2))
            }
            if(question.option3){
                options.push(self.buildOption(type,'C',question.rightAnswer?(question.rightAnswer.indexOf('C')==-1?'':'1'):'',question.option3))
            }
            if(question.option4){
                options.push(self.buildOption(type,'D',question.rightAnswer?(question.rightAnswer.indexOf('D')==-1?'':'1'):'',question.option4))
            }
            if(question.option5){
                options.push(self.buildOption(type,'E',question.rightAnswer?(question.rightAnswer.indexOf('E')==-1?'':'1'):'',question.option5))
            }
            return options
        },
        buildOption(type,code, value, option){
            if(type==3){
                let values=[]
                let txts = option.split(',')
                txts.forEach(txt=>{
                    if(txt){
                        values.push({txt:txt})
                    }
                })
                return { code: code, value: values, content: ''}
            } else {
                return { code: code, value: value, content: option}
            }
        },
        /*
        *富文本编辑框的内容发生变化
        *作者：gzt
        *时间：2020-11-22 00:37:46
        */
        change_value(html){
            this.question_form.comments = html=='<p><br></p>'?'':html
            this.$refs['form'].validate()
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
            this.page_list(this.page) 
        },
        /*
        *分页加载数据
        *作者：gzt
        *时间：2020-11-21 23:30:27
        */
        page_list(){
            var self = this
            let _this=this
            
            let query1 = new this.ParseServer.Query("TestQuestions");
            query1.contains("objectId", this.search_ID);

            let query2 = new this.ParseServer.Query("TestQuestions");
            if(this.search_subject_name){
                let subjectIds = []
                this.subjects.forEach((sub,idx)=>{
                    if(sub.get('subject_name').indexOf(self.search_subject_name)!=-1){
                        subjectIds.push(sub.id)
                    }
                })
                query2.containedIn("subjects", subjectIds); // 科目名称
            }

            let query3 = new this.ParseServer.Query("TestQuestions");
            if(this.search_type && this.search_type!=-1){
                query3.equalTo("type", this.search_type);
            }

            let query4 = new this.ParseServer.Query("TestQuestions");
            if(this.search_updateBy){
                query4.contains("updatedBy", this.search_updateBy); // 更新人
            }

            let query5 = new this.ParseServer.Query("TestQuestions");
            if(this.search_important && this.search_important!=-1){
                query5.equalTo("isImportant", this.search_important);
            }

            let query = this.ParseServer.Query.and(query1,query2, query3,query4, query5);

            // let query = new this.ParseServer.Query('TestQuestions')
            query.descending("updatedAt")
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
                            id: item.id,
                            subjects: item.get('subjects'),
                            images: item.get('images'),
                            type: item.get('type'),
                            title: item.get("title"),
                            options: item.get('options'),
                            comments: item.get('comments'),
                            isImportant: item.get('isImportant'),
                            updatedBy: item.get('updatedBy'),
                            updatedAt:  tool.dateFormat(item.updatedAt, 'yyyy-MM-dd HH:mm:ss')
                        })
                    })
                }
                this.loading=false
            })
        },
        /** 获取科目名称 */
        getSubjectName(id){
            var subject = this.subjects.find(item=>{
                return item.id == id
            })
            return subject?subject.get('subject_name'):'';
        },
        /** 获取答案 */
        getRightAnswer(options){
            var _rightAnswer = ''
            options.forEach(item=>{
                if(item.value=='1'){
                    _rightAnswer += item.code
                }
            })
            return _rightAnswer
        },
        /*
        * 删除题目
        *作者：gzt
        *时间：2020-11-22 08:41:53
        */
        handleRemove(row){
            let _this=this
            this.$Modal.confirm({
                    title: '删除提示',
                    content: '<p>确定删除当前试题吗？</p>',
                    onOk: () => {
                        var query = new this.ParseServer.Query("TestQuestions")
                        query.get(row.id).then((response)=>{
                            // 删除当前题目
                            response.destroy().then((delete_result)=>{
                                _this.$Message.success('删除成功')
                                _this.page_list(1)
                            })
                        })
                    },
                    onCancel: () => {
                        // this.$Message.info('取消了操作');
                    }
                });
        },
    }
}
</script>

<style lang="less" scoped>
    .optionItem{
        display: flex;
    }
    .optionItem .code{
        width: 20px;
        text-align: center;
    }
    .optionItem .content{
        flex: 1;
    }
    .optionItem .right{
        width: 100px;
        text-align: center;
    }
    .optionItem .del{
        width: 60px;
        display: flex;
    }
    .optionItem .del div{
        flex: 1;
        text-align: center;
    }

    
.search-wrap {
  float: left;
  width: 60%;
  .search-keyword {
    float: left;
    width: 40%;
  }
  .select-choice {
    float: left;
    width: 35%;
    span {
      width: 20%;
      display: inline-block;
      box-sizing: border-box;
      line-height: 36px;
      padding: 0 10px;
      text-align: right;
    }
    .choice {
      width: 80%;
    //   float: right;
    }
  }
  .search-btn {
    float: left;
    width: 20%;
    margin: 0 20px;
  }
}

.operation-wrap {
  width: 40%;
  float: left;
  .func {
    // float: right;
    margin-left: 10px;
  }
}
.comments{
    overflow-y: auto;
    width: 400px!important;
}
</style>
