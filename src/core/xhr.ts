// 实际发送 xhr 请求文件
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookies'
import { isFormData } from '../helpers/util'

// 所有传入的参数，如：url,method,params,data 都是在这里赋值给原生 xhr 函数
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  // 其实实现函数 Promise 化不复杂，就是用原生Promise函数就好了😂
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers = {},
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onUploadProgress,
      onDownloadProgress,
      auth,
      validateStatus
    } = config

    const request = new XMLHttpRequest()

    // 设置请求方式、请求地址以及是否异步
    request.open(method!.toUpperCase(), url!, true)

    // 把每个步骤都单独拎出来成函数，依次执行，逻辑就清晰明了
    // 未来想再添加新功能或者注释掉一些不好的代码也不会让人抓狂了
    configureRequest()

    addEvents()

    processHeaders()

    processCancel()

    // 正式发送请求
    request.send(data)

    // 配置 request
    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }

      // 设置请求超时时间，否则程序默认为无限时间（单位 ms）
      if (timeout) {
        request.timeout = timeout
      }

      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    // 添加事件（在 XMLHttpRequest 事件基础上）
    function addEvents(): void {
      // 注意，这函数是处理 服务器已接收到发送的请求，并响应传回来的 数据
      request.onreadystatechange = function headleLoad() {
        // readyState 不是 4 的话就没有接收到
        if (request.readyState !== 4) {
          return
        }

        if (request.status === 0) {
          return
        }

        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        const responseData =
          responseType && responseType !== 'text' ? request.response : request.responseText
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
        handleResponse(response)
      }

      // 捕捉网络异常错误
      request.onerror = function handleError() {
        // reject 函数参数必须是个 Error 类，所以我们 new 一个传出去就好了
        // 另 onerror 触发的时候是没有response的，所以这里我们不传
        reject(createError('Network Error', config, null, request))
      }

      // 请求服务器超时
      request.ontimeout = function handleTimeout() {
        // 这里也没有response
        reject(createError(`Timeout of ${timeout} ms exceeded.`, config, 'ECONNABORTED', request))
      }

      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    // 处理 headers
    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      // XSRF 防御
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      Object.keys(headers).forEach(name => {
        // 如果 data 没有传入，那么content-type属性的传入就没有意义了
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    // 处理取消请求操作
    function processCancel(): void {
      // 取消请求
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }

    // 辅助函数，处理响应回调
    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}.`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
