import Axios from './core/Axios'
import defaults from './defaults'
import { extend } from './helpers/util'
import mergeConfig from './core/mergeConfig'
import { AxiosRequestConfig, AxiosStatic } from './types'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  // 这里需要用bing绑定当前的上下文context，不然会是 core/Axios 里面的this上下文
  const instance = Axios.prototype.request.bind(context)

  // 把 context 的所有原型属性全部拷贝到 instance 里
  extend(instance, context)

  return instance as AxiosStatic
}

// 这样我们就可以像之前那样使用 axios，也拥有了 Axios 类中的原型属性和方法
const axios = createInstance(defaults)

axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.all = function all(promises) {
  return Promise.all(promises)
}

axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}

axios.Axios = Axios

export default axios
