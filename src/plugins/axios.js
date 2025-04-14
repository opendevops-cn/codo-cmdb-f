import Axios from 'axios'
import { Message } from 'view-design'
import { getIamToken } from '@/utils/auth'
import { gotoUnAuth } from '@/utils/actions'
import router from '@/plugins/router';
// import Cookies from 'js-cookie';

function OpenErrorMessage(msg) {
  // @ts-ignore
  Message.error(msg)
}

const service = Axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // @ts-ignore
  contentType: 'application/json',
  timeout: 20000,
  headers: {
    Appcode: process.env.VUE_APP_CODE,
    'biz-id': localStorage.getItem('selectBusinessID'),
  },
})

service.interceptors.request.use(
  (config) => {
    const token = getIamToken()
    if (getIamToken()) {
      const conf = config
      conf.headers.common.Authorization = token
    }
    return config
  },
  (err) => Promise.reject(err),
)

service.interceptors.response.use(
  (response) => {
    const res = response.data

    if (response.headers['content-type'] === 'application/octet-stream') {
      return Promise.resolve(response)
    }
    const whiteCode = [0, 2000]
    // 我这里返回的是data / code / msg
    const msg = res.data ? res.data : res.msg
    if (whiteCode.indexOf(res.retcode) !== -1 || whiteCode.indexOf(res.code) !== -1) {
      return Promise.resolve(response.data)
    }
    OpenErrorMessage(msg)
    return Promise.reject(msg)
  },
  (error) => {
    if (error.response.status === 401) {
      gotoUnAuth() // 交给基座统一处理
    }
    if (error.response.status === 403) {
      OpenErrorMessage('权限错误')
    }
    if (error.response.status === 500) {
      return OpenErrorMessage('内部错误')
    }
    console.log(`err: ${error}`)
    return Promise.reject(error)
  },
)

export default service
