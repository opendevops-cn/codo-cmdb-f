/* eslint-disable camelcase */
import request from '@/plugins/axios'

export const login = ({ userName, password }) => {
    const data = {
        userName,
        password,
    }
    return request({
        url: 'login',
        data,
        method: 'post',
    })
}

export const getUserInfo = (token) => request({
    url: 'get_info',
    params: {
        token,
    },
    method: 'get',
})

export const logout = () => request({
    url: 'logout',
    method: 'post',
})

export const getUnreadCount = () => request({
    url: 'message/count',
    method: 'get',
})

export const getMessage = () => request({
    url: 'message/init',
    method: 'get',
})

export const getContentByMsgId = (msgID) => request({
    url: 'message/content',
    method: 'get',
    params: {
        msgID,
    },
})

export const hasRead = (msg_id) => request({
    url: 'message/has_read',
    method: 'post',
    data: {
        msg_id,
    },
})

export const removeReaded = (msg_id) => request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
        msg_id,
    },
})

export const restoreTrash = (msg_id) => request({
    url: 'message/restore',
    method: 'post',
    data: {
        msg_id,
    },
})
