<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "App",
  mounted () {
    if (window.history && window.history.pushState) {
        // 向历史记录中插入了当前页
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.goBack, false);
    }
},
  destroyed(){
    window.removeEventListener('popstate', this.goBack, false);
  },
  methods:{
    goBack () {
        // console.log("点击了浏览器的返回按钮");
        sessionStorage.clear();
        if(this.$router.history){
          // this.$router.go(-1)
        } else {
          // if (window.history){
          //   window.history.back();
          // }
        }
    },
  }
};
</script>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
