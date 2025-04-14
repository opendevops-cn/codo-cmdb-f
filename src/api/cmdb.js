/* eslint-disable camelcase */
import request from "@/plugins/axios"

// Ps: 这里从后面开始就写多个方法了，比如get / post / delete各定义一个API去操作
// 获取Tag关联的资产
export const getTagAssetID = (params) => request({
  url: "/api/v2/cmdb/tag/asset_id/",
  method: "get",
  params,
})

// 获取标签列表
export const getTag = (params) => request({
  url: "/api/v2/cmdb/tag/",
  method: "get",
  params,
})

// 添加标签
export const addTag = (/** @type {any} */ data) => request({
  url: "/api/v2/cmdb/tag/",
  method: "post",
  data,
})

export const patchTag = (/** @type {any} */ data) => request({
  url: "/api/v2/cmdb/tag/",
  method: "patch",
  data,
})

// 删除标签
export const deleteTag = (/** @type {any}* */ data) => request({
  url: "/api/v2/cmdb/tag/",
  method: "delete",
  data,
})

// 主机详情
export const getHostDetail = (params) => request({
  url: "/api/v2/cmdb/biz/host/detail/",
  method: "get",
  params,
})

// 主机关系
export const getHostRelation = (params) => request({
  url: "/api/v2/cmdb/biz/host/relation/",
  method: "get",
  params,
})

// 集群模板
export const getSetTemplist = (params) => request({
  url: "/api/v2/cmdb/biz/set_temp/",
  method: "get",
  params,
})

export const operationSetTemp = (data, method) => request({
  url: "/api/v2/cmdb/biz/set_temp/",
  data,
  method,
})

// 业务主机
export const getBizHostlist = (params) => request({
  url: "/api/v2/cmdb/biz/hosts/",
  method: "get",
  params,
})

export const operationBizHost = (data, method) => request({
  url: "/api/v2/cmdb/biz/hosts/",
  data,
  method,
})

// 动态分组

// 预览分组主机
// export const preViewDynamicGroupHost = (exec_uuid) => request({
//   url: '/api/v2/cmdb/biz/dynamic_group/preview/',
//   method: 'get',
//   params: {
//     exec_uuid,
//   },
// })

// export const getDynamicGrouplist = (params) => request({
//   url: '/api/v2/cmdb/biz/dynamic_group/',
//   method: 'get',
//   params,
// })

// export const operationDynamicGroup = (data, method) => request({
//   url: '/api/v2/cmdb/biz/dynamic_group/',
//   data,
//   method,
// })

// 业务Tree

export const getBizTreelist = (params) => request({
  url: "/api/v2/cmdb/biz/tree/",
  method: "get",
  params,
})

export const operationBizTree = (data, method) => request({
  url: "/api/v2/cmdb/biz/tree/",
  method,
  data,
})

// 业务管理
export const getBusinesslist = (params) => request({
  url: "/api/v2/cmdb/biz/",
  method: "get",
  params,
})

// 切换业务(右上角)
export const changeBusiness = (data) => request({
  url: "/api/v2/cmdb/biz/",
  method: "patch",
  data,
})

export const operationBusiness = (data, method) => request({
  url: "/api/v2/cmdb/biz/",
  method,
  data,
})

// 查询资源
export const searchAssetList = (params) => request({
  url: "/api/v2/cmdb/search/",
  method: "get",
  params,
})

// 多云配置API

export const getCloudSettinglist = (key, value) => request({
  url: "/api/v2/cmdb/cloud/conf/",
  method: "get",
  params: {
    key,
    value,
  },
})

export const operationCloudSetting = (data, method) => request({
  url: "/api/v2/cmdb/cloud/conf/",
  method,
  data,
})

// 导入资产
export const getCloudSyncResources = (params) => request({
  url: "/api/v2/cmdb/cloud/sync/",
  method: "get",
  params,
})

export const cloudAssetImport = (data) => request({
  url: "/api/v2/cmdb/cloud/sync/",
  method: "post",
  data,
})

// 同步log

export const getCloudSyncLog = (account_id) => request({
  url: "/api/v2/cmdb/cloud/sync/log/",
  method: "get",
  params: {
    account_id,
  },
})

// 使用模板批量添加拓扑
export const optBatchAPPTemp = (/** @type {any} */ data, /** @type {any} */ method) => request({
  url: "/api/v2/cmdb/biz/set_temp/batch/",
  method,
  data,
})

// 获取模板列表
export const getOrderTemplateList = (params) => request({
  url: "/api/v2/cmdb/order/template/",
  method: "get",
  params,
})

// 获取标签列表
export const getTagList = (params) => request({
  url: "/api/v2/cmdb/tag/list/",
  method: "get",
  params,
})

// 创建模板
export const createOrderTemplate = (data) => request({
  url: "/api/v2/cmdb/order/template/",
  method: "post",
  data,
})

// 修改模板
export const modifyOrderTemplate = (data) => request({
  url: "/api/v2/cmdb/order/template/",
  method: "put",
  data,
})

// 删除模板
export const deleteOrderTemplate = (data) => request({
  url: "/api/v2/cmdb/order/template/",
  method: "delete",
  data,
})

// 获取采购记录
export const getOrderInfoList = (params) => request({
  url: "/api/v2/cmdb/order/info/",
  method: "get",
  params,
})

// 创建采购
export const createOrderInfo = (data) => request({
  url: "/api/v2/cmdb/order/info/",
  method: "post",
  data,
})

// 删除采购
export const deleteOrderInfo = (data) => request({
  url: "/api/v2/cmdb/order/info/",
  method: "delete",
  data,
})

// 获取实例价格
export const getPrice = (data) => request({
  url: "/api/v2/cmdb/order/query_cloud/price/",
  method: "post",
  data,
})

// 购买实例
export const createOrder = (data) => request({
  url: "/api/v2/cmdb/order/buy/",
  method: "post",
  data,
})

// 查询镜像列表
export const getImageIds = (params) => request({
  url: "/api/v2/cmdb/img/",
  method: "get",
  params,
})

// 查询带宽包ID列表
export const getBindWidthPkgIds = (data) => request({
  url: "/api/v2/cmdb/order/query_cloud/bandwidth_pkg/",
  method: "post",
  data,
})

// 查询实例类型
export const getInsType = (data) => request({
  url: "/api/v2/cmdb/order/query_cloud/ins_type/",
  method: "post",
  data,
})

// /**
//  * @description 本地存储和获取表格展示
//  */
// export const setCheckBoxListInLocalstorage = (list) => {
//     localStorage.CheckBoxList = JSON.stringify(list)
// }
// /**
// * @returns {Array}
// */
// export const getCheckBoxListFromLocalstorage = () => {
//     const list = localStorage.CheckBoxList
//     return list ? JSON.parse(list) : []
// }
// 查询角色列表
export const getRoleInfoList = () => request({
  url: "/api/v2/cmdb/role/",
  method: "get",
})


// 获取审计日志列表
export const getAuditList = (params) => request({
  url: "/api/v2/cmdb/audit/list/",
  method: "get",
  params,
})

// 获取堡垒机组织列表
export const getJMSOrgList = (params) => request({
  url: "/api/v2/cmdb/jms/orgs/list/",
  method: "get",
  params,
})