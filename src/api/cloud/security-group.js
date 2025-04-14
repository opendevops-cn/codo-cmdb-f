/* eslint-disable camelcase */
import request from '@/plugins/axios'

export const getSecurityGroup = (params) => request({
  url: '/api/v2/cmdb/security_group/',
  method: 'get',
  params,
})

export const optSecurityGroup = (data, method) => request({
  url: '/api/v2/cmdb/security_group/',
  method,
  data,
})


// 获取关联
export const getSecurityGroupRefs = (params) => request({
  url: '/api/v2/cmdb/security_group/refs/',
  method: 'get',
  params,
})