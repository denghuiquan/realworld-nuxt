<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <!-- <a class="navbar-brand" href="/">conduit</a> -->
      <nuxt-link class="navbar-brand" to="/">conduit</nuxt-link>
      <ul class="nav navbar-nav pull-xs-right">
        <li class="nav-item">
          <!-- Add "active" class when you're on that page" -->
          <nuxt-link class="nav-link" to="/" exact>Home</nuxt-link>
        </li>
        <template v-if="user">
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/editor">
              <i class="ion-compose"></i>&nbsp;New Article
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/settings">
              <i class="ion-gear-a"></i>&nbsp;Settings
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link
              class="nav-link"
              :to="{
                name: 'profile-username',
                params: {
                  username: user.username
                }
              }"
            >
              <img
                class="user-pic"
                :src="
                  user.image ||
                    'https://api.realworld.io/images/smiley-cyrus.jpeg'
                "
              />
              {{ user.username }}
            </nuxt-link>
          </li>
          <li class="nav-item">
            <a href="javascript:void(0);" class="nav-link" @click="logout()"
              ><i class="ion-log-out"></i>Logout</a
            >
          </li>
        </template>
        <template v-else>
          <li class="nav-item">
            <!-- <a class="nav-link" href="/login">Sign in</a> -->
            <nuxt-link class="nav-link" to="/login">Sign in</nuxt-link>
          </li>
          <li class="nav-item">
            <!-- <a class="nav-link" href="/register">Sign up</a> -->
            <nuxt-link class="nav-link" to="/register">Sign up</nuxt-link>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  name: 'TheHeader',
  computed: {
    ...mapState(['user'])
  },
  methods: {
    logout () {
      this.$store.commit('delUser')
      Cookie.remove('user')
      this.$router.push('/login')
    }
  }
}
</script>
