<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">{{ brand }}</h1>
        <p>{{ description }}</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'your_feed' }"
                  :to="{
                    name: 'index',
                    query: {
                      tab: 'your_feed'
                    }
                  }"
                  exact
                  >Your Feed</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'global_feed' }"
                  :to="{
                    name: 'index',
                    query: {
                      tab: 'global_feed'
                    }
                  }"
                  exact
                  >Global Feed</nuxt-link
                >
              </li>
              <li class="nav-item" v-if="$route.query.tag">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'tag'
                  }"
                  :to="{
                    name: 'index',
                    query: {
                      tab: 'tag',
                      tag: $route.query.tag
                    }
                  }"
                  ><i class="ion-pound"></i>{{ $route.query.tag }}</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div class="article-preview" v-if="!articles.length">
            No articles are here... yet.
          </div>
          <article-preview
            :article="article"
            v-for="article in articles"
            :key="article.slug"
          ></article-preview>
          <!-- list-pagination -->
          <nav>
            <ul class="pagination">
              <li
                v-for="page in totalPages"
                class="page-item"
                :class="{
                  active: page === currentPage
                }"
                :key="page"
              >
                <a
                  class="page-link"
                  v-if="page === currentPage"
                  href="javascript:void(0);"
                  >{{ page }}</a
                >
                <nuxt-link
                  v-else
                  class="page-link"
                  :to="{
                    name: 'index',
                    query: {
                      page: page,
                      tag: $route.query.tag,
                      tab: tab
                    }
                  }"
                  >{{ page }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <nuxt-link
                class="tag-pill tag-default"
                :to="{
                  name: 'index',
                  query: {
                    tab: 'tag',
                    tag: tag
                  }
                }"
                v-for="tag in tags"
                :key="tag"
                >{{ tag }}</nuxt-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getArticles, getFeedArticles } from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'

export default {
  name: 'HomePage',
  watchQuery: ['page', 'tag', 'limit', 'tab'],
  async asyncData ({ query, store }) {
    const currentPage = Number.parseInt(query.page) || 1
    const limit = Number.parseInt(query.limit) || 20
    const tag = query.tag
    const tab = query.tab || 'global_feed'

    const loadArticles =
      store.state.user && query.tab === 'your_feed'
        ? getFeedArticles
        : getArticles

    try {
      // 这里的limit设置会导致articlesCount值的改变
      // 所以这里需要两次请求
      const ret = await Promise.all([
        loadArticles({
          tag: tag
        }),
        loadArticles({
          limit: limit,
          offset: (currentPage - 1) * limit,
          tag: tag
        }),
        getTags()
      ])

      const { articlesCount } = ret[0].data
      const { articles } = ret[1].data
      const { tags } = ret[2].data
      return {
        articlesCount,
        articles,
        limit,
        currentPage,
        tags,
        tab
      }
    } catch (error) {
      return {
        articlesCount: 0,
        articles: [],
        limit,
        currentPage,
        tags: [],
        tab: 'global_feed'
      }
    }
  },
  computed: {
    ...mapState(['user']),
    totalPages () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  data () {
    return {
      description: 'A place to share your knowledge.'
    }
  },
  methods: {}
}
</script>
<style scoped></style>
