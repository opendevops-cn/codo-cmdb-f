/* eslint-disable camelcase */
import request from '@/plugins/axios'

// 数据库
export const getMySQLList = (params) => request({
  url: '/api/v2/cmdb/mysql/',
  method: 'get',
  params,
})

export const optrationMysQL = (data, method) => request({
  url: '/api/v2/cmdb/mysql/',
  method,
  data,
})