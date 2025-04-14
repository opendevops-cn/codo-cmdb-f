/* eslint-disable camelcase */
import request from '@/plugins/axios'

export const getVPC = (params) => request({
  url: '/api/v2/cmdb/vpc/',
  method: 'get',
  params,
})

export const optVPC = (data, method) => request({
  url: '/api/v2/cmdb/vpc/',
  method,
  data,
})

