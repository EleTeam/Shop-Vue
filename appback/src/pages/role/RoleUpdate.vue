<template>
  <role-form></role-form>
</template>

<script>
import RoleForm from './RoleForm'

export default {
  name: 'RoleCreate',
  components: {RoleForm},
  mounted: function () {
    let breadcrumb = [
      {
        link: '#',
        title: '权限管理'
      },
      {
        link: '/role/index',
        title: '角色管理'
      },
      {
        link: '',
        title: '修改角色'
      }
    ]
    this.$store.commit('SET_BREADCRUMB', breadcrumb)
  }
}
</script>
