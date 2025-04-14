/* eslint-disable camelcase */
import request from '@/plugins/axios'

// redis
export const getRedisList = (params) => request({
  url: '/api/v2/cmdb/redis/',
  method: 'get',
  params,
})

export const optrationRedis = (data, method) => request({
  url: '/api/v2/cmdb/redis/',
  method,
  data,
})