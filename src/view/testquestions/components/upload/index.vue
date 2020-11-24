<template>
    <div>
        <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
        <template v-if="item.status === 'finished'">
            <img :src="item.url">
            <div class="demo-upload-list-cover">
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
        </template>
        <template v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
    </div>
    <Upload
        ref="upload"
        :show-upload-list="false"
        :default-file-list="default_images"
        :on-success="handleSuccess"
        :format="['jpg','jpeg','png']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        multiple
        type="drag"
        :action="action"
        style="display: inline-block;width:58px;">
        <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="ios-camera" size="20"></Icon>
        </div>
    </Upload>
    </div>
    
</template>

<script>
export default {
        name:"uploadimages",
        props:{
            images:{
                type:Array,
                default:function(){
                    return []
                }
            },
            action:String
        },
        data () {
            return {
                visible: false,
                uploadList: []
            }
        },
        computed:{
            default_images(){
                return this.images
            }
        },

        watch:{
            uploadList:{
                handler:function(new_val,old_val) {
                    this.$emit("upload-success",new_val)
                },
                deep: true
            }
        },
        methods: {
            handleView (name) {
                this.visible = true;
            },
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
            },
            handleSuccess (res, file) {
                file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '格式错误',
                    desc: '暂且只支持jpg、png类型的图片'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '文件过大',
                    desc: '文件超过了2M的大小限制'
                });
            },
            handleBeforeUpload () {
                const check = this.uploadList.length < 5
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传5张照片哦'
                    });
                }
                return check;
            }
        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
        }
    }
</script>

<style lang="less" scoped>
</style>
