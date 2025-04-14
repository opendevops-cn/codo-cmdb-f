/* eslint-disable camelcase */
import request from '@/plugins/axios'

export const getNat = (params) => request({
  url: '/api/v2/cmdb/nat/',
  method: 'get',
  params,
})

export const optNat= (data, method) => request({
  url: '/api/v2/cmdb/nat/',
  method,
  data,
})
