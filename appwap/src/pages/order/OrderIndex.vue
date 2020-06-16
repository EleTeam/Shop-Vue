<template>
  <div>
    <div class="">
      <form @submit.prevent="queryData" class="query">
        <div class="form-inline">
          <span class="col-3"><input type="text" v-model="query.order_no" placeholder="订单号" class="form-control" style="width:180px;"/></span>
          <span class="col-3">
            <select v-model="query.order_status" class="form-control">
              <option value="">订单状态</option>
            </select>
          </span>
          <button-box type="search" @click="queryData"></button-box>
        </div>
      </form>
    </div>
    <div class="summary">
      <span>成功的 总交易额：</span><span class="value">{{summary.total_price}}</span>
      <span>成功率：</span><span class="value">{{summary.total_success_rate}}</span>
      <span>成功单数：</span><span class="value">{{summary.total_success_count}}</span>
      <span>总单数：</span><span class="value">{{summary.total_count}}</span>
    </div>

    <table-box ref="tableBox" :url="table.url" :params="query" :columns="table.columns" :key-name="table.keyName"
               :parse-data="table.parseData" :data="table.data" :multi-select="table.multiSelect">
      <tr slot="row" slot-scope="props">
        <td class="tc">{{props.index}}</td>
        <td>
          <div><small>平台：</small>{{props.item.order_no}}</div>
        <td>
          <div><small>总额：</small>{{props.item.total_price}}</div>
        </td>
        <td>
          <div><small>创建：</small>{{props.item.created_at}}</div>
        </td>
        <td>
          <div>{{props.item.order_status_label}}</div>
          <template v-if="props.item.query_order_url">
            <button-box style="margin-top: 4px;" type="btn-info" @click="queryOrder(props.item.query_order_url)">查单</button-box>
          </template>
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
    name: 'OrderIndex',
    components: {TableBox, ButtonBox},

    ...pages,

    data: function () {
      return {
        query: {
          order_no: '',
          order_status: ''
        },
        table: {
          url: this.$api.order_index,
          multiSelect: false,
          keyName: 'id',
          columns: [
            {title: '订单号', width: '230'},
            {title: '金额', width: '110'},
            {title: '时间', width: '160'},
            {title: '订单状态', width: '80'}
          ],
          parseData: function (data) {
            // data.forEach(function (row) {})
          }
        },
        stat: {
          total_price_success: '',
          total_count_success: '',
          total_count: ''
        }
      }
    },
    mounted: function () {
      let breadcrumb = [
        {link: '', title: '订单管理'},
        {link: '', title: '订单列表'}
      ]
      this.$store.commit('SET_BREADCRUMB', breadcrumb)
      this.orderSummary()
    },
    methods: {
      queryData: function () {
        let table = this.$refs.tableBox
        table.reload()
        // let queryData={...this.query}
        // this.query=queryData
        this.orderSummary()
      },
      orderSummary: function () {
        this.$network.get(this.$api.order_stat, {...this.query}).then(resp => {
          this.summary.total_price_success = resp.data.total_price_success
          this.summary.total_count_success = resp.data.total_count_success
          this.summary.total_count = resp.data.total_count
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .summary {
    margin: 5px 0 0 0; padding: 10px 0 10px 10px; background-color: #EEEEEE;
    .value {margin-right: 20px;}
  }
</style>
