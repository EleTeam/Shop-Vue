<template>
  <user-form></user-form>
</template>

<script>
import UserForm from './UserForm'

export default {
  name: 'UserUpdate',
  components: {UserForm},
  mounted: function () {
    let breadcrumb = [
      {link: '', title: '系统管理'},
      {link: '', title: '修改后台用户'}
    ]
    this.$store.commit('SET_BREADCRUMB', breadcrumb)
  }
}
</script>
