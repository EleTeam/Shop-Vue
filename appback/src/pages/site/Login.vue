<template>
<div class="login">
  <div class="header"></div>
  <form>
    <input name="username" v-model="form.data.username" type="text" placeholder="后台账号"/>
    <input name="password" v-model="form.data.password" type="password" placeholder="登录密码"/>
    <input name="google_code" v-model="form.data.google_code" type="text" placeholder="谷歌验证码" autocomplete="off"/>
    <button-box class="button" title="登录" loading-title="登录中..." @click="login" ref="loginBtn"></button-box>
  </form>
  <div class="project-name">－{{project_name}}－</div>
</div>
</template>

<script>
import config from '../../utils/config/config'
import ButtonBox from '../../components/mod/ButtonBox'
import authorize from '../../utils/base/authorize'
import ResponseCode from '../../utils/consts/response_code.js'
import formValidation from '../../utils/base/formValidation'
// import {md5} from '../../utils/lib/md5'

export default {
  name: 'Login',
  components: {ButtonBox},
  data: function () {
    return {
      project_name: config.project_name,
      form: {
        data: {
          username: '',
          password: '',
          google_code: ''
        },
        rules: {
          username: {required: true},
          password: {required: true},
          google_code: {required: true}
        },
        message: {
          username: {required: '新密码不能为空'},
          password: {required: '确认新密码不能为空'},
          google_code: {required: '验证码不能为空'}
        }
      }
    }
  },
  methods: {
    login: function () {
      let formData = {...this.form.data}
      let validation = formValidation.validate(this.form.rules, formData, this.form.message)
      if (validation.code === 'FAIL') {
        this.$toast({title: validation.msg, type: 'error'})
        return
      }
      // formData.password = md5(this.form.password)

      this.$refs.loginBtn.showLoading()
      this.$network.post(this.$api.login, formData).then(resp => {
        if (resp.code === ResponseCode.SUCCESS) {
          // 保存token
          authorize.saveToken(resp.data.access_token)

          // 跳转
          if (typeof (this.$route.query.redirect) !== 'undefined') {
            this.$router.push(this.$route.query.redirect)
          } else if (typeof (this.$route.query.go) !== 'undefined') {
            this.$router.go(this.$route.query.go)
          } else {
            this.$router.push(config.index_path)
          }

          this.$refs.loginBtn.hideLoading()
        } else {
          this.$toast({title: resp.msg, type: 'error'})
          this.$refs.loginBtn.hideLoading()
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  @import "../../less/variable";
  .login{
    width: 100%;
    height: 100%;
    .header{
      width: 100%;
      height: 140px;
      background-color: @brand-color;
    }

    form{
      width: 400px;
      padding: 54px 70px;
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 0 2px 10px -3px rgba(0,0,0,.8);
      margin: 0 auto;
      position: relative;
      top: -94px;

      input[type="text"],input[type="password"]{
        width: 100%;
        background-color: #f4f4f4;
        color: #a8a8a8;
        border-color: transparent;
        box-shadow: none;
        line-height: 28px;
        height: 42px;
        padding: 6px 12px;
        font-size: 14px;
        border-radius: 0;
        margin: 10px 0;
      }

      .button{
        display: block;
        width: 100%;
        margin-top: 12px;
        padding: 0 !important;
        height: 38px;
        line-height: 38px;
        text-align: center;
        color: #fff;
        background-color: @brand-color;
        border-color: transparent;
      }
    }

    .project-name{
      font-size: 20px;
      text-align: center;
      position: relative;
      top: -60px;
    }
  }
</style>
