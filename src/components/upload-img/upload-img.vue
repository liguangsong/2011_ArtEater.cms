<template>
    <div>
    <div class='demo-upload-list' v-for="(item) in uploadList">          
        <template v-if="item.status === 'finished'||item.status===undefined ">
            <img :src='item.url'>
            <div class='demo-upload-list-cover'>
                <Icon type='ios-eye-outline' @click.native='handleView(item.name)'></Icon>
                <Icon type='ios-trash-outline' @click.native='handleRemove(item)'></Icon>
            </div>
        </template>
        <template v-else>
            <Progress v-if='item.showProgress' :percent='item.percentage' hide-info></Progress>
        </template>
    </div>
        <Upload
        ref='upload'
        :show-upload-list='false'
        :default-file-list='defaultList'
        :on-success='handleSuccess'
        :format="['jpg','jpeg','png']"
        :max-size='2048'
        :on-format-error='handleFormatError'
        :on-exceeded-size='handleMaxSize'
        :before-upload='handleBeforeUpload'
        multiple
        type='drag'
        :action='uploadUrl'
        style='display:inline-block;width:58px;'>
         <div style="width:58px;height:58px;line-height:58px;">
            <Icon type="ios-camera" size="20"></Icon>
        </div>    
    </Upload>
    </div>   
</template>
<script>
import "./index.less";
import { isJson } from "@/api/tool";

export default {
  props: {
    uploadUrl: "",
    prefixUrl: "",
    maxLength:"",
    imgUrl:''
  },
  data() {
    return {
      defaultList: [
        // {
        //   name: 'a42bdcc1178e62b4694c830f028db5c0',
        //   url:
        //     'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
        // }
      ],
      imgName: "",
      uploadList: []
    };
  },
  methods: {
    handleView(name) {
      this.imgName = name;
      this.$Modal.info({
        title: "查看图片",
        width: 1024,
        content:
          "<div style='width:100%;height:100%;'>" +
          "<img src='" +
          this.prefixUrl +
          this.imgName +
          "'  style='width:100%;height:100%;padding-right:50px;'>" +
          "</div>",
        okText: "关闭"
      });
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      this.$emit("setUploadData", this.uploadList);
    },
    handleSuccess(res, file) {
      if (res != null && res != "" && res.Status == true) {
        file.url = this.prefixUrl + res.Result.Src;
        file.name = res.Result.Src;
        this.$emit("setUploadData", this.uploadList);
      } else {
        this.$Notice.warning({
          title: "上传异常",
          desc: "文件  " + file.name + " 上传失败，因为" + res.Message
        });
      }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式不正确",
        desc: file.name + "格式不正确，请选择JPG或PNG。"
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "超过文件大小限制",
        desc: "文件  " + file.name + " 超过大小限制,请上传小于2M的文件。"
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < this.maxLength;
      if (!check) {
        this.$Notice.warning({
          title: "上传失败！上传个数超过上限个数（"+this.maxLength+"）。"
        });
      }
      return check;
    },
    defaultJsonFn(jsoninfo) {  
      if (jsoninfo == "") {
        this.$refs.upload.fileList.splice(0, this.$refs.upload.fileList.length)
      } else if (jsoninfo) {
        this.$refs.upload.fileList.splice(0, this.$refs.upload.fileList.length)
        this.uploadList.splice(0,this.uploadList.length)
        this.$refs.upload.fileList.push(jsoninfo)
      } else {
        this.$refs.upload.fileList.splice(0, this.$refs.upload.fileList.length)
      }
      
    }
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList
  }
};
</script>