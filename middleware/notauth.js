/**
 * 如果用户已经登录了，跳转到首页
 */
export default function ({ store, redirect, route }) {
  // 若果用户已经登录授权
  if (store.state.user /*  && route.name !== 'register' */) {
    // 记录当前访问路径以便用户登录过后可以回到当前路径
    return redirect('/')
  }
}
