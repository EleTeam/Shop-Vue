<template>
  <div>
    <form class="form-horizontal form-edit">
      <input type="hidden" v-model="form.data.id"/>
      <div class="form-group">
        <label class="col-xs-2 control-label"><span class="required">*</span>账号：</label>
        <div class="col-xs-6">
          <input class="form-control form-field" v-model="form.data.username"/>
        </div>
      </div>

      <div class="form-group" v-if="!form.data.id">
        <label class="col-xs-2 control-label"><span class="required">*</span> 密码：</label>
        <div class="col-xs-6">
          <input class="form-control form-field" v-model="form.data.password"/>
        </div>
      </div>

      <div class="form-group">
        <label class="col-xs-2 control-label"><span class="required">*</span> 昵称：</label>
        <div class="col-xs-6">
          <input class="form-control form-field" v-model="form.data.nickname"/>
        </div>
      </div>

      <div class="form-group">
        <label class="col-xs-2 control-label"><span class="required">*</span> 角色：</label>
        <div class="col-xs-6">
          <select class="form-control form-field" v-model="form.data.role_name">
            <option v-for="(role,index) in roles" :value="role.name" v-bind:key="index">{{role.name}}</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="col-xs-2 control-label">手机号：</label>
        <div class="col-xs-6">
          <input class="form-control form-field" v-model="form.data.mobile"/>
        </div>
      </div>

      <div class="form-group">
        <label class="col-xs-2 control-label">邮箱：</label>
        <div class="col-xs-6">
          <input class="form-control form-field" v-model="form.data.email"/>
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
// import {md5} from '../../utils/lib/md5';

export default {
  name: 'UserForm',
  components: {FormSubmit},
  data: function () {
    return {
      roles: [],
      form: {
        action: '',
        data: {
          id: 0,
          username: '',
          role_name: '',
          password: '',
          nickname: '',
          mobile: '',
          email: ''
        },
        rules: {
          username: {
            required: true,
            maxlength: 30
          },
          password: {
            required: true
          },
          nickname: {
            required: true
          },
          role: {
            required: true
          }
        },
        message: {
          username: {
            required: '账号不能为空',
            maxlength: '账号最多可输入30个字符'
          },
          role: {
            required: '角色不能为空'
          },
          password: {
            required: '密码不能为空'
          },
          nickname: {
            required: '姓名不能为空'
          }
        }
      }
    }
  },
  mounted: function () {
    let id = this.$route.query.id
    // 获取所有角色
    this.$network.get(this.$api.role_index).then(resp => {
      if (resp.code === ResponseCode.SUCCESS) {
        this.roles = resp.data.items
      } else {
        this.$toast({title: resp.msg, type: 'error'})
      }
    })
    // 获取数据
    if (id === undefined) { // 添加
      this.form.action = this.$api.user_create
    } else { // 编辑
      this.form.action = this.$api.user_update + '?id=' + id
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
      this.$network.post(this.form.action, formData).then(resp => {
        if (resp.code === ResponseCode.SUCCESS) {
          this.$router.push(this.$api.user_index)
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
