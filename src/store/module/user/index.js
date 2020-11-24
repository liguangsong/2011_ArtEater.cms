import actions from './actions.js'
import mutations from './mutations.js'
import { setToken, getToken } from '@/libs/util'
import Cookies from 'js-cookie'
// import util from '@/libs/util.js';

const user = {
  state: {
    name: '',
    // user_id: '1',
    access: [],
    token: '',
    avator: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png'
  },
  actions,
  mutations
}

export default user
