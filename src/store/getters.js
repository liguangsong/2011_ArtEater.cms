import { getMenuByRouter } from '@/libs/util'

const getters = {
  menuList: state => getMenuByRouter(state.permission.addRouters)
}
export default getters
