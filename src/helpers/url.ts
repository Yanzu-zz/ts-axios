// helper 文件夹主要是存放 工具函数、辅助函数
import { isDate, isPlainObject } from './util'

interface URLOrigin {
  protocol: string
  host: string
}

// 自定义的 encode 函数
function encode(val: string): string {
  // 先调用自带的函数，再进行自定义的操作
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%24/g, '$')
    .replace(/%20/g, '+') // 链接里的空格需要替换成 + 号
    .replace(/%2C/gi, ',')
    .replace(/%3A/gi, ':')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

// 这里不 export default 是因为 工具函数后面可能会有很多
/**
 * 构建请求 url 函数
 * @param url    根 url
 * @param params 需要拼接的参数列表
 */
export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }

  // 存放最终返回的拼接字符串的数组，一个参数一个值
  const parts: string[] = []

  // 开始遍历 params 开始操作
  Object.keys(params).forEach(key => {
    const val = params[key]
    if (val === null || typeof val === 'undefined') {
      return // forEach 是跳不出去的，只能到下一个循环
    }

    let values = []
    // 判断 val（即某个对象属性的值）是否为array
    // 最后统一形式为数组
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      // 这样无论是否为数组都能进行下一步的操作
      values = [val]
    }

    // 对单个对象属性进行拼接操作（该单个属性可能是对象、数组等多元素值）
    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }

      // 这里的 key 和 val 可能需要进行 encode 操作
      // 这里为什么不直接调用自带的 encodeURIComponent 函数呢，因为我们还有自己的一些需求
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  // 拼接成最终指定格式的 url
  let serializedParams = parts.join('&')
  if (serializedParams) {
    // 判断是否有 hash 标识，有的话把原始url的 #后面字符全切掉
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }

    // 判断原始url是否带有 ?，有的话后面参数就是 &
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

// 利用 a 标签来判断两个 url 是否是同一个 protocol 和 host
const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}
