import api from '../../../api/interceptor_api.js'
import { Message } from 'iview'
import { isEmpty } from '../../../libs/util'
const actions = {
  // 添加角色
  async create_role ({ commit }, params) {
    let result = await api.create_role(params)
    return result
  },
  // // 角色列表
  async get_rolelist ({ commit }, params) {
    let result = await api.rolelist(params)
    let value = result.data
    if (value.error === 0) {
      if (!isEmpty(value.role_list)) {
        commit('set_rolelist', value.role_list)
        commit('set_total_count', value._count)
      } else {
        commit('set_rolelist', [])
        commit('set_total_count', 0)
      }
    } else {
      commit('set_rolelist', [])
      commit('set_total_count', 0)
      Message.error({
        content: '信息获取失败！',
        duration: 5
      })
    }
  },
  // 角色选项卡列表
  async get_role_selectList ({ commit }) {
    let result = await api.role_selectList()
    let value = result.data
    if (value.error === 0) {
      if (!isEmpty(value.select_list)) {
        commit('set_role_select_list', value.select_list)
      } else {
        commit('set_role_select_list', [])
      }
    } else {
      commit('set_role_select_list', [])
      Message.error({
        content: '信息获取失败！',
        duration: 5
      })
    }
  },
  //   编辑角色
  async editor_role ({ commit }, params) {
    let result = await api.updata_role(params)
    return result
  },
  //   编辑角色资源
  async updata_power ({ commit }, params) {
    let result = await api.updata_power(params)
    return result
  },
  // 删除角色
  async delete_role ({ commit }, params) {
    let result = await api.delete_role(params)
    return result
  }
}

export default actions
