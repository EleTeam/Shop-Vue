<template>
  <div>
    <p id="test2">首页内容</p>
  </div>
</template>

<script>
import {SET_BREADCRUMB} from '../../store/mutation-types'

export default {
  name: 'Index',
  components: {},
  data: function () {
    return {}
  },
  methods: {},
  mounted: function () {
    let breadcrumb = [
      {
        link: '',
        title: '首页'
      }
    ]
    this.$store.commit(SET_BREADCRUMB, breadcrumb)
  }
}
</script>

<style lang="less" scoped>

</style>
