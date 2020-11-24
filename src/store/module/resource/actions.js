import api from '../../../api/interceptor_api.js'
import { Message } from 'iview'
import { isEmpty } from '../../../libs/util'
const actions = {
  // 添加资源
  async create_resource ({ commit }, params) {
    let result = await api.create_resource(params)
    return result
  },
  // 资源列表
  async get_resourcelist ({ commit }) {
    let result = await api.resourcelist()
    let value = result.data
    if (value.error === 0) {
      if (!isEmpty(value.resource_list)) {
        commit('set_resourcelist', value.resource_list)
        commit('set_total_count', value._count)
      } else {
        commit('set_resourcelist', [])
        commit('set_total_count', 0)
      }
    } else {
      commit('set_resourcelist', [])
      commit('set_total_count', 0)
      Message.error({
        content: '信息获取失败！',
        duration: 5
      })
    }
  },
  //   编辑角色
  async updata_resource ({ commit }, params) {
    let result = await api.updata_resource(params)
    return result
  },
  // 删除资源
  async delete_resource ({ commit }, params) {
    let result = await api.delete_resource(params)
    return result
  }
}

export default actions
