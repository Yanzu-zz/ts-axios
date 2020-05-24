import { AxiosTransformer } from '../types'

export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (!fns) {
    return data
  }

  // 如果只有一个转换函数，就把他变成一维数组，统一格式方便下面操作
  if (!Array.isArray(fns)) {
    fns = [fns]
  }

  // 把转换函数数组遍历一次，依次执行
  fns.forEach(fn => {
    data = fn(data, headers)
  })

  return data
}
