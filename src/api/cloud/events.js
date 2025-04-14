/* eslint-disable camelcase */
import request from '@/plugins/axios'
// 获取AWS Events信息
export const getAwsEventslist = (params) => request({
  url: '/api/v2/cmdb/events/aws/',
  method: 'get',
  params,
})

// 获取Aliyun Events信息
export const getAliyunEventslist = (params) => request({
  url: '/api/v2/cmdb/events/aliyun/',
  method: 'get',
  params,
})


// 获取Aliyun Events信息
export const getQcloudEventslist = (params) => request({
  url: '/api/v2/cmdb/events/qcloud/',
  method: 'get',
  params,
})
