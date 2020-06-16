<template>
  <div>
    <form class="form-horizontal form-edit">
      <div class="form-group">
        <label class="col-xs-2 control-label"><span class="required">*</span>请输入新密码：</label>
        <div class="col-xs-6">
          <input class="form-control form-field" type="password" v-model="form.data.password" autocomplete="off">
        </div>
      </div>
      <div class="form-group">
        <label class="col-xs-2 control-label"><span class="required">*</span>确认新密码：</label>
        <div class="col-xs-6">
          <input class="form-control form-field" type="password" v-model="form.data.password_confirm" autocomplete="off">
        </div>
      </div>
      <div class="form-group">
        <label class="col-xs-2 control-label"><span class="required">*</span>谷歌验证码：</label>
        <div class="col-xs-6">
          <input class="form-control form-field" v-model="form.data.google_code" autocomplete="off">
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
  name: 'UserUpdatePassword',
  components: {FormSubmit},
  data: function () {
    return {
      form: {
        data: {
          password: '',
          password_confirm: '',
          google_code: ''
        },
        rules: {
          password: {required: true},
          password_confirm: {required: true},
          google_code: {required: true}
        },
        message: {
          password: {required: '新密码不能为空'},
          password_confirm: {required: '确认新密码不能为空'},
          google_code: {required: '验证码不能为空'}
        }
      }
    }
  },
  mounted: function () {
    let breadcrumb = [
      {link: '', title: '系统管理'},
      {link: '', title: '修改密码'}
    ]
    this.$store.commit('SET_BREADCRUMB', breadcrumb)
  },
  methods: {
    // 修改密码
    formSubmit () {
      let formData = {...this.form.data}
      let validation = formValidation.validate(this.form.rules, formData, this.form.message)
      if (validation.code === 'FAIL') {
        this.$toast({title: validation.msg, type: 'error'})
        return
      }
      if (this.form.data.password !== this.form.data.password_confirm) {
        this.$toast({'title': '两次输入的密码不一样', 'type': 'error'})
        return
      }

      this.$network.post(this.$api.user_update_password, formData).then(resp => {
        if (resp.code === ResponseCode.SUCCESS) {
          this.$toast({'title': resp.msg})
          this.$router.push('/site/login')
        } else {
          this.$toast({'title': resp.msg, 'type': 'error'})
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
