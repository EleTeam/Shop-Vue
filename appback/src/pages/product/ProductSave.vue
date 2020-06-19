<template>
  <div>
    <form class="form-horizontal form-edit">
      <input type="hidden" v-model="query.id"/>
      <div class="form-group">
        <label class="col-xs-2 control-label"><span class="required">*</span>商品名称：</label>
        <div class="col-xs-6">
          <input class="form-control form-field" v-model="form.data.name"/>
        </div>
      </div>
      <div class="form-group">
        <label class="col-xs-2 control-label"><span class="required">*</span>商品数量：</label>
        <div class="col-xs-6">
          <input class="form-control form-field" v-model="form.data.count"/>
        </div>
      </div>
      <div class="form-group">
        <label class="col-xs-2 control-label">展示价(元)：</label>
        <div class="col-xs-6">
          <input class="form-control form-field" v-model="form.data.show_price"/>
        </div>
      </div>
      <div class="form-group">
        <label class="col-xs-2 control-label"><span class="required">*</span>销售价(元)：</label>
        <div class="col-xs-6">
          <input class="form-control form-field" v-model="form.data.price"/>
        </div>
      </div>
      <div class="form-group">
        <label class="col-xs-2 control-label">优惠价(元)：</label>
        <div class="col-xs-6">
          <input class="form-control form-field" v-model="form.data.featured_price"/>
        </div>
      </div>
      <div class="form-group">
        <label class="col-xs-2 control-label"><span class="required">*</span>是否优惠价：</label>
        <div class="col-xs-6">
          <select class="form-control form-field" v-model="form.data.is_featured">
            <option value="">请选择</option>
            <option v-for="(value,key) in is_featured_array" :value="key" v-bind:key="key">{{value}}</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="col-xs-2 control-label"><span class="required">*</span>商品类型：</label>
        <div class="col-xs-6">
          <select class="form-control form-field" v-model="form.data.type">
            <option value="">请选择</option>
            <option v-for="(value,key) in type_array" :value="key" v-bind:key="key">{{value}}</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="col-xs-2 control-label"><span class="required">*</span>审核状态：</label>
        <div class="col-xs-6">
          <select class="form-control form-field" v-model="form.data.audit_status">
            <option value="">请选择</option>
            <option v-for="(value,key) in audit_status_array" :value="key" v-bind:key="key">{{value}}</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="col-xs-2 control-label"><span class="required">*</span>商品状态：</label>
        <div class="col-xs-6">
          <select class="form-control form-field" v-model="form.data.product_status">
            <option value="">请选择</option>
            <option v-for="(value,key) in product_status_array" :value="key" v-bind:key="key">{{value}}</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="col-xs-2 control-label">排序：</label>
        <div class="col-xs-6">
          <input class="form-control form-field" v-model="form.data.sort"/>
        </div>
      </div>
      <form-submit @formSubmit="formSubmit"></form-submit>
    </form>
  </div>
</template>

<script>
import FormSubmit from '../../components/mod/FormSubmit'
import formValidation from '../../utils/base/formValidation'
import ResponseCode from '../../utils/consts/response_code.js'

export default {
  name: 'ProductSave',
  components: {FormSubmit},
  data: function () {
    return {
      query: {
        id: ''
      },
      type_array: {},
      is_featured_array: {},
      product_status_array: {},
      audit_status_array: {},
      form: {
        data: {
          id: '',
          name: '',
          count: '',
          show_price: '',
          price: '',
          featured_price: '',
          is_featured: '',
          audit_status: '',
          type: '',
          product_status: '',
          sort: 999
        },
        rules: {
          name: {required: true, maxlength: 1000},
          count: {required: true},
          price: {required: true},
          type: {required: true}
        },
        message: {
          name: {required: '商品名称不能为空', maxlength: '商品名称最多为1000个字'},
          count: {required: '商品数量不能为空'},
          price: {required: '销售价不能为空'},
          type: {required: '商品类型不能为空'}
        }
      }
    }
  },
  mounted: function () {
    let id = this.$route.query.id
    let title = ''
    if (!id) { // 添加
      title = '添加商品'
    } else { // 编辑
      title = '编辑商品'
    }
    let breadcrumb = [
      {link: '', title: '商品管理'},
      {link: '', title: title}
    ]
    this.$store.commit('SET_BREADCRUMB', breadcrumb)

    // 商品对应的常量定义
    this.$network.get(this.$api.product_consts).then((resp) => {
      if (resp.code === ResponseCode.SUCCESS) {
        this.type_array = resp.data.type_array
        this.is_featured_array = resp.data.is_featured_array
        this.product_status_array = resp.data.product_status_array
        this.audit_status_array = resp.data.audit_status_array
      } else {
        this.$toast({title: resp.msg, type: 'error'})
      }
    })

    if (!id) { // 添加
    } else { // 编辑
      this.form.data.id = id
      let viewUrl = this.$api.user_view + '?id=' + id
      this.$network.get(viewUrl).then((resp) => {
        if (resp.code === ResponseCode.SUCCESS) {
          if (id) {
            this.form.data = resp.data
          }
          this.roles = resp.data.roles
        } else {
          this.$toast({title: resp.msg, type: 'error'})
        }
      })
    }
  },
  methods: {
    formSubmit: function () {
      let formData = {...this.form.data}
      // console.log(formData)
      let validation = formValidation.validate(this.form.rules, formData, this.form.message)
      if (validation.code === 'FAIL') {
        this.$toast({title: validation.msg, type: 'error'})
        return false
      }
      // formData.password = md5(formData.password)
      this.$network.post(this.$api.product_save, formData).then(resp => {
        if (resp.code === ResponseCode.SUCCESS) {
          this.$toast({title: resp.msg})
          this.$router.push(this.$api.product_index)
        } else {
          this.$toast({title: resp.msg, type: 'error'})
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .permissions{
    .checkbox-area{
      label{
        padding-left: 4px;
        margin-right: 10px;
        padding-top: 8px;
        min-height: 20px;
        margin-bottom: 0;
        font-weight: 400;
        input{
          margin-right: 4px;
        }

      }
    }
  }
</style>
