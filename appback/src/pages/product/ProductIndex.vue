<template>
  <div>
    <div class="">
      <form @submit.prevent="queryData" class="query">
        <div class="form-inline">
          <span class="col-3"><input v-model="query.id" placeholder="商品ID" class="form-control" style="width:180px;"/></span>
          <span class="col-3"><input v-model="query.name" placeholder="商品名称" class="form-control" style="width:180px;"/></span>
          <span class="col-3">
            <select v-model="query.type" class="form-control">
              <option value="">商品类型</option>
            </select>
          </span>
          <button-box type="search" @click="queryData"></button-box>
          <button-box style="margin-left: 10px" type="add" to="/product/save" title="添加商品"></button-box>
        </div>
      </form>
    </div>
    <table-box ref="tableBox" :url="table.url" :params="query" :columns="table.columns" :key-name="table.keyName"
               :parse-data="table.parseData" :data="table.data" :multi-select="table.multiSelect">
      <tr slot="row" slot-scope="props">
        <td class="tc">{{props.index}}</td>
        <td>
          <div><small>ID：</small>{{props.item.id}}</div>
          <div><small>名称：</small>{{props.item.name}}</div>
        <td>
          <div><small>展示价：</small>{{props.item.show_price}}</div>
          <div><small>销售价：</small>{{props.item.price}}</div>
        </td>
        <td>
          <div><small>优惠：</small>{{props.item.is_featured}}</div>
          <div><small>优惠价：</small>{{props.item.featured_price}}</div>
        </td>
        <td>
          <div>{{props.item.product_status}}</div>
        </td>
        <td>
          <div>{{props.item.description}}</div>
        </td>
        <td>
          <div>{{props.item.created_at}}</div>
        </td>
        <td>
          <button-box type="edit" :to="'/product/save?id='+props.item.id"/>
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
  name: 'ProductIndex',
  components: {TableBox, ButtonBox},

  ...pages,

  data: function () {
    return {
      query: {
        id: '',
        name: '',
        type: ''
      },
      table: {
        url: this.$api.product_index,
        multiSelect: false,
        keyName: 'id',
        columns: [
          {title: '商品名称', width: '200'},
          {title: '商品价格', width: '150'},
          {title: '优惠', width: '160'},
          {title: '上下架', width: '160'},
          {title: '描述', width: '160'},
          {title: '时间', width: '80'},
          {title: '操作', width: '100'}
        ],
        parseData: function (data) {
          // data.forEach(function (row) {})
        }
      }
    }
  },
  mounted: function () {
    let breadcrumb = [
      {link: '', title: '商品管理'},
      {link: '', title: '商品列表'}
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
        content: '删除要删除商品（' + item.name + '）吗',
        success: () => {
          let url = this.$api.product_delete
          this.$network.post(url, {id: item.id}).then(resp => {
            if (resp.code === ResponseCode.SUCCESS) {
              this.$toast({title: resp.msg})
              table.refresh()
            } else {
              this.$toast({title: resp.msg, type: 'error'})
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
