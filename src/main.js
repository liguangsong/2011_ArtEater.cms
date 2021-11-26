// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'
import BaiduMap from 'vue-baidu-map'
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
import '@/assets/css/fnBase.css'
import '@/assets/css/animate.css'
import '@/assets/css/bootstrap.min.css'
import '@/assets/css/comon.css'
import VueQuillEditor from "vue-quill-editor";
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
Vue.use(VueQuillEditor)

import parse from 'parse'

// 注册parse-server服务
parse.serverURL = config.parse_server.PARSE_PUBLIC_SERVER_URL
parse.initialize(config.parse_server.PARSE_SERVER_APPLICATION_ID, config.parse_server.PARSE_SERVER_MASTER_KEY)
parse.masterKey = config.parse_server.Master_Key
Vue.prototype.ParseServer = parse


// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(BaiduMap, {
  /* 申请的百度密钥，可以在百度地图官网申请 */
  ak: '06kHBrtxTTQdX3KKe5KKlvZ57IMcEfe5'
})
Vue.config.productionTip = false
Vue.prototype.$config = config
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: {
    App
  },
  render: h => h(App),
})
