// ajax拦截器

import axios from 'axios'
import store from '../store/index'
import router from '../router/index'
import Cookies from 'js-cookie'
import config from '@/config'
import { Message } from 'iview'
const baseUrl =
  process.env.NODE_ENV === 'development'
    ? config.baseUrl.dev
    : config.baseUrl.pro
axios.defaults.baseURL = baseUrl
// 创建一个axios实例
const instance = axios.create()

// function getCookie(name) {
//     var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
//     if (arr = document.cookie.match(reg))
//         return unescape(arr[2]);
//     else
//         return null;
// }
// var csrftoken = getCookie('csrfToken');
// console.log(csrftoken);
// axios.defaults.headers.common['x-csrf-token'] = csrftoken;
// axios.interceptors.request.use = instance.interceptors.request.use;
// axios.interceptors.response.use = instance.interceptors.response.use;
// let csrftoken = Cookies.get('csrftoken');
// axios.defaults.headers.common['x-csrf-token'] = csrftoken;

// //request拦截器
instance.interceptors.request.use(
  config => {
    let token = Cookies.get('token')
    let csrftoken = Cookies.get('csrfToken')
    config.headers.common['x-csrf-token'] = csrftoken
    if (token) {
      config.headers.Authorization = `token,${token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
// respone拦截器
instance.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response
    }
  },
  error => {
    // 默认除了2XX之外的都是错误的，就会走这里
    console.log(error.response)
    if (error.response) {
      switch (error.response.status) {
        case 401:
          Message.error({
            content: '登录超时，为了系统信息安全，请重新登录！',
            duration: 5
          })
          store.dispatch('handleLogOut')
          router.replace({
            name: 'login',
            query: { redirect: 'redirect: router.currentRoute.fullPath' } // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })
          break
        case 403:
          Message.error({
            content: error.response.data.message,
            duration: 5
          })
      }
    }
    return Promise.reject(error.response)
  }
)

// 导出阻拦器
export default instance
