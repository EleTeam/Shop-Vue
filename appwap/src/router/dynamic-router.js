/*
* 动态路由的配置表
* 用于获取权限后，生成对应的路由，然后动态添加
* 添加新页面后，到此处进行配置
* 如果后台没有分配权限，就会跳到404页面
* 注意：必须要以下首节点的路由（path: '/'）这个路由，根目录导航到这里
*/
const routes = [
  {
    path: '_layout',
    name: '_layout',
    component: (resolve) => require(['@/pages/layout/Layout'], resolve),
    meta: {requiresAuth: true, noPermission: true},
    children: [
      {
        path: '/site/index',
        name: 'site-index',
        component: (resolve) => require(['@/pages/site/Index'], resolve),
        meta: {requiresAuth: false, noPermission: true}
      },
      {
        path: '/user/index',
        name: 'user-index',
        component: (resolve) => require(['@/pages/user/UserIndex'], resolve),
        meta: { requiresAuth: true }
      },
      {
        path: '/user/create',
        name: 'user-create',
        component: (resolve) => require(['@/pages/user/UserCreate'], resolve),
        meta: { requiresAuth: true }
      },
      {
        path: '/user/update',
        name: 'user-update',
        component: (resolve) => require(['@/pages/user/UserUpdate'], resolve),
        meta: { requiresAuth: true }
      },
      {
        path: '/user/update-password',
        name: 'user-update-password',
        component: (resolve) => require(['@/pages/user/UserUpdatePassword'], resolve),
        meta: { requiresAuth: true }
      },
      {
        path: '/user/update-any-password',
        name: 'user-update-any-password',
        component: (resolve) => require(['@/pages/user/UserUpdateAnyPassword'], resolve),
        meta: { requiresAuth: true }
      },
      {
        path: '/role/index',
        name: 'role-index',
        component: (resolve) => require(['@/pages/role/RoleIndex'], resolve),
        meta: { requiresAuth: true }
      },
      {
        path: '/role/create',
        name: 'role-create',
        component: (resolve) => require(['@/pages/role/RoleCreate'], resolve),
        meta: { requiresAuth: true }
      },
      {
        path: '/role/update',
        name: 'role-update',
        component: (resolve) => require(['@/pages/role/RoleUpdate'], resolve),
        meta: { requiresAuth: true }
      },
      {
        path: '/order/index',
        name: 'order-index',
        component: (resolve) => require(['@/pages/order/OrderIndex'], resolve),
        meta: { requiresAuth: true }
      }
    ]
  },
  { // 有动态路由时必须放在这里，且noPermission=true，否则找不到子路由或者页面不存在时无法定位到404页面
    path: '*',
    redirect: '/404',
    meta: {requiresAuth: false, noPermission: true}
  }
]

function generateRouteByPermission (routes, permission) {
  let filterRoutes = []
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].children && routes[i].children.length > 0) {
      let childRoutes = generateRouteByPermission(routes[i].children, permission)
      if (childRoutes.length > 0) {
        routes[i].children = childRoutes
        filterRoutes.push(routes[i])
      } else {
        routes[i].children = []
        if (routes[i].meta.noPermission || permission.indexOf(routes[i].path) > -1) {
          filterRoutes.push(routes[i])
        }
      }
    } else {
      if (routes[i].meta.noPermission || permission.indexOf(routes[i].path) > -1) {
        filterRoutes.push(routes[i])
      }
    }
  }
  return filterRoutes
}

export default {
  routes: routes,
  generateRouteByPermission: generateRouteByPermission
}
