<template>
    <div style="display:flex;margin-top:5px">
        <div @click="before_upload" class="ivu-upload ivu-upload-drag">
            <input @change="processFiles()" ref="uploader" type="file" class="ivu-upload-input" />
            <slot>
                <div style="width: 38px; height: 38px; line-height: 38px;">
                    <i class="ivu-icon ivu-icon-ios-camera" style="font-size: 20px;"></i>
                </div>
            </slot>
        </div>
        <div style="margin-left:10px;color:#808695" v-if="tips">{{tips}}</div>
    </div>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            default: ''
        },
        multiple: {
            type: Boolean,
            default: false
        },
        tips:{
            type: String,
            default: ''
        },
        type:{
            type:String,
            default:'img'
        }
    },
    data() {
        return {
        };
    },
    methods: {
        before_upload(e){
            e.currentTarget.firstElementChild.click()
        },
        processFiles(e){
            var files = this.$refs.uploader.files
            if(this.type=='img'){
                var file = files[0]
                var name = file.name;
                var extendName = name.substring(name.lastIndexOf('.'),name.length)
                let filename = 'a'+extendName
                var parseFile = new this.ParseServer.File(filename, file);
                parseFile.save().then(res=>{
                    if(res._url){
                        this.$emit('complate', res._url)
                    } else {
                        this.$Message.error("上传失败");
                    }
                })
            } else {
                this.$emit('complate', files)
            }
        }
    },
    mounted() {
    }
};
</script>