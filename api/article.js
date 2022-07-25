// import request from '@/utils/request'
import { request } from '@/plugins/request'

/**
 * 生成当前模块api请求的url
 * @param {string} path
 * @returns
 */
const genModuleUrl = (path = '') => `/api/articles${path}`
// Articles

// GET
// /articles/feed
// Get recent articles from users you follow
export const getFeedArticles = params => {
  return request({
    method: 'GET',
    url: genModuleUrl('/feed'),
    /* headers: {
      // 因为这里无法拿到user相应的数据，所以我们有必要使用请求拦截器进行auth注入
      Authorization: `Token ${user.token}`
    }, */
    params
  })
}

// GET
// /articles
// Get recent articles globally
/**
 * Get most recent articles globally. Use query parameters to filter results. Auth is optional
 * @param {*} params
 * tag
 * string
 * (query)
 * Filter by tag

 * author
 * string
 * (query)
 * Filter by author (username)

 * favorited
 * string
 * (query)
 * Filter by favorites of a user (username)

 * limit
 * integer
 * (query)
 * Limit number of articles returned (default is 20)

 * Default value : 20

 * offset
 * integer
 * (query)
 * Offset/skip number of articles (default is 0)

 * Default value : 0
 * @returns
 */
export const getArticles = params => {
  return request({
    method: 'GET',
    url: genModuleUrl(),
    params
  })
}

// POST
// /articles
// Create an article
export const createArticle = article => {
  return request({
    method: 'POST',
    url: genModuleUrl(),
    data: {
      article: article
    }
  })
}

// GET
// /articles/{slug}
// Get an article
export const getArticle = slug => {
  return request({
    method: 'GET',
    url: genModuleUrl(`/${slug}`)
  })
}

// PUT
// /articles/{slug}
// Update an article
export const updateArticle = (slug, article) => {
  return request({
    method: 'PUT',
    url: genModuleUrl(`/${slug}`),
    data: {
      article: article
    }
  })
}

// DELETE
// /articles/{slug}
// Delete an article
export const delArticle = slug => {
  return request({
    method: 'DELETE',
    url: genModuleUrl(`/${slug}`)
  })
}

// Favorites

// POST
// /articles/{slug}/favorite
// Favorite an article
export const favoriteArticle = slug => {
  return request({
    method: 'POST',
    url: genModuleUrl(`/${slug}/favorite`)
  })
}

// DELETE
// /articles/{slug}/favorite
// Unfavorite an article
export const unfavoriteArticle = slug => {
  return request({
    method: 'DELETE',
    url: genModuleUrl(`/${slug}/favorite`)
  })
}

// Comments

// GET
// /articles/{slug}/comments
// Get comments for an article
export const getComments = slug => {
  return request({
    method: 'GET',
    url: genModuleUrl(`/${slug}/comments`)
  })
}

// POST
// /articles/{slug}/comments
// Create a comment for an article
export const addComment = (slug, comment) => {
  return request({
    method: 'POST',
    url: genModuleUrl(`/${slug}/comments`),
    data: comment
  })
}

// DELETE
// /articles/{slug}/comments/{id}
// Delete a comment for an article
export const delComment = (slug, comment) => {
  return request({
    method: 'DELETE',
    url: genModuleUrl(`/${slug}/comments/${comment.id}`)
  })
}
