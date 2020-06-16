<template>
  <div class="layout-box">
    <navbar>
      <breadcrumb slot="breadcrumb" :breadcrumb="breadcrumb"></breadcrumb>
      <template slot="navbar-btn-area">
        <div class="btn-router" @click="refresh"><i class="fa  fa-refresh"></i></div>
        <div class="btn-router" style="cursor: default"><i class="fa  fa-user"></i>&nbsp;{{nickname}}</div>
        <div class="btn-router"><a href="javascript:" @click="logout" style="color: #000"><i class="fa fa-sign-out"></i>&nbsp;退出登录</a></div>
      </template>
    </navbar>
    <menua :menus="menus" :project-name="project_name"></menua>
    <div class="layout-main">
      <div class="layout-main-inner">
        <slot></slot>
      </div>
    </div>

    <toast ref="toast"></toast>
  </div>
</template>

<script>
import Breadcrumb from '../mod/Breadcrumb'
// 不能用这种方式，可能是Menu.vue组件里有menu字冲突了，import Menu from '../mod/Menu'
import Menua from '../mod/Menu'
import Navbar from '../mod/Navbar'
import DropdownMenu from '../mod/DropdownMenu'
import Toast from '../mod/Toast'

import config from '../../utils/config/config'
import api from '../../utils/config/api'
import network from '../../utils/base/network'
import authorize from '../../utils/base/authorize'

export default {
  name: 'LayoutMain',
  components: {Menua, Navbar, DropdownMenu, Breadcrumb, Toast},
  data: function () {
    return {
      project_name: config.project_name
    }
  },
  computed: {
    menus: function () {
      return this.$store.state.menus
    },
    breadcrumb: function () {
      return this.$store.state.breadcrumb
    },
    nickname: function () {
      return this.$store.state.user.nickname
    },
    username: function () {
      return this.$store.state.user.username
    }
  },
  mounted: function () {
  },
  methods: {
    clearCache: function () {
      network.post(api.clear_cache).then(() => {
        this.$toast({title: '缓存清除成功,请刷新页面'})
      }).catch(msg => {
        this.$toast({title: msg, type: 'error'})
      })
    },
    logout: function () {
      network.post(api.logout).then(() => {
        authorize.clearToken()
        this.$store.commit('CLEAR_USER_INFO')
        // 采取跳转目的是为了清空router，因为之前采取了addRouter，但是没法清除，只能刷新页面
        window.location.href = config.login_path
        // this.$router.push({path:config.login_path})
      }).catch(msg => {
        this.$toast({title: msg, type: 'error'})
      })
    },
    pre () {
      this.$router.back()
    },
    next () {
      this.$router.forward()
    },
    refresh () {
      window.location.reload()
    }
  }
}
</script>

<style scoped lang="less">
  .layout-box {
    width: 100%;
    height: 100%;
    .nvabar {
      width: 100%;
      height: 60px;
      background-color: rebeccapurple;
    }
    .layout-main {
      width: 100%;
      padding-left: 210px;
      padding-top: 66px;
      .layout-main-inner {
        width: 100%;
        min-height: 800px;
        background-color: white;
        padding: 15px 15px 50px;
      }
    }
  }
  .btn-clear-cache {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    cursor: pointer;
    &:hover {
      background-color: #eee;
    }
  }
  .btn-router {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    cursor: pointer;
  }

  .navbar-dropdown {
    .dropdown-toggle {
      &:hover {
        background-color: #eee !important;
      }

      .open& {
        background-color: #eee !important;
      }

    }
  }
</style>
