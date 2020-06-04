import { isPlainObject, deepMerge } from './util'
import { Method } from '../types'

// 用来把headers的指定normalizeName属性名规范化（如全部转化成大写字母）的辅助函数
function normalizeHeaderName(headers: any, normalizeName: string): void {
  if (!headers) {
    return
  }

  Object.keys(headers).forEach(name => {
    if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
      // 转移数据阵地到 normalizeName 上去
      headers[normalizeName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  const headerKey = 'Content-Type'

  // 把可能大小写不规范的 Content-Type 转化成规范的
  normalizeHeaderName(headers, headerKey)

  if (isPlainObject(data)) {
    if (headers && !headers[headerKey]) {
      headers[headerKey] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

/**
 * 解析服务器返回响应的headers字符串，变成我们想要的对象格式
 * @param headers 传入的待解析headers字符串
 */
export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }

  // 每一行就是一个对象，我们按照 XXX: YYY 的原始格式进行分割、赋值操作
  headers.split('\r\n').forEach(line => {
    let [key, ...vals] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return // forEach里面使用 return 相当于 continue 作用
    }

    let val = vals.join(':').trim()
    parsed[key] = val
  })

  return parsed
}

// 处理掉请求前传入的 config 中 headers 里格式不正确的值
export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }

  headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']
  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
