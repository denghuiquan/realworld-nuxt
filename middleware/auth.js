/**
 * 验证是否已经登录的中间件
 * 在需要用户登录的页面中配置使用中间件
 * 也就是说想保护那个页面就在那个页面进行配置使用即可
 */
export default function ({ store, redirect, route }) {
  // 若果用户没有登录
  if (!store.state.user) {
    if (
      !route.path.startsWith('/editor') &&
      !route.path.startsWith('/settings')
    ) {
      return
    }
    // 记录当前访问路径以便用户登录过后可以回到当前路径
    return redirect('/login')
  }
}
