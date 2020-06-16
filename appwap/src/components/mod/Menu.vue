<template>
  <div class="menu">
    <div class="menu-name">{{projectName}}</div>
    <ul class="menu-list">
      <li :class="-1===curent_p_menu_index?'active':''">
        <a class="nav-item active" @click="toSiteIndex()"><i class="icon fa fa-dashboard"></i>首页</a>
      </li>
      <li v-for="(menu,index) in menus" :class="index===curent_p_menu_index?'active':''"  v-bind:key="index">
        <a class="nav-item" @click="changeMenu(index)">
          <i class="icon" :class="menu.icon"></i>{{menu.name}}
          <span class="fa arrow" :class="index===curent_p_menu_index?'fa-caret-up':'fa-caret-down'"></span>
        </a>
        <transition name="spread">
          <ul class="nav-second" v-show="index===curent_p_menu_index">
            <li v-for="(child,child_index) in menu.children" v-bind:key="child_index">
              <router-link class="nav-item" :class="index+'_'+child_index===curent_menu_index_str?'active fa fa-arrow-right':''" :to="child.route">
                {{child.name}}
              </router-link>
            </li>
          </ul>
        </transition>

      </li>
    </ul>
  </div>
</template>

<script>
import config from '../../utils/config/config'
export default {
  name: 'Menu',
  props: ['menus', 'projectName'],
  data: function () {
    return {
      curent_p_menu_index: -1, // 当前应该选中的导航，父级index, -1为未选中，整型
      curent_menu_index_str: '-1_-1' // 当前应该选中的导航，父级index_子级index，字符型, 点击一级菜单不变，只有点击二级菜单才改变
    }
  },
  mounted: function () {
    let currentPath = this.$route.path
    this.getMenuIndex(currentPath)
  },
  watch: {
    '$route': function (to, from) {
      let currentPath = to.path
      this.getMenuIndex(currentPath)
    }
  },
  methods: {
    toSiteIndex: function () {
      this.curent_p_menu_index = -1
      this.curent_menu_index_str = '-1_-1'
      this.$router.push(config.index_path)
    },
    changeMenu: function (index) {
      if (this.curent_p_menu_index === index) {
        // 如果点击的就是当前的，收起
        this.curent_p_menu_index = -1
      } else {
        this.curent_p_menu_index = index
      }
    },
    getMenuIndex: function (currentRoute) {
      for (let i = 0; i < this.menus.length; i++) {
        let children = this.menus[i].children
        for (let j = 0; j < children.length; j++) {
          let child = children[j]
          if (currentRoute === child.route) {
            this.curent_p_menu_index = i
            this.curent_menu_index_str = i + '_' + j
            return
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../less/variable";
  .menu {
    position: fixed;
    z-index: 1002;
    left: 0;
    top: 0;
    width: 200px;
    height: 100%;
    background-color: white;
    z-index: 10;
    .menu-name {
      width: 100%;
      background-color: @brand-color;
      line-height: 1.2;
      color: white;
      font-size: 20px;
      letter-spacing: 2px;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      border-bottom: 1px solid #e2e5ea;
    }
    .menu-list {
      padding-top: 10px;
      padding-bottom: 10px;
      li {
        &.active > .nav-item {
          /*background-color: #0caf87;*/
          border-left-color: #008afe;
          color: @brand-color;
          .icon {
            color: @brand-color;
          }
        }
        .nav-item {
          display: block;
          font-size: 14px;
          letter-spacing: 1px;
          padding: 16px 15px;
          color: #8d9199;
          cursor: pointer;

          .icon {
            margin-left: 10px;
            margin-right: 10px;
            color: #8d9199;
          }
          .arrow {
            float: right;
            padding-right: 15px;
          }
        }
        .nav-second {
          overflow: hidden;
          &.spread-enter-active {
            animation: spread .3s;
            animation-fill-mode: both;
          }
          &.spread-leave-active {
            animation: shrink .3s;
            animation-fill-mode: both;
          }
          .nav-item {
            padding: 10px 15px 10px 50px !important;
            /*padding-left: 50px !important;*/
            &.active {
              color: @brand-color;
              border-left: 4px solid @brand-color;
            }
          }
        }
      }
    }
  }
  @keyframes spread {
    0% {
      max-height: 0;
    }
    100% {
      max-height: 300px;
    }
  }
  @keyframes shrink {
    0% {
      max-height: 100px;
    }
    100% {
      max-height: 0;
    }
  }
</style>
