import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { urlConfig } from '@/api/urlconfig'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const router = new Router({
    routes,
    mode: 'history',
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
            "path": "/subjectsmanage",
            "name": "subjectsmanage",
            "redirect": "subjectsmanage/subjectsmanageindex",
            "meta": {
                "icon": "ios-apps",
                "title": "科目管理",
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
                    "title": "科目列表",
                    "hideInMenu": false,
                    "showAlways": true
                },
                "component": "subjectsmanage/index.vue",
                "permissionInfos": [

                ],
                "children": null,
                "href": "subjectsmanage/index.vue",
                "level": 1
            }],
            "href": null,
            "level": 1
        },
        {
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
                }
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
                "Id": "6bf2e9c0-9e84-4eb0-9575-7968feb89afe",
                "path": "restquestionsindex",
                "name": "restquestionsindex",
                "redirect": null,
                "meta": {
                    "icon": "ios-list-box-outline",
                    "title": "试题列表",
                    "hideInMenu": false,
                    "showAlways": true
                },
                "component": "testquestions/index.vue",
                "permissionInfos": [

                ],
                "children": null,
                "href": "testquestions/index.vue",
                "level": 1
            }],
            "href": null,
            "level": 1
        },
        {
            "Id": "2312asda-231321-adada-q2e12easda",
            "path": "/exampaper",
            "name": "exampaper",
            "redirect": "exampaper/exampaperindex",
            "meta": {
                "icon": "ios-school",
                "title": "考试管理",
                "hideInMenu": false,
                "showAlways": true
            },
            "component": "Main",
            "permissionInfos": [

            ],
            "children": [{
                "Id": "erwerfs-24234-zdfsdf-23xdvsds",
                "path": "exampaperindex",
                "name": "exampaperindex",
                "redirect": null,
                "meta": {
                    "icon": "ios-list-box-outline",
                    "title": "试卷列表",
                    "hideInMenu": false,
                    "showAlways": true
                },
                "component": "exampaper/index.vue",
                "permissionInfos": [

                ],
                "children": null,
                "href": "exampaper/index.vue",
                "level": 1
            }],
            "href": null,
            "level": 1
        },
        {
            "Id": "zdfs-12432sdfs-sdfsf-23xdfs-sdfs",
            "path": "/message",
            "name": "message",
            "redirect": "message/messageindex",
            "meta": {
                "icon": "ios-school",
                "title": "消息中心",
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
                    "icon": "ios-list-box-outline",
                    "title": "消息列表",
                    "hideInMenu": false,
                    "showAlways": true
                },
                "component": "message/index.vue",
                "permissionInfos": [],
                "children": null,
                "href": "message/index.vue",
                "level": 1
            }],
            "href": null,
            "level": 1
        },
        {
            "Id": "1232-asda-q2q3-zsd-a-dsa-231-asd",
            "path": "/opinion",
            "name": "opinion",
            "redirect": "opinion/opinionindex",
            "meta": {
                "icon": "ios-school",
                "title": "意见反馈",
                "hideInMenu": false,
                "showAlways": true
            },
            "component": "Main",
            "permissionInfos": [

            ],
            "children": [{
                "Id": "zfdwsrf-23423-sdfs-23423",
                "path": "opinionindex",
                "name": "opinionindex",
                "redirect": null,
                "meta": {
                    "icon": "ios-list-box-outline",
                    "title": "反馈列表",
                    "hideInMenu": false,
                    "showAlways": true
                },
                "component": "opinion/index.vue",
                "permissionInfos": [],
                "children": null,
                "href": "opinion/index.vue",
                "level": 1
            }],
            "href": null,
            "level": 1
        }

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
            store.dispatch('GenerateRoutes', { modules }).then(() => { // 根据roles权限生成可访问的路由表
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