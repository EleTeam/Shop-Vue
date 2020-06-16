<template>
  <div>
    <div class="row h44">
      <div class="col-xs-6">
        <form @submit.prevent="queryData" class="query form-inline">
          <input type="text" v-model="query.username" placeholder="用户名" class="form-control"/>
          <button-box type="search" @click="queryData"></button-box>
        </form>
      </div>
      <div class="col-xs-6 flex-end-center">
        <button-box type="add" to="/user/create" title="创建后台用户"></button-box>
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
        <td>{{props.item.role_name}}</td>
        <td>{{props.item.google_secret}}</td>
        <td>{{props.item.created_at}}</td>
        <td>
          <button-box type="edit" @click="updateAnyPassword(props.item)" title="修改密码"/>
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
  name: 'UserIndex',
  components: {TableBox, ButtonBox},

  ...pages,

  data: function () {
    return {
      query: {
        username: ''
      },
      table: {
        url: this.$api.user_index,
        multiSelect: false,
        keyName: 'id',
        columns: [
          {title: '商户', width: '180'},
          {title: '角色', width: '160'},
          {title: '谷歌密钥', width: '180'},
          {title: '创建时间', width: '140'},
          {title: '操作', width: '180'}
        ],
        parseData: function (data) {
        }
      }
    }
  },
  mounted: function () {
    let breadcrumb = [
      {link: '', title: '系统管理'},
      {link: '', title: '后台用户'}
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
        content: '确定删除后台用户 ' + item.nickname + ' 吗？',
        success: () => {
          this.$network.post(this.$api.user_delete, {'id': item.id}).then(resp => {
            if (resp.code === ResponseCode.SUCCESS) {
              this.$toast({'title': resp.msg})
              table.reload()
            } else {
              this.$toast({'title': resp.msg, 'type': 'error'})
            }
          })
        }
      })
    },
    updateAnyPassword: function (item) {
      this.$router.push({path: '/user/update-any-password', query: {id: item.id, nickname: item.nickname, username: item.username}})
    }
  }
}
</script>

<style lang="less" scoped>

</style>
