/* eslint-disable camelcase */
import request from '@/plugins/axios'
// 动态分组

// 预览分组主机
export const preViewDynamicGroupHost = (exec_uuid) => request({
  url: '/api/v2/cmdb/biz/dynamic_group/preview/',
  method: 'get',
  params: {
    exec_uuid,
  },
})

export const getDynamicGrouplist = (params) => request({
  url: '/api/v2/cmdb/biz/dynamic_group/',
  method: 'get',
  params,
})

export const optDynamicGroup = (data, method) => request({
  url: '/api/v2/cmdb/biz/dynamic_group/',
  data,
  method,
})