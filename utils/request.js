/**
 * 基于axios进行封装的请求模块
 */
import axios from 'axios'
const request = axios.create({
  // baseURL: 'https://api.realworld.io'
  baseURL: 'http://realworld.api.fed.lagounews.com'
})

// 请求拦截器
// 任何请求都要经过请求拦截器
// 我们可以在请求拦截器中做一些公共业务处理，例如同一设置token
request.interceptors.request.use(
  function (config) {
    // do something before request sent
    // 请求发送之前就会经过这里
    config.headers.Authorization = `Token 用户token` // 用户token
    // 返回 config 请求配置对象
    return config
  },
  function (err) {
    return Promise.reject(err)
  }
)

// 响应拦截器

export default request
