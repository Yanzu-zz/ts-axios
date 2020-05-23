import { ResolvedFn, RejectedFn } from '../types'

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }

  // 给外界提供一个遍历拦截器的函数
  // 此函数没有在 interface 处定义是因为这不是给用户使用的，是给拦截器实现内部逻辑用的
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }

  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })

    return this.interceptors.length - 1
  }

  eject(id: number): void {
    if (this.interceptors[id]) {
      // 注意，删除某个拦截器的时候不能改变数组长度
      // 否则有多个拦截器时可能会因为变了索引而出错
      this.interceptors[id] = null
    }
  }
}
