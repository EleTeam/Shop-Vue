<template>
  <div class="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
  @import "./less/grid";
  @import "./less/form";
  @import "./less/button";
  @import "./less/query";
  @import "./less/table";
  @import "./less/cli";
</style>
