// import request from '@/utils/request'
import { request } from '@/plugins/request'

/**
 * 生成当前模块api请求的url
 * @param {string} path
 * @returns
 */
const genModuleUrl = path => `/api/users${path}`
/**
 * 用户登录
 * @param {{user:{email: string, password:string}}} data
 * @returns
 */
export const login = data => {
  return request({
    method: 'POST',
    url: genModuleUrl('/login'),
    data
  })
}
/**
 * 用户注册
 * @param {{ user: { username: string, email: string, password: string}}} data
 * @returns
 */
export const register = data => {
  return request({
    method: 'POST',
    url: genModuleUrl(''),
    data
  })
}
/**
 * Gets the currently logged-in user
 * @returns user
 */
export const getUser = () => {
  return request({
    method: 'GET',
    url: '/api/user'
    /* headers: {
      Authorization: `Token ${user.token}`
    } */
  })
}

/**
 * User details to update. At least one field is required.
 * @param {user: {email: string,token: string,username: string,bio: string,image: string}} user
 * @returns
 */
export const updateUser = user => {
  return request({
    method: 'PUT',
    url: '/api/user',
    data: {
      user
    }
  })
}
