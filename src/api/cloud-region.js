/* eslint-disable camelcase */
import request from '@/plugins/axios'
// 动态规则管理

// 预览
export const previewCloudRegion = (params) => request({
  url: '/api/v2/cmdb/cloud_region/preview/',
  method: 'get',
  params
})

// 操作
export const optCloudRegionPro = (data, method) => request({
  url: '/api/v2/cmdb/cloud_region/pro/',
  data,
  method
})

// 查看
export const getCloudRegion = (params) => request({
  url: '/api/v2/cmdb/cloud_region/',
  method: 'get',
  params
})

// 操作
export const optCloudRegion= (data, method) => request({
  url: '/api/v2/cmdb/cloud_region/',
  data,
  method
})