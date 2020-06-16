// 项目配置
export default {
  expires: 3600, // 登录过期时间
  login_path: '/site/login', // 登录路径
  forbidden_path: '/403', // 无权限页面
  index_path: '/site/index', // 首页路径
  project_name: process.env.PROJECT_NAME // 项目名称
  // pc_domain: process.env.PC_DOMAIN,
  // m_domain: process.env.M_DOMAIN,

}
