const cookieparser = process.server ? require('cookieparser') : undefined
// 在服务端渲染期间运行都是同一个实例
// 为了防止数据冲突，务必把state定义成一个函数，返回数据对象
export const state = () => ({
  user: null
})

export const mutations = {
  setUser (state, user) {
    state.user = user
  },
  delUser (state) {
    state.user = null
  }
}

export const actions = {
  // nuxt 中一个特殊的 action 方法
  // 这个action 会在服务端渲染期间自动调用
  // 作用是：初始化容器数据，传递数据给客户端使用
  nuxtServerInit ({ commit }, { req }) {
    let user = null
    // 如果请求头中有cookie
    if (req.headers.cookie) {
      // 使用 cookieparser把cookie字符串转换成一个对象
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (error) {
        // No valid cookie found
      }
    }
    // 提交mutation 修改 state 状态
    commit('setUser', user)
  }
}
