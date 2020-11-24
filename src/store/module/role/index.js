import actions from './actions.js'
import mutations from './mutations.js'
// import { setToken, getToken } from '@/libs/util'
// import Cookies from 'js-cookie';
// import util from '@/libs/util.js';

const role = {
  state: {
    rolelist: [], // 角色列表
    total_count: 0, // 分页总条数
    select_list: []
  },
  actions,
  mutations
}

export default role
