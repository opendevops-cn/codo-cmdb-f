/* eslint-disable camelcase */
import request from '@/plugins/axios'

export const getCluster = (params) => request({
  url: '/api/v2/cmdb/k8s/cluster/',
  method: 'get',
  params,
})

export const optCluster= (data, method) => request({
  url: '/api/v2/cmdb/k8s/cluster/',
  method,
  data,
})
