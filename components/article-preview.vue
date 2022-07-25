<template>
  <div class="article-preview">
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
          class="author"
          :to="{
            name: 'profile-username',
            params: {
              username: article.author.username
            }
          }"
          >{{ article.author.username }}</nuxt-link
        >
        <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
      </div>
      <button
        class="btn btn-outline-primary btn-sm pull-xs-right"
        :class="{ active: article.favorited }"
        @click="onFavorite(article, $event)"
      >
        <i class="ion-heart"></i> {{ article.favoritesCount }}
      </button>
    </div>
    <div class="preview-link">
      <nuxt-link
        :to="{
          name: 'article-slug',
          params: {
            slug: article.slug
          }
        }"
      >
        <h1>
          {{ article.title }}
        </h1>
        <p>{{ article.description }}</p>
        <span>Read more...</span>
      </nuxt-link>
      <ul class="tag-list">
        <li
          class="tag-pill tag-default tag-outline"
          v-for="tag in article.tagList"
          :key="tag"
        >
          <nuxt-link
            :to="{
              name: 'index',
              query: {
                tab: 'tag',
                tag: tag
              }
            }"
            >{{ tag }}</nuxt-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { favoriteArticle, unfavoriteArticle } from '@/api/article'
export default {
  name: 'ArticlePreview',
  props: {
    article: {
      type: Object,
      required: true
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
    }
  }
}
</script>
