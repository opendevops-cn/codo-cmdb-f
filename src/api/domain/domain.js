// import axios from '@/libs/api.request'
import request from '@/plugins/axios'

export const getDomain = (params) => {
    return request({
        url: '/api/v2/cmdb/dns/domain/',
        method: 'get',
        params: params
    })
}

export const optDomain = (data, method) => {
    return request({
        url: '/api/v2/cmdb/dns/domain/',
        method: method,
        data
    })
}

export const syncDomain = () => {
    return request({
        url: '/api/v2/cmdb/dns/sync/',
        method: 'post'
    })
}

export const getDomainRecords = (params) => {
    return request({
        url: '/api/v2/cmdb/dns/record/',
        method: 'get',
        params
    })
}

export const optDomainRecords = (data, method) => {
    return request({
        url: '/api/v2/cmdb/dns/record/',
        method: method,
        data
    })
}

export const recordsChangeRemark = (data) => {
    return request({
        url: '/api/v2/cmdb/dns/remark/',
        method: 'post',
        data
    })
}

export const getDomainLog = (params) => {
    return request({
        url: '/api/v2/cmdb/dns/logs/',
        method: 'get',
        params
    })
}