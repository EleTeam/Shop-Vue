<template>
  <div>
    <div class="row h44">
      <div class="col-xs-6"></div>
      <div class="col-xs-6 flex-end-center">
        <button-box type="add" to="/role/create" title="创建角色"></button-box>
      </div>
    </div>

    <table-box ref="tableBox" :url="table.url" :columns="table.columns" :key-name="table.keyName"
               :parse-data="table.parseData" :data="table.data" :multi-select="table.multiSelect">
      <tr slot="row" slot-scope="props">
        <td class="tc">{{props.index}}</td>
        <td>{{props.item.name}}</td>
        <td>{{props.item.description}}</td>
        <td>{{props.item.created_at}}</td>
        <td>
          <button-box type="edit" :to="'/role/update?name='+props.item.name"/>
          <button-box type="delete" @click="deleteItem(props.item)"/>
        </td>
      </tr>
    </table-box>
  </div>
</template>

<script>
import TableBox from '../../components/mod/TableBox'
import ButtonBox from '../../components/mod/ButtonBox'
import ResponseCode from '../../utils/consts/response_code.js'

export default {
  name: 'RoleIndex',
  components: {TableBox, ButtonBox},
  data: function () {
    return {
      table: {
        url: this.$api.role_index + '?sort=-created_at',
        multiSelect: false,
        keyName: 'name',
        columns: [
          {
            title: '角色名称',
            field: 'name',
            width: '100'
          },
          {
            title: '角色描述',
            field: 'description',
            width: '100'
          },
          {
            title: '添加时间',
            field: 'created_at',
            width: '100'
          },
          {
            title: '操作',
            field: '',
            width: '100'
          }
        ],
        parseData: function (data) {
          data.forEach(function (row) {
          })
        }
      }
    }
  },
  mounted: function () {
    let breadcrumb = [
      {
        link: '',
        title: '系统管理'
      },
      {
        link: '',
        title: '角色管理'
      }
    ]
    this.$store.commit('SET_BREADCRUMB', breadcrumb)
  },
  methods: {
    deleteItem: function (item) {
      let table = this.$refs.tableBox
      this.$confirm({
        content: '删除要操作角色（' + item.name + '）吗',
        success: () => {
          let url = this.$api.role_delete + '?name=' + item.name
          this.$network.post(url).then(resp => {
            if (resp.code === ResponseCode.SUCCESS) {
              this.$toast({title: resp.msg})
              table.refresh()
            } else {
              this.$toast({title: resp.msg, type: 'error'})
            }
          })
        }
      })
    },
    updateRole: function () {
      let table = this.$refs.tableBox
      let row = table.getSelectedRowData()[0]
      if (row === undefined) {
        this.$toast({
          title: '请选择一行数据'
        })
        return
      }
      this.$router.push({
        path: '/role/update',
        query: {
          name: row.name
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
