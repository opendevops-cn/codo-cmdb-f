/* eslint-disable camelcase */
import request from '@/plugins/axios'
// 动态规则管理

// 预览
export const getDynamicRuleAsset = (id) => request({
  url: '/api/v2/cmdb/dynamic_rule/pro/',
  method: 'get',
  params: {
    id,
  },
})

// 刷新
export const optDynamicRuleAsset = (data, method) => request({
  url: '/api/v2/cmdb/dynamic_rule/pro/',
  data,
  method,
})

// 查看规则
export const getDynamicRules = (params) => request({
  url: '/api/v2/cmdb/dynamic_rule/',
  method: 'get',
  params
})

// 操作
export const optDynamicRule = (data, method) => request({
  url: '/api/v2/cmdb/dynamic_rule/',
  data,
  method,
})