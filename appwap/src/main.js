// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import dynamicRouter from './router/dynamic-router'

import store from './store/index'

import vueXlsxTable from 'vue-xlsx-table'

import config from './utils/config/config'
import authorize from './utils/base/authorize'

import network from './utils/base/network'
import api from './utils/config/api'
import toastRegistry from './components/plugins/toast/index'
import confirmRegistry from './components/plugins/confirm/index'

Vue.config.productionTip = false

// 全局js引用
Vue.prototype.$api = api
Vue.prototype.$network = network

// 全局插件引用
Vue.use(toastRegistry)
Vue.use(confirmRegistry)
// vueXlsxTable必须要全局引用，否则该组件会报错，浏览器的FileReader API 有两个方法可以读取本地文件 readAsBinaryString 和 readAsArrayBuffer, 默认rABS为false，也就是使用readAsArrayBuffer
Vue.use(vueXlsxTable, {rABS: false})

// 全局路由钩子函数, 在跳转之前执行
router.beforeEach(async (to, from, next) => {
  document.title = process.env.PROJECT_NAME

  if (to.meta.requiresAuth === false) { // 不需要登录的直接放行
    // 不需要登录的直接放行
    console.log('1直接放行: ' + to.fullPath)

    next()
  } else if (!authorize.checkLogin()) { // 如果页面需要登录，且登录失效，进入登录页面
    console.log('2需要登录: ' + to.fullPath)

    next({
      path: config.login_path,
      query: { redirect: to.fullPath }
    })
  } else { // 已经登录
    console.log('3已经登录-load-menu: ' + to.fullPath)
    // 是否已经拉取menu，权限等信息
    if (!store.state.menus_loaded) { // 刷新浏览器才会运行
      await network.post(api.user_get_info, '', true).then(resp => {
        store.commit('SET_USER_INFO', resp.data)
        let routers = dynamicRouter.generateRouteByPermission(dynamicRouter.routes, resp.data.permissions)
        router.addRoutes(routers)
        next({ ...to, replace: true })
      }).catch(err => {
        // this.$toast({title: msg, type: 'error'}) // 不能用因为$toast还没加载
        err = '获取用户信息失败：' + err
        alert(err)
        // next() // 不能写在这里，因为如果报错的话，会一直运行到这里
      })
    } else {
      next()
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
