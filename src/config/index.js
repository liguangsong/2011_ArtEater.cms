export default {
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: 'http://localhost:8081/',
    pro: 'http://www.aoekids.cn/'
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 需要加载的插件
   */
  plugin: {},


  // parse-server服务相关链接配置
  parse_server: {
    // PARSE_PUBLIC_SERVER_URL: "http://101.200.34.189:1402/api/1",
    // PARSE_SERVER_APPLICATION_ID: "8IXBcjIkgHNQ2v9k",
    // PARSE_SERVER_MASTER_KEY: "1uGXsOnrM70ElEuwWaxm1lp1zsE6nxJj",
    // Master_Key: "LoOjxcEQS35Sr9QnAV3bOUaassBzScwM" // ParseConfig使用的

    PARSE_PUBLIC_SERVER_URL: "https://www.arteater.cn/api/1",
    PARSE_SERVER_APPLICATION_ID: "8IXBcjIkgHNQ2v9k",
    PARSE_SERVER_MASTER_KEY: "1uGXsOnrM70ElEuwWaxm1lp1zsE6nxJj",
    Master_Key: "LoOjxcEQS35Sr9QnAV3bOUaassBzScwM" // ParseConfig使用的
  }
}
