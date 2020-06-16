/**
 * 关于登录授权等基础方法
 * 保存信息到本地缓存
 */

// 勾选记住我时保存登录信息到本地缓存
function saveToken (token) {
  localStorage.token = token
}

function getToken () {
  if (localStorage.token) {
    return localStorage.token
  } else {
    return ''
  }
}

function clearToken () {
  localStorage.removeItem('token')
}

function checkLogin () {
  if (getToken()) {
    return true
  } else {
    return false
  }
}

// 保存用户信息到本地缓存
function saveAccount (username, password) {
  localStorage.setItem('account', JSON.stringify({
    username: username,
    password: password
  }))
}

function getAccount () {
  if (localStorage.account) {
    return JSON.parse(localStorage.account)
  } else {
    return false
  }
}

function clearAccount () {
  localStorage.removeItem('account')
}

export default {
  saveToken,
  getToken,
  clearToken,
  checkLogin,
  saveAccount,
  getAccount,
  clearAccount
}
