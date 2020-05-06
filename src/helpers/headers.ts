import { isPlainObject } from './util'

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
