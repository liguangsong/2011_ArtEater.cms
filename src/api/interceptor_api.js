import instance from './interceptor.js'
const perUrl = '/api/v1'
export default {
  // 用户====================================================
  // 获取用户列表
  userlist (params) {
    return instance.get(perUrl + '/user/userlist?' + params)
  },
  // 添加用户
  create_user (params) {
    return instance.post(perUrl + '/user/create', params)
  },
  // 删除用户
  delete_user (params) {
    return instance.post(perUrl + '/user/delete', params)
  },
  // 修改用户角色
  update_user_role (params) {
    return instance.post(perUrl + '/users/updata', params)
  },
  // 文章====================================================
  // 创建文章
  create_article (params) {
    return instance.post(perUrl + '/article/create', params)
  },
  // 获取文章
  show_article (params) {
    return instance.get(perUrl + '/article' + params)
  },
  // 获取文章列表
  articlelist (params) {
    return instance.get(perUrl + '/article/articles?' + params)
  },
  // 编辑文章
  updata_article (params) {
    return instance.post(perUrl + '/article/updata', params)
  },
  // 删除文章
  delete_article (params) {
    return instance.post(perUrl + '/article/delete', params)
  },
  // 权限管理==================================================
  // 获取角色列表
  rolelist (params) {
    return instance.get(perUrl + '/role/showlist?' + params)
  },
  // 角色选项卡
  role_selectList (params) {
    return instance.get(perUrl + '/role/selectList')
  },
  // 创建角色
  create_role (params) {
    return instance.post(perUrl + '/role/create', params)
  },
  // 删除角色
  delete_role (params) {
    return instance.post(perUrl + '/role/delete', params)
  },
  // 编辑角色
  updata_role (params) {
    return instance.post(perUrl + '/role/updata', params)
  },
  // 编辑角色资源
  updata_power (params) {
    return instance.post(perUrl + '/role/updatapower', params)
  },
  // 资源管理==================================================
  // 获取资源列表
  resourcelist (params) {
    return instance.get(perUrl + '/resource/showlist')
  },
  // 创建资源
  create_resource (params) {
    return instance.post(perUrl + '/resource/create', params)
  },
  // 删除资源
  delete_resource (params) {
    return instance.post(perUrl + '/resource/delete', params)
  },
  // 编辑资源
  updata_resource (params) {
    return instance.post(perUrl + '/resource/updata', params)
  }
}
