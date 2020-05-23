// 项目中所有的类型编译文件，即类型定义
export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

// 发送请求时的数据格式接口
export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number

  [propName: string]: any
}

// 发送请求完毕后，接收响应的数据格式接口
export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

// 调用axios返回错误对象格式的接口
export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
}

export interface Axios {
  defaults: AxiosRequestConfig
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }

  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInstance extends Axios {
  // 这样这个接口就有 Axios 的对象属性，又有自身的函数定义
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 拦截器对外接口
export interface AxiosInterceptorManager<T> {
  // 添加一个拦截器
  use(soloved: ResolvedFn<T>, rejected?: RejectedFn): number
  // 删除一个拦截器
  eject(id: number): void
}

// 每一次链式处理完毕后返回的数据类型定义
export interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}
