/* eslint-disable camelcase */
import request from '@/plugins/axios'

// 主机
export const getServerList = (params) => request({
  url: '/api/v2/cmdb/server/',
  method: 'get',
  params,
})

export const optServer = (data, method) => request({
  url: '/api/v2/cmdb/server/',
  method,
  data,
})

export const optBatchServer = (data, method) => request({
  url: '/api/v2/cmdb/server/batch/',
  method,
  data,
})

// 用戶收藏字段
export const getUserField = (params) => request({
  url: '/api/v2/cmdb/user_field/',
  method: 'get',
  params,
})

export const optrationUserField = (data) => request({
  url: '/api/v2/cmdb/user_field/',
  method: 'put',
  data,
})

export const optServerMainAgent = (data, method) => request({
  url: '/api/v2/cmdb/server/main_agent/',
  method,
  data,
})