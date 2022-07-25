<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages">
            <template v-for="(messages, filed) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ filed }} {{ message }}
              </li>
            </template>
          </ul>
          <form @submit.prevent>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="article.title"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="article.description"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="article.body"
                  required
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags (split with comma ,)"
                  v-model="tagListFat"
                />
                <div class="tag-list">
                  <ul class="tag-list">
                    <li
                      class="tag-pill tag-default"
                      v-for="(tag, index) in article.tagList"
                      :key="tag + index"
                    >
                      {{ tag }}
                    </li>
                  </ul>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="submit"
                @click="onPublishClick($event)"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createArticle, getArticle, updateArticle } from '@/api/article'
const blankArticle = {
  title: '',
  description: '',
  body: '',
  tagList: []
}
export default {
  name: 'EditorIndex',
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: ['auth'],
  async asyncData ({ params }) {
    const { slug } = params
    if (slug) {
      const { data } = await getArticle(slug)
      return {
        article: data.article,
        slug
      }
    }
    return {
      article: { ...blankArticle },
      slug
    }
  },
  data () {
    return {
      // article: { ...blankArticle },
      errors: {}
    }
  },
  computed: {
    tagListFat: {
      get () {
        return this.article.tagList.join(',')
      },
      set (val) {
        const tags = val !== '' ? val.split(/,/) : []
        // 最后保存的数据需要做过滤和trim操作，因为这里可能存在空格无意义tag
        this.article.tagList = tags
      }
    }
  },
  methods: {
    async onPublishClick ($event) {
      $event.target.disabled = true
      this.article.tagList = this.article.tagList
        .filter(i => {
          i.trim() !== ''
        })
        .map(i => i.trim())
      try {
        const { data } = this.slug
          ? await updateArticle(this.slug, this.article)
          : await createArticle(this.article)
        const { article: retArticle } = data
        console.log(retArticle)
        this.article = { ...blankArticle }

        this.$router.push({
          name: `article-slug`,
          params: {
            slug: retArticle.slug
          }
        })
      } catch (err) {
        this.errors = err.response.data.errors
      }
      $event.target.disabled = false
    }
  }
}
</script>
