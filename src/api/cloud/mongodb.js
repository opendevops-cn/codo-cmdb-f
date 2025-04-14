/* eslint-disable camelcase */
import request from '@/plugins/axios'

// mongodb
export const deleteMongoDB= (data) => request({
  url: '/api/v2/cmdb/mongodb/',
  method: 'delete',
  data,
})

export const getMongoDBList = (params) => request({
  url: '/api/v2/cmdb/mongodb/',
  method: 'get',
  params,
})