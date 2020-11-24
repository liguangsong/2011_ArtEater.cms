import actions from './actions.js'
import mutations from './mutations.js'
// import { setToken, getToken } from '@/libs/util'
// import Cookies from 'js-cookie';
// import util from '@/libs/util.js';

const resource = {
  state: {
    resourcelist: [], // 资源列表
    total_count: 0 // 分页总条数
  },
  actions,
  mutations
}

export default resource
