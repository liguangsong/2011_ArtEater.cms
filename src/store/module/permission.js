// import { constantRouterMap } from '@/router'
import constantRouterMap from '@/router/routers'
import lazyLoading from '@/libs/lazyLoading'
// import Layout from '@/views/layout/Layout'
import Main from '@/view/main'
import parentView from '@/components/parent-view'

function GenerateMenu (menus, item) {
  if (item) {
    var menu = {
      path: item.path,
      component: Main,
      redirect: item.redirect,
      name: item.name,
      permissionInfos: item.permissionInfos,
      meta: { title: item.meta.title, icon: item.meta.icon, hideInMenu: item.meta.hideInMenu, permissionInfos: item.permissionInfos  }
    }
    AddChildrenMenu(item, menu)
    menus.push(menu)
  }
}

function AddChildrenMenu (item, menu) {
  if (item.children && item.children.length) {
    menu.children = []
    item.children.filter(chd => {
      if (chd) {
        var cMenu = {
          path: chd.path,
          component: chd.component === 'parentView' ? parentView : lazyLoading(chd.href),
          name: chd.name,
          permissionInfos: chd.permissionInfos,
          meta: { title: chd.meta.title, icon: chd.meta.icon, hideInMenu: chd.meta.hideInMenu, permissionInfos: chd.permissionInfos }
        }
        AddChildrenMenu(chd, cMenu)
        menu.children.push(cMenu)
      }
    })
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const { modules } = data
        const accessedRouters = []
        if (modules && modules.length > 0) {
          var menus = modules[0].children
          if (menus && menus.length > 0) {
            menus.filter(item => {
              GenerateMenu(accessedRouters, item)
            })
          }
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    ClearRoutes ({commit}) {
      const accessedRouters = []
      commit('SET_ROUTERS', accessedRouters)
    }
  }
}

export default permission
