/**
 * nuxt 项目配置文件
 */
export default {
  // SEO优化
  head: {
    title: 'conduit Home Page - Realworld',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'A place to share your knowledge.'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ]
  },
  components: true, // 开启components目录得到组件自动加载注册功能
  router: {
    linkActiveClass: 'active',
    linkExactActiveClass: 'active',
    // 配置自定义路由设置可以抛弃默认路由全部使用自定义路由，让项目路由配置更加灵活
    extendRoutes (routes, resolve) {
      // 清空默认routes 可采用下面的方法
      // routes.splice(0)
      routes.push(
        ...[
          {
            name: 'register',
            path: '/register',
            component: resolve(__dirname, 'pages/login/'),
            chunkName: 'pages/login/register'
          },
          {
            name: 'editor-slug',
            path: '/editor/:slug?',
            component: resolve(__dirname, 'pages/editor/'),
            chunkName: 'pages/editor/_slug'
          },
          {
            // will match everything
            name: 'notfound',
            path: '*',
            component: resolve(__dirname, 'pages/404')
          }
        ]
      )
    }
  },
  // 注册插件
  plugins: ['~/plugins/request.js', '~/plugins/filters.js'],
  transition: 'fade'
}
