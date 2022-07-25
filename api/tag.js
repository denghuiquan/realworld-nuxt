import { request } from '@/plugins/request'
/**
 * 获取popular tags列表
 * @returns
 */
export const getTags = () => {
  return request({
    method: 'GET',
    url: '/api/tags'
  })
}
