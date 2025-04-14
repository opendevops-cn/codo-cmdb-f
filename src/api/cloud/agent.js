/* eslint-disable camelcase */
import request from '@/plugins/axios'
// 获取Agent列表信息
export const getAgentlist = (params) => request({
  url: '/api/v2/cmdb/agent/',
  method: 'get',
  params,
})

// 操作Agent
export const optAgent= (data, method) => request({
  url: '/api/v2/cmdb/agent/',
  method,
  data,
})

// 批量生成主机
export const batchAddServerByAgent=(data, method) => request({
  url: '/api/v2/cmdb/agent/batch_add_server/',
  method,
  data,
})