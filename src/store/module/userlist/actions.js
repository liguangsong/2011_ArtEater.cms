import api from '../../../api/interceptor_api.js'

const actions = {
  async userlist ({ commit }, params) {
    let result = await api.userlist(params)
    return result
  },
  // 添加用户
  async createUser ({ commit }, params) {
    let result = await api.create_user(params)
    return result
  },
  // 删除用户
  async delete_user ({ commit }, params) {
    let result = await api.delete_user(params)
    return result
  },
  // 修改用户角色
  async update_user_role ({ commit }, params) {
    let result = await api.update_user_role(params)
    return result
  }
}

export default actions
