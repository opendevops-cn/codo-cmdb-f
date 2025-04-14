import request from '@/plugins/axios'

//  服务树
export const postTreeAsset = (/** @type {any} */ data) => request({
  url: '/api/v2/cmdb/tree/asset/',
  method: 'post',
  data,
})
// 获取树资产
export const getTreeAsset = (/** @type {any} */ params) => request({
  url: '/api/v2/cmdb/tree/asset/',
  method: 'get',
  params,
})

// 更改资产状态
export const changeTreeAssetStatus = (/** @type {any} */ data) => request({
  url: '/api/v2/cmdb/tree/asset/',
  method: 'patch',
  data,
})

export const deleteTreeAsset = (/** @type {any} */ data) => request({
  url: '/api/v2/cmdb/tree/asset/',
  method: 'delete',
  data,
})

// 主机关系
export const getRelation = (/** @type {any} */ params) => request({
  url: '/api/v2/cmdb/tree/asset/relation/',
  method: 'get',
  params,
})

// 业务Tree
export const getServiceTreelist = (/** @type {any} */ params) => request({
  url: '/api/v2/cmdb/tree/',
  method: 'get',
  params,
})

export const operationTree = (/** @type {any} */ data, /** @type {any} */ method) => request({
  url: '/api/v2/cmdb/tree/',
  method,
  data,
})


export const getBizEnv = (/** @type {any} */ params) => request({
  url: '/api/v2/cmdb/tree/env/',
  method: 'get',
  params,
})

export const getTreeModule = (/** @type {any} */ params) => request({
  url: '/api/v2/cmdb/tree/module/',
  method: 'get',
  params,
})