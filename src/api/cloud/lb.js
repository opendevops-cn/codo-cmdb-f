/* eslint-disable camelcase */
import request from '@/plugins/axios'

// lb
export const deleteLB = (data) => request({
  url: '/api/v2/cmdb/lb/',
  method: 'delete',
  data,
})

export const getLBList = (params) => request({
  url: '/api/v2/cmdb/lb/',
  method: 'get',
  params,
})