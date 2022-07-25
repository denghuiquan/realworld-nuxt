<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio || 'This lazy guy leaves nothing...' }}
            </p>
            <button
              v-if="!user || profile.username !== user.username"
              class="btn btn-sm btn-outline-secondary action-btn"
              @click="onFollow(profile, $event)"
              :class="{
                active: profile.following
              }"
            >
              <i
                :class="{
                  'ion-plus-round': !profile.following,
                  'ion-minus-round': profile.following
                }"
              ></i>
              &nbsp; {{ profile.following ? 'Unfollow' : 'Follow' }}
              {{ profile.username }}
            </button>
            <nuxt-link
              v-else
              class="btn btn-sm btn-outline-secondary action-btn"
              :to="{
                name: 'settings'
              }"
            >
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab !== 'favorited' }"
                  :to="{
                    name: 'profile-username',
                    params: {
                      username: profile.username
                    }
                  }"
                  exact
                  >{{
                    user && profile.username === user.username
                      ? 'My'
                      : 'His/Her'
                  }}
                  Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'favorited' }"
                  :to="{
                    name: 'profile-username',
                    params: {
                      username: profile.username
                    },
                    query: {
                      tab: 'favorited'
                    }
                  }"
                  exact
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>
          <div v-if="!articles.length && !loading" class="article-preview">
            No articles are here... yet.
          </div>
          <div v-if="loading" class="article-preview">
            Loading articles...
          </div>
          <article-preview
            :article="article"
            v-for="article in articles"
            :key="article.slug"
          ></article-preview>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getProfile, followUser, unfollowUser } from '@/api/profile'
import { getArticles } from '@/api/article'

export default {
  name: 'UserProfile',
  middleware: ['auth'],
  watchQuery: ['tab'],
  computed: {
    ...mapState(['user'])
  },
  async asyncData ({ params, query }) {
    const { data } = await getProfile(params.username)
    return {
      profile: data.profile,
      tab: query.tab
    }
  },
  methods: {
    async onFollow (profile, $event) {
      if (!this.user) {
        return this.$router.push({
          name: 'login'
        })
      }
      $event.target.disabled = true
      try {
        const { username, following } = profile
        const { data } = following
          ? await unfollowUser(username)
          : await followUser(username)

        profile.following = data.profile.following
      } catch (error) {}
      // 还原按钮状态
      $event.target.disabled = false
    },
    async loadArticles () {
      this.loading = true
      const key = this.tab && this.tab === 'favorited' ? 'favorited' : 'author'
      const params = {
        [key]: this.profile.username
      }

      const { data } = await getArticles(params)
      this.articles = data.articles
      this.loading = false
    }
  },
  mounted () {
    this.loadArticles()
  },
  data () {
    return {
      articles: [],
      loading: true
    }
  },
  watch: {
    tab (oval, nval) {
      this.loadArticles()
    }
  }
}
</script>
