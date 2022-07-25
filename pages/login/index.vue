<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? 'Sign in' : 'Sign up' }}</h1>
          <p class="text-xs-center">
            <!-- <a href="">Have an account?</a> -->
            <nuxt-link v-if="!isLogin" to="/login">Have an account?</nuxt-link>
            <nuxt-link v-else to="/register">Need an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <template v-for="(messages, filed) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ filed }} {{ message }}
              </li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset v-if="!isLogin" class="form-group">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                v-model="user.username"
                required
                minlength="2"
                maxlength="18"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="email"
                placeholder="Email"
                v-model="user.email"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                v-model="user.password"
                required
                minlength="8"
                maxlength="18"
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? 'Sign in' : 'Sign up' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from '@/api/user'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware: ['notauth'],
  data () {
    return {
      user: {
        username: '',
        email: '',
        password: ''
      },
      errors: {}
    }
  },
  computed: {
    isLogin () {
      return this.$route.name === 'login'
    }
  },
  methods: {
    async onSubmit () {
      // 表单校验
      try {
        const { data } = this.isLogin
          ? await login({ user: this.user })
          : await register({ user: this.user })

        // 保存登录状态信息 token
        this.$store.commit('setUser', data.user)
        // 防止刷新页面数据丢失，我们需要把登录数据持久化
        // 登录信息还需要做持久化处理，为了前后端都能拿到登录用户的状态信息
        // 我们使用JWT的形式 存放在cookie当中
        Cookie.set('user', JSON.stringify(data.user))

        this.$router.push('/')
      } catch (err) {
        this.errors = err.response.data.errors
      }
    }
  }
}
</script>
