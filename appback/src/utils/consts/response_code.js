// hf接口返回的code状态码
const ResponseCode = {
  NOT_LOGIN: 10, // 未登录
  LOGIN_EXPIRED: 11, // 登录已过期
  UNAUTHORIZED: 12, // 没有操作权限
  FAIL: 90, // 操作失败
  SUCCESS: 100 // 操作成功
}

export default ResponseCode
