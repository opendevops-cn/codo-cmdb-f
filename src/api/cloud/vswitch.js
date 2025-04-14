/* eslint-disable camelcase */
import request from '@/plugins/axios'

export const getVswitch = (params) => request({
  url: '/api/v2/cmdb/vswitch/',
  method: 'get',
  params,
})

export const optVswitch = (data, method) => request({
  url: '/api/v2/cmdb/vswitch/',
  method,
  data,
})

