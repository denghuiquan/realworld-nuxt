<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <ul class="error-messages">
            <template v-for="(messages, filed) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ filed }} {{ message }}
              </li>
            </template>
          </ul>
          <ul class="success-messages">
            <template v-for="(messages, filed) in infos">
              <li v-for="(message, index) in messages" :key="index">
                {{ filed }} {{ message }}
              </li>
            </template>
          </ul>
          <h1 class="text-xs-center">Your Settings</h1>
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  v-model="user.image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="user.username"
                  required
                  minlength="3"
                  maxlength="18"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="user.bio"
                ></textarea>
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
                  minlength="8"
                  maxlength="16"
                />
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                @click="updateUser($event)"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getUser, updateUser } from '@/api/user'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  name: 'Settings',
  async asyncData () {
    try {
      const { data } = await getUser()
      return { user: data.user }
    } catch (err) {
      this.errors = err.response.data.errors
    }
  },
  middleware: ['auth'],
  data () {
    return {
      errors: {},
      infos: {}
    }
  },
  methods: {
    async updateUser ($event) {
      $event.target.disabled = true
      try {
        console.log(this.user)
        // 这个 PUT user api 更新数据有问题，bio跟image有点混了，后台api的问题
        const { data } = await updateUser(this.user)
        console.log(data.user)
        // 更新登录用户信息
        this.$store.commit('setUser', data.user)
        // 防止刷新页面数据丢失，我们需要把登录数据持久化
        // 登录信息还需要做持久化处理，为了前后端都能拿到登录用户的状态信息
        // 我们使用JWT的形式 存放在cookie当中
        Cookie.set('user', JSON.stringify(data.user))
        this.infos = { success: ['User updated successfully.'] }
        setTimeout(() => {
          this.infos = {}
        }, 2000)
      } catch (err) {
        this.errors = err.response.data.errors
      }
      $event.target.disabled = false
    }
  }
}
</script>
