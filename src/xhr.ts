// 实际发送 xhr 请求文件
import { parseHeaders } from './helpers/headers'
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'

// 所有我们传入的参数，如：url,method,params,data 都是在这里赋值给原生 xhr 函数
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  // 其实实现函数 Promise 化不复杂，就是用原生Promise函数就好了😂
  return new Promise(resolve => {
    const { data = null, url, method = 'get', headers, responseType } = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    // 设置请求方式、请求地址以及是否异步
    request.open(method.toUpperCase(), url, true)

    // 注意，这函数是处理 服务器已接收到发送的请求，并响应传回来的 数据
    request.onreadystatechange = function headleLoad() {
      // readyState 不是4的话就没有接受到
      if (request.readyState !== 4) {
        return
      }

      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }

      // resolve 出去后，被调用时就可以用 .then() 啦
      // then((res)) 的res数据就是服务器onreadystatechange后返回的response参数
      resolve(response)
    }

    Object.keys(headers).forEach(name => {
      // 如果 data 没有传入，那么content-type属性的传入就没有意义了
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    // 正式发送请求
    request.send(data)
  })
}
