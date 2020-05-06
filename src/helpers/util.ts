// 更通用的方法文件

const toString = Object.prototype.toString

// 判断是否为 Date 类型
export function isDate(val: any): val is Date {
  // 这种写法老js程序员了，原理不用多说
  return toString.call(val) === '[object Date]'
}

// export function isObject(val: any): val is Object {
//   // 直接 typeof 判断是否为 object 时，值为null也会返回true
//   // 所以要加个 val != null
//   return val !== null && typeof val === 'object'
// }

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}
