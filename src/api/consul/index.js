/* eslint-disable camelcase */
import request from '@/plugins/axios'
// 服务发现  consul管理

// 查看service
export const getConsulServices = (params) => request({
  url: '/api/v2/cmdb/consul/service/',
  method: 'get',
  params
})

// 查看instance
export const getConsulInstances= (params) => request({
  url: '/api/v2/cmdb/consul/instance/',
  method: 'get',
  params
})


// 操作
export const optConsulInstances = (data, method) => request({
  url: '/api/v2/cmdb/consul/instance/',
  data,
  method
})