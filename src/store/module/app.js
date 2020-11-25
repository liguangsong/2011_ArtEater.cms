import { getBreadCrumbList, setTagNavListInLocalstorage, routeHasExist } from '@/libs/util'
// import routers from '@/router/routers'
export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {name: '食艺兽-管理平台'},
    local: ''
  },
  // getters: {
  //   menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access)
  // },
  mutations: {
    setBreadCrumb (state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched, state.homeRoute)
    },
    // setTagNavList (state, list) {
    //   if (list) {
    //     state.tagNavList = [...list]
    //     setTagNavListInLocalstorage([...list])
    //   } else state.tagNavList = getTagNavListFromLocalstorage()
    // },
    addTag (state, { route, type = 'unshift' }) {
      if (!routeHasExist(state.tagNavList, route)) {
        if (type === 'push') state.tagNavList.push(route)
        else {
          if (route.name === 'index') state.tagNavList.unshift(route)
          else state.tagNavList.splice(1, 0, route)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal (state, lang) {
      state.local = lang
    },
    setButtonList (state, routeMetched) {
      sessionStorage.setItem('buttonList', JSON.stringify(routeMetched.meta.permissionInfos))
    }
  }
}
