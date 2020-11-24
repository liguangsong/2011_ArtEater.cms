import axios from 'axios'

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return config
  }
  distroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
    }
  }
  interceptors (instance, url) {
    instance.interceptors.request.use(config => {
      if (!Object.keys(this.queue).length) {
      }
      this.queue[url] = true
      // config.headers['Authorization'] = 'Bearer 2121'
      var loginUser = JSON.parse(sessionStorage.getItem('UserInfo'))
      if (loginUser) {
        config.headers['token'] = loginUser.token
      }
      return config
    }, error => {
      return Promise.reject(error)
    })
    instance.interceptors.response.use(res => {
      const { data, status } = res
      return { data, status }
    }, error => {
      this.distroy(url)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
