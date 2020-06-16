import * as type from './mutation-types.js'

export default {
  [type.SET_BREADCRUMB] (state, breadcrumb) {
    state.breadcrumb = breadcrumb
  },
  [type.SET_USER_INFO] (state, userinfo) {
    state.user = userinfo.user
    state.menus = userinfo.menus
    state.menus_loaded = true
  },
  [type.CLEAR_USER_INFO] (state) {
    state.user = []
    state.menus = []
    state.menus_loaded = false
  },
  [type.SET_ROUTER] (state, router) {
    state.router = router
  }
}
