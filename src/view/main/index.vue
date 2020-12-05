<template>
  <div class="bg">
    <div class="title">欢迎来到食艺兽管理后台</div>
  </div>
</template>

<script>
// import Example from './example.vue'
export default {
  name: "home",
  data() {
    return {}
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.bg{
  width: 100%;
  // height: 100%;
  // background-image: url('../../assets/images/shenhe-bg.png');
  background-size: cover;
  background-position: center;
  text-align: center;
}
.title{
   padding-top: 250px;
  color: #515a6e;
  font-size: 60px;
  display: inline-block;
  vertical-align: middle;
}
</style>
