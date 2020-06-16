<template>
  <div>
    <div class="row h44">
      <div class="col-xs-6">
        <form @submit.prevent="queryData" class="query form-inline">
          <input type="text" v-model="query.username" placeholder="用户名" class="form-control"/>
          <button-box type="search" @click="queryData"></button-box>
        </form>
      </div>
    </div>

    <table-box ref="tableBox" :url="table.url" :params="query" :columns="table.columns" :key-name="table.keyName"
               :parse-data="table.parseData" :data="table.data" :multi-select="table.multiSelect">
      <tr slot="row" slot-scope="props">
        <td class="tc">{{props.index}}</td>
        <td>
          <div><small>昵称: </small>{{props.item.nickname}}</div>
          <div><small>用户名: </small>{{props.item.username}}</div>
        </td>
        <td>
          <div><small>创建: </small>{{props.item.created_at}}</div>
          <div><small>更新: </small>{{props.item.updated_at}}</div>
        </td>
        <td>
            <button-box type="delete" @click="deleteItem(props.item)"/>
        </td>
      </tr>
    </table-box>
  </div>
</template>

<script>
import TableBox from '../../components/mod/TableBox'
import ButtonBox from '../../components/mod/ButtonBox'
import pages from '../../utils/base/pages'
import ResponseCode from '../../utils/consts/response_code.js'

export default {
  name: 'FuserIndex',
  components: {TableBox, ButtonBox},

  ...pages,

  data: function () {
    return {
      query: {
        username: ''
      },
      table: {
        url: this.$api.fuser_index,
        multiSelect: false,
        keyName: 'id',
        columns: [
          {title: '时间', width: '150'},
          {title: '操作', width: '180'}
        ],
        parseData: function (data) {
        }
      }
    }
  },
  mounted: function () {
    let breadcrumb = [
      {link: '', title: '用户管理'},
      {link: '', title: '用户列表'}
    ]
    this.$store.commit('SET_BREADCRUMB', breadcrumb)
  },
  methods: {
    queryData: function () {
      let table = this.$refs.tableBox
      table.reload()
      // let queryData={...this.query}
      // this.query=queryData
    },
    deleteItem: function (item) {
      let table = this.$refs.tableBox
      this.$confirm({
        content: '确定删除用户 ' + item.nickname + ' 吗？',
        success: () => {
          let url = this.$api.fuser_delete + '?id=' + item.id
          this.$network.post(url).then(resp => {
            if (resp.code === ResponseCode.SUCCESS) {
              this.$toast({'title': resp.msg})
              table.reload()
            } else {
              this.$toast({'title': resp.msg, 'type': 'error'})
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
