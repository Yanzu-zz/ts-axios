import Axios from './core/Axios'
import { AxiosInstance, AxiosRequestConfig } from './types'
import { extend } from './helpers/util'
import defaults from './defaults'

function createInstance(config: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(config)
  // 这里需要用bing绑定当前的上下文context，不然会是 core/Axios 里面的this上下文
  const instance = Axios.prototype.request.bind(context)

  // 把 context 的所有原型属性全部拷贝到 instance 里
  extend(instance, context)

  return instance as AxiosInstance
}

// 这样我们就可以像之前那样使用 axios，也拥有了 Axios 类中的原型属性和方法
const axios = createInstance(defaults)

export default axios
