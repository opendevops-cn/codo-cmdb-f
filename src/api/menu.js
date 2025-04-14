import request from '@/plugins/axios'

export function GetUserMenu() {
    return request({
        url: '../iam/api/v1/iam/user/router', // 可修改为"../"减少计算
    })
}

export default GetUserMenu
