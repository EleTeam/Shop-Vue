<template>
  <div>
    <form class="form-horizontal form-edit">
      <input type="hidden" v-model="form.data.old_name"/>
      <div class="form-group">
        <label class="col-xs-2 control-label"><span class="required">*</span>角色名称：</label>
        <div class="col-xs-6">
          <input class="form-control form-field" v-model="form.data.name"/>
        </div>
      </div>

      <div class="form-group">
        <label class="col-xs-2 control-label">角色描述：</label>
        <div class="col-xs-6">
          <textarea class="form-control form-field" rows="3" v-model="form.data.description"></textarea>
        </div>
      </div>

      <fieldset>
        <legend>分配权限</legend>
        <div class="permissions">
          <div class="" v-for="(menu,index) in menus" v-bind:key="index">
            <div style="margin-left: 40px;">{{menu.name}}</div>
            <div class="form-group" v-for="(child,cindex) in menu.children" v-bind:key="cindex">
              <label class="col-xs-2 control-label">{{child.name}}：</label>
              <div class="col-xs-10 checkbox-area">
                <label v-for="(action,aindex) in child.actions" v-bind:key="aindex">
                  <input type="checkbox" name="permissions" :value="action.route" v-model="form.data.permissions"/>
                  {{action.name}}
                </label>
              </div>
            </div>
          </div>
        </div>
      </fieldset>

      <form-submit @formSubmit="formSubmit"></form-submit>
    </form>
  </div>
</template>

<script>
import FormSubmit from '../../components/mod/FormSubmit'
import formValidation from '../../utils/base/formValidation'
import ResponseCode from '../../utils/consts/response_code.js'

export default {
  name: 'RoleForm',
  components: {FormSubmit},
  data: function () {
    return {
      menus: [],
      form: {
        action: '',
        data: {
          old_name: '',
          name: '',
          description: '',
          permissions: []
        },
        rules: {
          name: {
            required: true
          },
          permissions: {
            required: true
          }
        },
        message: {
          name: {
            required: '角色名称不能为空'
          },
          permissions: {
            required: '权限不能为空'
          }
        }
      }
    }
  },
  mounted: function () {
    let name = this.$route.query.name
    let userInfoUrl = this.$api.user_get_info
    if (name === undefined) { // 创建
      this.form.action = this.$api.role_create
    } else { // 更新
      this.form.action = this.$api.role_update
      userInfoUrl = this.$api.user_get_info + '?role_name=' + name
      this.form.data.old_name = name
      this.$network.get(this.$api.role_view, {name: name}).then(resp => {
        if (resp.code === ResponseCode.SUCCESS) {
          this.form.data.name = resp.data.name
          this.form.data.description = resp.data.description
        } else {
          this.$toast({title: resp.msg, type: 'error'})
        }
      })
    }
    // 获取权限
    this.$network.get(userInfoUrl).then(resp => {
      if (resp.code === ResponseCode.SUCCESS) {
        this.menus = resp.data.menus
        // 默认选中
        let permissions = this.form.data.permissions
        this.menus.forEach(function (menu) {
          menu.children.forEach(function (child) {
            child.actions.forEach(function (action) {
              if (action.is_selected === 1) {
                permissions.push(action.route)
              }
            })
          })
        })
      } else {
        this.$toast({title: resp.msg, type: 'error'})
      }
    })
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
      this.$network.post(this.form.action, {...formData}).then(resp => {
        if (resp.code === ResponseCode.SUCCESS) {
          this.$toast({title: '保存成功'})
          this.$router.push(this.$api.role_index)
        } else {
          this.$toast({title: resp.msg, type: 'error'})
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .permissions {
    .checkbox-area {
      label {
        padding-left: 4px;
        margin-right: 10px;
        padding-top: 8px;
        min-height: 20px;
        margin-bottom: 0;
        font-weight: 400;
        input {
          margin-right: 4px;
        }
      }
    }
  }
</style>
