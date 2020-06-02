import xhr from './xhr'
import { buildURL, isAbsoluteURL, combieURL } from '../helpers/url'
import { flattenheaders } from '../helpers/headers'
// import { transformRequest, transformResponse } from '../helpers/data'
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // 请求前判断之前是否取消了请求
  throwIfCancellationRequested(config)

  // 在正式发送请求前先处理（转化）所有数据成指定的格式
  processConfig(config)

  // 向服务器发送请求！！！
  // 并且返回的是 AxiosPromise 类型，这样我们的整个函数就实现 Promise 化了
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

// 处理所有 config 的函数
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  // 需要先处理headers，不然处理data时会把data变成JSON格式，后面逻辑会出错
  // config.headers = processHeaders(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenheaders(config.headers, config.method!)
}

// 调用 url.ts 定义好的处理 url 格式函数
export function transformURL(config: AxiosRequestConfig): string {
  let { url } = config
  const { params, paramsSerializer, baseURL } = config

  if (baseURL && !isAbsoluteURL(url!)) {
    url = combieURL(baseURL, url)
  }

  return buildURL(url!, params, paramsSerializer)
}

// 转化需要发送的 data 数据，变成 xhr 发送需要的格式
// function transformRequestData(config: AxiosRequestConfig): any {
//   return transformRequest(config.data)
// }

// 当传入 headers 时的处理辅助函数
// function transformHeaders(config: AxiosRequestConfig): any {
//   // headers是可选参数，所以要赋个默认值，防止处理逻辑出错
//   const { headers = {}, data } = config
//   return processHeaders(headers, data)
// }

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
