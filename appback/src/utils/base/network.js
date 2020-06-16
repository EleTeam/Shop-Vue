import authorize from './authorize'
import api from '../config/api'
import config from '../config/config'
import axios from 'axios'
import Qs from 'qs'
import router from '../../router'
import ResponseCode from '../consts/response_code.js'

function toLogin (redirect = {go: -1}) {
  router.push({
    path: config.login_path,
    query: redirect
  })
}

function toForbidden () {
  router.push({
    path: config.forbidden_path
  })
}

/*
 * checkLogin，请求数据之前，是否需要检查登录状态，如果登录已过期，则需要重新登录，然后再请求数据
 */
function get (url, data, checkLogin = false) {
  if (checkLogin && !authorize.checkLogin()) {
    // 如果需要登录，且登录已经过期，则先进行登录，然后再进行数据处理
    return new Promise((resolve, reject) => {
      toLogin()
      reject(new Error('登录过期，请先登录'))
    })
  }

  return request(url, data, 'get')
}

function post (url, data, checkLogin = false) {
  if (checkLogin && !authorize.checkLogin()) {
    // 如果需要登录，且登录已经过期，则先进行登录，然后再进行数据处理
    return new Promise((resolve, reject) => {
      toLogin()
      reject(new Error('登录过期，请先登录'))
    })
  }

  return request(url, data, 'post')
}

function request (url, data, method = 'get') {
  let params = method === 'get' ? data : ''
  let postData = method === 'post' ? data : ''

  return new Promise((resolve, reject) => {
    axios.request({
      url: api.baseUrl + url,
      method: method,
      params: {
        ...params,
        access_token: authorize.getToken()
      },
      data: postData,

      transformRequest: [function (data) {
        return Qs.stringify(data) // 把数据转化为QueryString
      }],

      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      onUploadProgress: '',
      onDownloadProgress: ''
    }).then((respObj) => { // http状态码等于200
      // console.log(resp)
      let resp = respObj.data
      if (resp.code === ResponseCode.NOT_LOGIN || resp.code === ResponseCode.LOGIN_EXPIRED) { // 未登录 || 登录已过期
        toLogin()
        reject(new Error(resp.msg))
      } else if (resp.code === ResponseCode.UNAUTHORIZED) { // 没有操作权限
        toForbidden()
        reject(new Error(resp.msg))
      } else {
        resolve(resp)
      }
    }).catch((err) => { // 服务端异常，http状态码不等于200
      // console.log(err)
      reject(err) // 抛出异常，上级调用可以捕获
    })
  })
}

export default {
  get, post, toLogin
}
