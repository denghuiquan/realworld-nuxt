/**
 * 基于axios进行封装的请求模块
 */
import axios from 'axios'
// 创建请求对象
export const request = axios.create({
  baseURL: 'https://api.realworld.io'
  // baseURL: 'http://realworld.api.fed.lagounews.com'
})

// 插件导出函数必须作为default成员
// 通过nuxt的插件机制获取上下文对象context，{query, params, req, res, store ...}
export default ({ store }) => {
  // 请求拦截器
  // 任何请求都要经过请求拦截器
  // 我们可以在请求拦截器中做一些公共业务处理，例如同一设置token
  request.interceptors.request.use(
    function (config) {
      // do something before request sent
      // 请求发送之前就会经过这里
      const { user } = store.state
      if (user && user.token) {
        config.headers.Authorization = `Token ${user.token}` // 用户token
      }

      // 返回 config 请求配置对象
      return config
    },
    function (err) {
      // 如果请求失败（此时的请求还没发送出去）就会进入这里
      return Promise.reject(err)
    }

    // 响应拦截器
  )
}
