/* eslint-disable camelcase */
import request from '@/plugins/axios'
// 权限分组

// 预览分组主机
export const preViewPermGroupHost = (exec_uuid) => request({
  url: '/api/v2/cmdb/biz/perm_group/preview/',
  method: 'get',
  params: {
    exec_uuid,
  },
})

export const getPermGrouplist = (params) => request({
  url: '/api/v2/cmdb/biz/perm_group/',
  method: 'get',
  params,
})

export const optPermGroup = (data, method) => request({
  url: '/api/v2/cmdb/biz/perm_group/',
  data,
  method,
})

// 同步权限分组
export const SyncPermGroup = (data, method) => request({
  url: '/api/v2/cmdb/biz/perm_group/sync/',
  data,
  method,
})