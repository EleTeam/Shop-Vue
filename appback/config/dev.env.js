'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://local.appback.etshop.cc:20080"',
  PROJECT_NAME: '"Local Shop 管理后台"'
})
