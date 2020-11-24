import apiUser from '../../../api/off_interceptor_api.1'
import Cookies from 'js-cookie'
const actions = {
  // 登陆
  async login ({ commit }, params) {
    let result = await apiUser.login(params)
    return result
  },
  setname ({ commit }) {
    let name = Cookies.get('username')
    commit('set_name', name)
  },
  handleLogOut () {
    Cookies.remove('token')
    Cookies.remove('uuid')
    localStorage.clear()
  }
}

export default actions
