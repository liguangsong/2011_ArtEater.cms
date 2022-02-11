import axios from 'axios'
import Cookies from 'js-cookie'
import config from '@/config'
const baseUrl =
  process.env.NODE_ENV === 'development'
    ? config.baseUrl.dev
    : config.baseUrl.pro
axios.defaults.baseURL = baseUrl
let csrftoken = Cookies.get('csrfToken')
var instance = axios.create()

// 在实例已创建后修改默认值
//   instance.defaults.headers.common['x-csrf-token'] = 6666;
// axios.defaults.headers.common['x-csrf-token'] = csrftoken;
instance.interceptors.request.use(
  config => {
    config.headers.common['x-csrf-token'] = csrftoken
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
export default {
  // 登录
  login (params) {
    return instance.post('/api/v1/user/login', params)
  }

}
