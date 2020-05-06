import xhr from './xhr'
import { AxiosRequestConfig } from './types'
import { buildURL } from './helpers/url'
import { transformRequest } from './helpers/data'
import { processHeaders } from './helpers/headers'

function axios(config: AxiosRequestConfig): void {
  // 在正式发送请求前先处理（转化）所有数据成指定的格式
  processConfig(config)

  // 向服务器发送请求！！！
  xhr(config)
}

// 处理所有 config 的函数
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  // 需要先处理headers，不然处理data时会把data变成JSON格式，后面逻辑会出错
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

// 调用 url.ts 定义好的处理 url 格式函数
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

// 转化需要发送的 data 数据，变成 xhr 发送需要的格式
function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

// 当传入 headers 时的处理辅助函数
function transformHeaders(config: AxiosRequestConfig): any {
  // headers是可选参数，所以要赋个默认值，防止处理逻辑出错
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

export default axios
