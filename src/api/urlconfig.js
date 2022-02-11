import '../../static/urlconfig'

export const urlConfig = () => {
  return {
    VirtualDir: process.env.NODE_ENV === 'development' ? '/admin/' : window.SysConfig.VirtualDir,
    mainApiUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8081/api/' : window.SysConfig.mainApiUrl,
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8081/' : window.SysConfig.baseUrl,
    helpUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8023/help/index.html' : window.SysConfig.helpUrl
    // mainApiUrl: 'http://172.16.40.250:8023/API/'
  }
}
