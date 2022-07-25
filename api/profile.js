import { request } from '@/plugins/request'

/**
 * 生成当前模块api请求的url
 * @param {string} path
 * @returns
 */
const genModuleUrl = path => `/api/profiles${path}`

// Profile

// GET
// /profiles/{username}
// Get a profile
export const getProfile = username => {
  return request({
    method: 'GET',
    url: genModuleUrl(`/${username}`)
  })
}

// POST
// /profiles/{username}/follow
// Follow a user
export const followUser = username => {
  return request({
    method: 'POST',
    url: genModuleUrl(`/${username}/follow`)
  })
}
// DELETE
// /profiles/{username}/follow
// Unfollow a user
export const unfollowUser = username => {
  return request({
    method: 'DELETE',
    url: genModuleUrl(`/${username}/follow`)
  })
}
