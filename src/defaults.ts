import { AxiosRequestConfig } from './types'

const defaults: AxiosRequestConfig = {
  method: 'get',
  timeout: 0,
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  }
}

const methodsnoData = ['delete', 'get', 'head', 'options']
methodsnoData.forEach(method => {
  defaults.headers[method] = {}
})

const methodsWithData = ['post', 'put', 'patch']
methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-for-urlencoded'
  }
})

export default defaults
