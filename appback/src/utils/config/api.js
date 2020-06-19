// 项目api地址
export default {
  baseUrl: process.env.API_ROOT,
  login: '/site/login',
  logout: '/site/logout',
  dashboard: '/site/dashboard',
  role_index: '/role/index',
  role_view: '/role/view',
  role_create: '/role/create',
  role_update: '/role/update',
  role_delete: '/role/delete',
  user_index: '/user/index',
  user_view: '/user/view',
  user_create: '/user/create',
  user_update: '/user/update',
  user_delete: '/user/delete',
  user_get_info: '/user/get-info',
  user_update_password: '/user/update-password',
  user_update_any_password: '/user/update-any-password',
  fuser_index: '/fuser/index',
  fuser_delete: '/fuser/delete',
  order_index: '/order/index',
  order_stat: '/order/stat',
  product_index: '/product/index',
  product_save: '/product/save',
  product_delete: '/product/delete',
  product_consts: '/product/consts'

  // menu_index: '/menu/index',
  // menu_save: '/menu/save',
  // menu_children: '/menu/children',
  // menu_rights: '/menu/rights',

  // 上传
  // upload_server: '/adm/v1/file/up', // 通过服务器上传的接口地址
  // upload_client: 'https://upload.qiniup.com', // 通过客户端直接上传到七牛云的接口地址
}
