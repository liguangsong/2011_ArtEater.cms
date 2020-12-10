<template>
  <Layout style="height: 100%" class="main">

    <Header class="header-con">
      <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
        <div class="logo-box">
          <img src="../../assets/images/logo@4.png" />
        </div>
        <ul class="menu-navlist">
          <li v-for="(item,index) in firstNav" :key="index" @click="routeTo(index, item.children, item.name)" :class="{'active':isSelect==index}">
            <a>
              <Icon :type="item.meta.icon || ''" :size="35"></Icon>
              <p>{{item.meta.title}}</p>
            </a>
          </li>
        </ul>
        <user :size="12" :user-avator="userAvator" :userNamess="userName" />
      </header-bar>
    </Header>
    <Layout>
      <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
        <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
          <div class="logo-title">
            <span v-show="!collapsed">食艺兽管理平台</span>
            <sider-trigger :class="{'text-center':collapsed}" :collapsed="collapsed" icon="md-menu" @on-change="handleCollapsedChange"></sider-trigger>
          </div>
        </side-menu>
      </Sider>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <Card>
            <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb>
          </Card>
          <Content class="content-wrapper">
            <keep-alive :include="NavList">
              <router-view  v-if="isRouterAlive" />
            </keep-alive>
          </Content>
        </Layout>
      </Content>

    </Layout>
      <Footer class="layout-footer-center footer">©2020 版权所有：食艺兽</Footer>
    </Layout>
</template>
<script>
import siderTrigger from './components/header-bar/sider-trigger'
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import {mapMutations, mapActions} from 'vuex'
import {getNextRoute, routeEqual} from '@/libs/util'
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo.jpg'
import userlogo from '@/assets/images/user.png'
import customBreadCrumb from './components/header-bar/custom-bread-crumb'
import './main.less'
import { urlConfig } from '@/api/urlconfig'

export default {
  name: 'Main',
  components: {
    siderTrigger,
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    User,
    customBreadCrumb
  },
  data () {
    return {
      isRouterAlive: true,
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false,
      isSelect: 0,
      firstNav: this.$store.getters.menuList,
      userName: '系统管理员',
      menuList: this.$store.getters.menuList[0].children
    }
  },
  provide() {
    return {
      reload:this.reload
    }
  },
  computed: {
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvator () {
      var userinfo = JSON.parse(sessionStorage.getItem('UserInfo'))
      if (userinfo != null) {
        if (userinfo.headIcon != null && userinfo.headIcon !== '') {
          return userinfo.headIcon
        } else {
          return userlogo
        }
      }
      return userlogo
    },
    NavList () {
      return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
    },
    local () {
      return this.$store.state.app.local
    },
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal'
    ]),
    ...mapActions([
      'handleLogin'
    ]),
    handleCollapsedChange (e) {
      this.collapsed = !this.collapsed
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick( () => {
        this.isRouterAlive = true;
      })
    },
    turnToPage (routeName) {
      let { name, params, query } = {}
      if (typeof routeName === 'string') name = routeName
      else {
        name = routeName.name
        params = routeName.params
        query = routeName.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },

    handleCloseTag (res, type, route) {
      let openName = ''
      if (type === 'all') {
        this.turnToPage('home')
        openName = 'home'
      } else if (routeEqual(this.$route, route)) {
        if (type === 'others') {
          openName = route.name
        } else {
          const nextRoute = getNextRoute(this.tagNavList, route)
          this.$router.push(nextRoute)
          openName = nextRoute.name
        }
      }
      // this.setTagNavList(res)
      this.$refs.sideMenu.updateOpenName(openName)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    openHelp () {
      var href = urlConfig().helpUrl
      window.open(href, '_blank')
    },
    routeTo (index, children, name) {
      this.isSelect = index
      this.menuList = children
      this.$router.push({
        name
      })
    },
    handleCollpasedChangeslide (state) {
      this.$emit('on-coll-change', state)
    }
  },
  watch: {
    '$route' (newRoute) {
      this.setBreadCrumb(newRoute.matched)
      //  this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
    }
  },
  mounted () {
    // this.setTagNavList()
    this.addTag({
      route: this.$store.state.app.homeRoute
    })
    this.setBreadCrumb(this.$route.matched)
    this.setLocal(this.$i18n.locale)
    var userinfo = JSON.parse(sessionStorage.getItem('UserInfo'))
    if (userinfo != null) {
      this.userName = userinfo.realName + '(' + userinfo.loginName + ')'
    } else {
      this.$router.push({path:'/login'})
    }
  }
}
</script>
