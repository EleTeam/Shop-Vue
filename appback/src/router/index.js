/**
 * 静态路由
 */
import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/pages/site/Login'
import NoFind from '@/pages/site/404'
import Forbidden from '@/pages/site/403'
import config from '../utils/config/config'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // meta:属性不要用keepAlive: true，否则更换路由时不刷新页面
    {
      path: '/',
      redirect: config.index_path,
      meta: {requiresAuth: true}
    },
    {
      path: '/site/login',
      name: 'login',
      component: Login,
      meta: {requiresAuth: false}
    },
    {
      path: '/404',
      name: '404',
      component: NoFind,
      meta: {requiresAuth: false}
    },
    {
      path: '/403',
      name: '403',
      component: Forbidden,
      meta: {requiresAuth: false}
    }
  ]
})
