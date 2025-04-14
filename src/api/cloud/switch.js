import request from '@/plugins/axios'

export const getSwitch = (params) => request({
  url: '/api/v2/cmdb/switch/',
  method: 'get',
  params,
})

export const importSwitch = (data) => request ({
    url: '/api/v2/cmdb/switch/import/',
    method: 'post',
    data: data,
})

export const optSwitch = (data, method) => request({
  url: '/api/v2/cmdb/switch/',
  method,
  data,
})