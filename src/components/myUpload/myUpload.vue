<template>
    <div>
        <div @click="before_upload" class="ivu-upload ivu-upload-drag" style="width:58px;">
            <input @change="processFiles()" ref="uploader" type="file" class="ivu-upload-input" />
            <div style="width: 58px; height: 58px; line-height: 58px;">
                <i class="ivu-icon ivu-icon-ios-camera" style="font-size: 20px;"></i>
            </div>
        </div>
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
            var name = "photo.jpg";
            var parseFile = new this.ParseServer.File(name, files[0].File);
            if(parseFile._url){
                this.$emit('complate', parseFile._url)
            } else {
                this.$Message.error("上传失败");
            }
        }
    },
    mounted() {
    }
};
</script>