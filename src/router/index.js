import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import {
  urlConfig
} from '@/api/urlconfig'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new Router({
  routes,
  mode: 'hash', // history
  base: urlConfig().VirtualDir
})
const LOGIN_PAGE_NAME = 'login'
const modules = [{
  "Id": "75344096-4aec-4e13-833b-1b6707947811",
  "path": "",
  "name": "system",
  "redirect": "",
  "meta": {
    "icon": "",
    "title": "管理平台",
    "hideInMenu": false,
    "showAlways": true
  },
  "component": null,
  "permissionInfos": [

  ],
  "children": [{
      "Id": "1b9da043-6a2b-4531-123123-1231313131",
      "path": "/usermanage",
      "name": "usermanage",
      "redirect": "usermanage/usermanageindex",
      "meta": {
        "icon": "ios-people",
        "title": "用户管理",
        "hideInMenu": false,
        "showAlways": true
      },
      "component": "Main",
      "permissionInfos": [

      ],
      "children": [{
          "Id": "1312-sdfs-w3rwe-xgsdfs-2342432",
          "path": "studentindex",
          "name": "studentindex",
          "redirect": null,
          "meta": {
            "icon": "ios-list-box-outline",
            "title": "学生管理",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "usermanage/student.vue",
          "permissionInfos": [

          ],
          "children": null,
          "href": "usermanage/student.vue",
          "level": 1
        }, {
          "Id": "1231231-1231zcsa-124dzcsdfvs-q342zxfczx",
          "path": "usermanageindex",
          "name": "usermanageindex",
          "redirect": null,
          "meta": {
            "icon": "ios-list-box-outline",
            "title": "后台账号管理",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "usermanage/index.vue",
          "permissionInfos": [

          ],
          "children": null,
          "href": "usermanage/index.vue",
          "level": 1
        },
        {
          "Id": "1231231-1231zcsa-124dzcsdfvs-q342zxfczy",
          "path": "operatingmember",
          "name": "operatingmember",
          "redirect": null,
          "meta": {
            "icon": "ios-list-box-outline",
            "title": "运营专用会员",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "usermanage/operatingmember.vue",
          "permissionInfos": [

          ],
          "children": null,
          "href": "usermanage/operatingmember.vue",
          "level": 1
        },
        {
          "Id": "1312-sdfs-w3rwe-xgsdfs-2342432",
          "path": "memberindex",
          "name": "memberindex",
          "redirect": null,
          "meta": {
            "icon": "ios-list-box-outline",
            "title": "会员管理",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "usermanage/member.vue",
          "permissionInfos": [

          ],
          "children": null,
          "href": "usermanage/member.vue",
          "level": 1
        }
      ],
      "href": null,
      "level": 1
    },
    {
      "Id": "1b9da043-6a2b-4531-123123-1231313131",
      "path": "/homesetting",
      "name": "homesetting",
      "redirect": "homesetting/homemodule",
      "meta": {
        "icon": "ios-people",
        "title": "首页设置",
        "hideInMenu": false,
        "showAlways": true
      },
      "component": "Main",
      "permissionInfos": [

      ],
      "children": [{
        "Id": "zfdwsrf-23423-sdfs-234d4",
        "path": "setbanner",
        "name": "setbanner",
        "redirect": null,
        "meta": {
          "icon": "ios-browsers",
          "title": "轮播图设置",
          "hideInMenu": false,
          "showAlways": true
        },
        "component": "setting/setbanner.vue",
        "permissionInfos": [],
        "children": null,
        "href": "setting/setbanner.vue",
        "level": 1
      },{
          "Id": "1312-sdfs-w3rwe-xgsdfs-2342432",
          "path": "homemodule",
          "name": "homemodule",
          "redirect": null,
          "meta": {
            "icon": "ios-list-box-outline",
            "title": "首页模块名称",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "homesetting/homemodule.vue",
          "permissionInfos": [

          ],
          "children": null,
          "href": "homesetting/homemodule.vue",
          "level": 1
        },
        //每日新知
        {
          "Id": "1312-sdfs-w3rwe-xgsdfs-2342433",
          "path": "dailyknowledge",
          "name": "dailyknowledge",
          "redirect": null,
          "meta": {
            "icon": "ios-list-box-outline",
            "title": "每日新知",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "homesetting/dailyknowledge.vue",
          "permissionInfos": [

          ],
          "children": null,
          "href": "homesetting/dailyknowledge.vue",
          "level": 1
        },
        //课程试听
        {
          "Id": "1312-sdfs-w3rwe-xgsdfs-2342433",
          "path": "courselistening",
          "name": "courselistening",
          "redirect": null,
          "meta": {
            "icon": "ios-list-box-outline",
            "title": "课程试听",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "homesetting/courselistening.vue",
          "permissionInfos": [

          ],
          "children": null,
          "href": "homesetting/courselistening.vue",
          "level": 1
        },
        //默认封面图
        {
          "Id": "1312-sdfs-w3rwe-xgsdfs-2342434",
          "path": "defaultcover",
          "name": "defaultcover",
          "redirect": null,
          "meta": {
            "icon": "ios-list-box-outline",
            "title": "默认封面图",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "homesetting/defaultcover.vue",
          "permissionInfos": [

          ],
          "children": null,
          "href": "homesetting/defaultcover.vue",
          "level": 1
        },
        //公告栏
        {
          "Id": "1312-sdfs-w3rwe-xgsdfs-2342434",
          "path": "bulletinboard",
          "name": "bulletinboard",
          "redirect": null,
          "meta": {
            "icon": "ios-list-box-outline",
            "title": "公告栏",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "homesetting/bulletinboard.vue",
          "permissionInfos": [

          ],
          "children": null,
          "href": "homesetting/bulletinboard.vue",
          "level": 1
        },
        {
          "path": "videoindex",
          "name": "videoindex",
          "redirect": null,
          "meta": {
            "icon": "ios-list-box-outline",
            "title": "推荐阅读",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "subjectsmanage/videoindex.vue",
          "permissionInfos": [

          ],
          "children": null,
          "href": "subjectsmanage/videoindex.vue",
          "level": 1
        }
      ],
      "href": null,
      "level": 1
    },

    {
      "path": "/subjectsmanage",
      "name": "subjectsmanage",
      "redirect": "subjectsmanage/curriculummodule",
      "meta": {
        "icon": "ios-apps",
        "title": "课程管理",
        "hideInMenu": false,
        "showAlways": true
      },
      "component": "Main",
      "permissionInfos": [

      ],
      "children": [
        //课程管理
        {
          "path": "curriculummodule",
          "name": "curriculummodule",
          "redirect": null,
          "meta": {
            "icon": "ios-list-box-outline",
            "title": "课程管理",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "subjectsmanage/curriculummodule.vue",
          "permissionInfos": [

          ],
          "children": null,
          "href": "subjectsmanage/curriculummodule.vue",
          "level": 1
        },
        // 淘客管理
        {
          "path": "coursesindex",
          "name": "coursesindex",
          "redirect": null,
          "meta": {
            "icon": "ios-list-box-outline",
            "title": "套课管理",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "subjectsmanage/coursesindex.vue",
          "permissionInfos": [

          ],
          "children": null,
          "href": "subjectsmanage/coursesindex.vue",
          "level": 1
        },

        {
          "path": "videolist",
          "name": "videolist",
          "redirect": null,
          "meta": {
            "icon": "ios-list-box-outline",
            "title": "视频列表",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "subjectsmanage/videolist.vue",
          "permissionInfos": [

          ],
          "children": null,
          "href": "subjectsmanage/videolist.vue",
          "level": 1
        },

        {
          "path": "labelmanagement",
          "name": "labelmanagement",
          "redirect": null,
          "meta": {
            "icon": "ios-list-box-outline",
            "title": "标签管理",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "subjectsmanage/labelmanagement.vue",
          "permissionInfos": [

          ],
          "children": null,
          "href": "subjectsmanage/labelmanagement.vue",
          "level": 1
        },
      ],
      "href": null,
      "level": 1
    },
    {
      "Id": "1b9da043-6a2b-4531-a2b9-00b20ac953c8",
      "path": "/testquestions",
      "name": "testquestions",
      "redirect": "testquestions/restquestionsindex",
      "meta": {
        "icon": "ios-paper",
        "title": "试题管理",
        "hideInMenu": false,
        "showAlways": true
      },
      "component": "Main",
      "permissionInfos": [

      ],
      "children": [{
        "path": "subjectsmanageindex",
        "name": "subjectsmanageindex",
        "redirect": null,
        "meta": {
          "icon": "ios-list-box-outline",
          "title": "科目管理",
          "hideInMenu": false,
          "showAlways": true
        },
        "component": "subjectsmanage/index.vue",
        "permissionInfos": [

        ],
        "children": null,
        "href": "subjectsmanage/index.vue",
        "level": 1
      },{
        "Id": "6bf2e9c0-9e84-4eb0-9575-7968feb89afe",
        "path": "restquestionsindex",
        "name": "restquestionsindex",
        "redirect": null,
        "meta": {
          "icon": "ios-list-box-outline",
          "title": "试题管理",
          "hideInMenu": false,
          "showAlways": true
        },
        "component": "testquestions/index.vue",
        "permissionInfos": [

        ],
        "children": null,
        "href": "testquestions/index.vue",
        "level": 1
      }, {
        "Id": "erwerfs-24234-zdfsdf-23xdvsds",
        "path": "exampaperindex",
        "name": "exampaperindex",
        "redirect": null,
        "meta": {
          "icon": "ios-list-box-outline",
          "title": "组卷管理",
          "hideInMenu": false,
          "showAlways": true
        },
        "component": "exampaper/index.vue",
        "permissionInfos": [

        ],
        "children": null,
        "href": "exampaper/index.vue",
        "level": 1
      }, {
        "Id": "erwerfs-24234-zdfsdf-23xdvsds",
        "path": "oldexams",
        "name": "oldexams",
        "redirect": null,
        "meta": {
          "icon": "ios-list-box-outline",
          "title": "历年真题",
          "hideInMenu": false,
          "showAlways": true
        },
        "component": "exampaper/oldexams.vue",
        "permissionInfos": [

        ],
        "children": null,
        "href": "exampaper/oldexams.vue",
        "level": 1
      }],
      "href": null,
      "level": 1
    },
    {
      "Id": "2312asda-231321-adada-w2e12easda",
      "path": "/setting",
      "name": "setting",
      "redirect": "setting/messageindex",
      "meta": {
        "icon": "ios-settings",
        "title": "设置",
        "hideInMenu": false,
        "showAlways": true
      },
      "component": "Main",
      "permissionInfos": [

      ],
      "children": [{
          "Id": "erwerfs-24234-zdfsdf-23xdvsds",
          "path": "messageindex",
          "name": "messageindex",
          "redirect": null,
          "meta": {
            "icon": "md-notifications-outline",
            "title": "消息中心",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "message/index.vue",
          "permissionInfos": [],
          "children": null,
          "href": "message/index.vue",
          "level": 1
        }, {
          "Id": "zfdwsrf-23423-sdfs-23423",
          "path": "opinionindex",
          "name": "opinionindex",
          "redirect": null,
          "meta": {
            "icon": "ios-list-box-outline",
            "title": "意见反馈",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "opinion/index.vue",
          "permissionInfos": [],
          "children": null,
          "href": "opinion/index.vue",
          "level": 1
        },
        //  {
        //   "Id": "zfdwsrf-23423-sdfs-23423",
        //   "path": "setprice",
        //   "name": "setprice",
        //   "redirect": null,
        //   "meta": {
        //     "icon": "logo-usd",
        //     "title": "功能收费",
        //     "hideInMenu": false,
        //     "showAlways": true
        //   },
        //   "component": "setting/setprice.vue",
        //   "permissionInfos": [],
        //   "children": null,
        //   "href": "setting/setprice.vue",
        //   "level": 1
        // },
        {
          "Id": "zfdwsrf-23423-sdfs-23424",
          "path": "setconfig",
          "name": "setconfig",
          "redirect": null,
          "meta": {
            "icon": "md-settings",
            "title": "数据设置",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "setting/setconfig.vue",
          "permissionInfos": [],
          "children": null,
          "href": "setting/setconfig.vue",
          "level": 1
        }, {
          "Id": "zfdwsrf-23423-sdfs-23425",
          "path": "sharebg",
          "name": "sharebg",
          "redirect": null,
          "meta": {
            "icon": "md-settings",
            "title": "分享图设置",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "setting/sharebg.vue",
          "permissionInfos": [],
          "children": null,
          "href": "setting/sharebg.vue",
          "level": 1
        },
        //会员设置
        {
          "Id": "zfdwsrf-23423-sdfs-23426",
          "path": "member",
          "name": "member",
          "redirect": null,
          "meta": {
            "icon": "md-settings",
            "title": "会员设置",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "setting/member.vue",
          "permissionInfos": [],
          "children": null,
          "href": "setting/member.vue",
          "level": 1
        }
      ],
      "href": null,
      "level": 1
    },
    {
      "Id": "2312asda-231321-adada-w2e12easda",
      "path": "/activity",
      "name": "activity",
      "redirect": "activity/activityindex",
      "meta": {
        "icon": "md-aperture",
        "title": "活动",
        "hideInMenu": false,
        "showAlways": true
      },
      "component": "Main",
      "permissionInfos": [

      ],
      "children": [{
          "Id": "erwerfs-24234-zdfsdf-23xdvsds",
          "path": "activityindex",
          "name": "activityindex",
          "redirect": null,
          "meta": {
            "icon": "ios-aperture",
            "title": "活动打包",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "activity/activity.vue",
          "permissionInfos": [],
          "children": null,
          "href": "activity/activity.vue",
          "level": 1
        },
        // {
        //   "Id": "zfdwsrf-23423-sdfs-23423",
        //   "path": "couponindex",
        //   "name": "couponindex",
        //   "redirect": null,
        //   "meta": {
        //     "icon": "md-pricetag",
        //     "title": "优惠券",
        //     "hideInMenu": false,
        //     "showAlways": true
        //   },
        //   "component": "activity/coupon.vue",
        //   "permissionInfos": [],
        //   "children": null,
        //   "href": "activity/coupon.vue",
        //   "level": 1
        // },
        {
          "Id": "zfdwsrf-23423-sdfs-23423",
          "path": "newCoupon",
          "name": "newCoupon",
          "redirect": null,
          "meta": {
            "icon": "md-pricetag",
            "title": "新优惠券",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "activity/newCoupon.vue",
          "permissionInfos": [],
          "children": null,
          "href": "activity/newCoupon.vue",
          "level": 1
        },
        
        {
          "Id": "zfdwsrf-23423-sdfs-23423",
          "path": "activitymanagement",
          "name": "activitymanagement",
          "redirect": null,
          "meta": {
            "icon": "md-pricetag",
            "title": "活动管理",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "activity/activitymanagement.vue",
          "permissionInfos": [],
          "children": null,
          "href": "activity/activitymanagement.vue",
          "level": 1
        },
        {
          "Id": "zfdwsrf-23423-sdfs-23423",
          "path": "channelmanagement",
          "name": "channelmanagement",
          "redirect": null,
          "meta": {
            "icon": "md-pricetag",
            "title": "渠道管理",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "activity/channelmanagement.vue",
          "permissionInfos": [],
          "children": null,
          "href": "activity/channelmanagement.vue",
          "level": 1
        },
        {
          "Id": "zfdwsrf-23423-sdfs-23423",
          "path": "pullnewlist",
          "name": "pullnewlist",
          "redirect": null,
          "meta": {
            "icon": "md-pricetag",
            "title": "拉新列表",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "activity/pullnewlist.vue",
          "permissionInfos": [],
          "children": null,
          "href": "activity/pullnewlist.vue",
          "level": 1
        }
      ],
      "href": null,
      "level": 1
    },
    {
      "path": "/recordmanage",
      "name": "recordmanage",
      "redirect": "recordmanage/couponrecord",
      "meta": {
        "icon": "ios-apps",
        "title": "记录",
        "hideInMenu": false,
        "showAlways": true
      },
      "component": "Main",
      "permissionInfos": [

      ],
      "children": [
        //记录管理
        {
          "path": "couponrecord",
          "name": "couponrecord",
          "redirect": null,
          "meta": {
            "icon": "ios-list-box-outline",
            "title": "优惠券记录",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "recordmanage/couponrecord.vue",
          "permissionInfos": [

          ],
          "children": null,
          "href": "recordmanage/couponrecord.vue",
          "level": 1
        },
        {
          "Id": "1231231-1231zcsa-124dzcsdfvs-q342zxfczy",
          "path": "customerorders",
          "name": "customerorders",
          "redirect": null,
          "meta": {
            "icon": "ios-list-box-outline",
            "title": "用户订单",
            "hideInMenu": false,
            "showAlways": true
          },
          "component": "usermanage/customerorders.vue",
          "permissionInfos": [

          ],
          "children": null,
          "href": "usermanage/customerorders.vue",
          "level": 1
        },
      ],
      "href": null,
      "level": 1
    },

  ],
  "href": "",
  "level": 1
}]
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  var token = ''
  var account = ''
  var userId = ''
  var loginout = ''
  var userinfo = JSON.parse(sessionStorage.getItem('UserInfo'))
  if (userinfo != null) {
    token = userinfo.token
    userId = userinfo.Id
    account = userinfo.userAccount
  }
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    if (to.meta.nologin) {
      next()
    } else {
      console.log(1)
      next()
    }
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    next() // 跳转
  } else {
    if (userinfo === null) {
      window.location.href = loginout
    } else {
      if (to.name === 'index') {
        store.dispatch('ClearRoutes').then(() => {})
      }
      store.dispatch('GenerateRoutes', {
        modules
      }).then(() => { // 根据roles权限生成可访问的路由表
        router.addRoutes(store.state.permission.addRouters) // 动态添加可访问路由表
        next()
      })
    }
  }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
