<template>
    <div class="container-wrap">
        <div style="display:flex">
            <div style="flex:1">
                <Input v-model="search_keyword" size="large" placeholder="请输入试题名称" style="width: 400px" />
                <Button type="primary" class="search-btn" @click="search">搜索</Button></Col>
            </div>
            <div style="width:200px;text-align:right">
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
                    <strong>{{getRightAnswer(row.options)}}</strong>
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
                <Page :total="total" @on-change="page_list"  v-if="total!=0" />
            </div>
        </Row>
         <Modal v-model="show_window"
            :title="window_title"
            width="600"
            :loading='modalLoading'
            @on-ok="add_questions"
            @on-cancel="cancel">
            <Form ref="form" :model="question_form" label-position="right" :label-width="80" :rules="ruleValidate">
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
                    <UploadImage :images="question_form.images" :action="upload_address" @upload-success="upload_success"></UploadImage>
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
                    <Input  :rows="3" type="textarea" v-model="question_form.comments" placeholder="请输入答案解析"></Input>
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
                <FormItem label="试题图片">
                    <img src="@/assets/images/404.png" width="400px" />
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
                    <div>{{question_form.comments}}</div>
                </FormItem>
                <FormItem label="是否作为重点">
                    <div>{{question_form.isImportant==1?'是':'否'}}</div>
                </FormItem>
            </Form>
         </Modal>
         <Modal v-model="isUploadData" title="查看试题" width="600">
            <Form label-position="right" :label-width="100">
                <!-- <FormItem>
                    <a style="text-decoration: underline;color:blue;font-size:14px" @click="handleDownLoad" href="#">还没有模板吗？立即下载导入模板.xls</a>
                </FormItem> -->
                <FormItem>
                    <!-- <Upload :before-upload="handleUpload" action="//jsonplaceholder.typicode.com/posts/"> -->
                    <Upload action="">
                        <Button icon="ios-cloud-upload-outline">选择要导入的文件</Button>
                    </Upload>
                </FormItem>
            </Form>
         </Modal>
    </div>
</template> 

<script>
import Editor from "@/components/editor"
import UploadImage from "./components/upload/index"
// import Single from "./components/single/index"
// import Multi from "./components/multiselect/index"
import { urlConfig } from '@/api/urlconfig'
import selectTree from '@/components/iview-select-tree'
import { verification } from '@/api/verification'
import { tool } from '@/api/tool'
export default {
    name: "testquestions",
    components:{
        Editor,
        selectTree,
        UploadImage,
        // Single,
        // Multi
    },
    data() {
        var self = this
        return {
            code:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            page:1,
            pSize: 10,
            total: 0,
            loading: true,
            modalLoading: true,
            search_keyword:'',
            subjectTreeData:[],
            subjects:[], // 所有科目和章节信息
            columns: [
                { title: 'ID', key: 'id' },
                { title: '科目', key: 'subjects', slot: 'subjects' },
                { title: '类型', key: 'type', slot: 'type' },
                { title: '题干', key: 'title' },
                { title: "答案", key: 'answer', slot: 'answer' },
                // { title: "更新人", key: 'updatedAt'},
                { title: "更新时间", key: 'updatedAt'},
                { title: '操作', key: 'action', slot: 'action', align: 'center'}
                ],
            question_datas: [],
            question_form:{
                title: '',
                isImportant: 0,
                imaegs:"",
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
            question_id:"0",
            isUploadData: false, // 是否上传
            isShowDetail: false, // 是否查看
            show_window:false,
            window_title:"新增试题",
            upload_address:"http://1.w2wz.com/upload.php"
        }
    },
    computed:{
        images(){
            if (this.question_form.imaegs!=""){
                return this.question_form.images.split(',')
            }
            return []
        }
    },
    mounted() {
        this.init_data=JSON.stringify(this.question_form)
        this.page_list(this.page)
        this.bindSubjectTree()
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
                imaegs:"",
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
            this.question_form = {
                title: row.title,
                isImportant: row.isImportant,
                imaegs: row.images,
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
                imaegs: row.images,
                options: row.options,
                oldType: row.type,
                type: row.type,
                subjects: row.subjects,
                comments: row.comments
            }
            this.rightMultiAnswer = []
            this.rightAnswer = ''
            this.$refs['form'].validate()
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
                if(_item.code == self.rightAnswer&&self.question_form.type==1){
                    _item.value='1'
                }
                if(self.question_form.type == 2) {
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
                    question.set('title',this.question_form.title)
                    question.set("subjects",this.question_form.subjects)
                    question.set("isImportant",this.question_form.isImportant)
                    question.set("type",this.question_form.type)
                    question.set("options",this.question_form.options)
                    question.set("comments",this.question_form.comments)
                    question.set("images",this.question_form.images)
                    question.save().then((qres)=>{
                        this.$Message.success('保存成功')
                        this.page_list(1)
                        this.cancel()
                    },(error)=>{
                        this.$Message.error('保存失败')
                    })
                }
            })
        },
        /** 加载树形科目 */
        bindSubjectTree(){
            var self = this
            var query = new this.ParseServer.Query("Subjects")
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
            query.descending("createdAt")
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
                            type: item.get('type'),
                            title: item.get("title"),
                            options: item.get('options'),
                            comments: item.get('comments'),
                            isImportant: item.get('isImportant'),
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
                        debugger
                        query.get(row.id).then((response)=>{
                            // 删除当前题目
                            debugger
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
</style>
