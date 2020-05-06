// 实际发送 xhr 请求文件

import { AxiosRequestConfig } from './types'

// 所有我们传入的参数，如：url,method,params,data 都是在这里赋值给原生 xhr 函数
export default function xhr(config: AxiosRequestConfig): void {
  const { data = null, url, method = 'get', headers } = config

  const request = new XMLHttpRequest()

  request.open(method.toUpperCase(), url, true)

  Object.keys(headers).forEach(name => {
    // 如果 data 没有传入，那么content-type属性的传入就没有意义了
    if (data === null && name.toLowerCase() === 'content-type') {
      delete headers[name]
    } else {
      request.setRequestHeader(name, headers[name])
    }
  })

  request.send(data)
}
