import axios from '../../src/index'

axios.interceptors.request.use(config => {
  config.headers.test += '1'
  return config
})
axios.interceptors.request.use(config => {
  config.headers.test += '2'
  return config
})
axios.interceptors.request.use(config => {
  config.headers.test += '3'
  return config
})

axios.interceptors.response.use(res => {
  res.data += '1'
  return res
})
// 获取这个 '2' 拦截器的id，准备测试删除
let interceptor = axios.interceptors.response.use(res => {
  res.data += '2'
  return res
})
axios.interceptors.response.use(res => {
  res.data += '3'
  return res
})

axios.interceptors.response.eject(interceptor)

axios({
  url: '/interceptor/get',
  method: 'get',
  headers: {
    test: ''
  }
}).then((res) => {
  // 这表明拦截器修改的是 服务器已经返回到客户端的数值 ，而不是服务器本身的数值
  console.log(res)
  console.log(res.data)
})
