<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile-username',
        params: {
          username: article.author.username
        }
      }"
      ><img :src="article.author.image"
    /></nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{
          name: 'profile-username',
          params: {
            username: article.author.username
          }
        }"
        class="author"
        >{{ article.author.username }}</nuxt-link
      >
      <span class="date">{{ article.createdAt | date('MMMM DD, YYYY') }}</span>
    </div>
    <span v-if="canModify">
      <nuxt-link
        class="btn btn-outline-secondary btn-sm"
        :to="{
          name: 'editor-slug',
          params: {
            slug: article.slug
          }
        }"
      >
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>

      <button
        class="btn btn-outline-danger btn-sm"
        @click="onDelArticle(article, $event)"
      >
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </span>
    <span v-else>
      <button
        class="btn btn-sm btn-outline-secondary"
        @click="onFollow(article.author, $event)"
        :class="{
          active: article.author.following
        }"
      >
        <i
          :class="{
            'ion-plus-round': !article.author.following,
            'ion-minus-round': article.author.following
          }"
        ></i>
        &nbsp; {{ article.author.following ? 'Unfollow' : 'Follow' }}
        {{ article.author.username }}
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        @click="onFavorite(article, $event)"
        :class="{
          active: article.favorited
        }"
      >
        <i class="ion-heart"></i>
        &nbsp; {{ article.favorited ? 'Unfavorite Post' : 'Favorite Post' }}
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </span>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { favoriteArticle, unfavoriteArticle, delArticle } from '@/api/article'
import { followUser, unfollowUser } from '@/api/profile'
export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['user']),
    canModify () {
      return this.user && this.user.username === this.article.author.username
    }
  },
  methods: {
    async onFavorite (article, $event) {
      if (!this.user) {
        return this.$router.push({
          name: 'login'
        })
      }
      $event.target.disabled = true
      try {
        const { slug, favorited } = article
        const { data } = favorited
          ? await unfavoriteArticle(slug)
          : await favoriteArticle(slug)

        article.favorited = data.article.favorited
        article.favoritesCount = data.article.favoritesCount
      } catch (error) {}
      // 还原按钮状态
      $event.target.disabled = false
    },

    async onFollow (user, $event) {
      if (!this.user) {
        return this.$router.push({
          name: 'login'
        })
      }
      $event.target.disabled = true
      try {
        const { username, following } = user
        const { data } = following
          ? await unfollowUser(username)
          : await followUser(username)

        user.following = data.profile.following
      } catch (error) {}
      // 还原按钮状态
      $event.target.disabled = false
    },
    async onDelArticle (article, $event) {
      $event.target.disabled = true
      try {
        await delArticle(article.slug)
        // 删除后返回到上一个页面
        this.$router.back()
      } catch (error) {}
      // 还原按钮状态
      $event.target.disabled = false
    }
  }
}
</script>
<style scoped></style>
