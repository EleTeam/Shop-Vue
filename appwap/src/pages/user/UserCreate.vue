<template>
  <user-form></user-form>
</template>

<script>
import UserForm from './UserForm'

export default {
  name: 'UserCreate',
  components: {UserForm},
  mounted: function () {
    let breadcrumb = [
      {link: '', title: '权限管理'},
      {link: '', title: '添加后台用户'}
    ]
    this.$store.commit('SET_BREADCRUMB', breadcrumb)
  }
}
</script>
