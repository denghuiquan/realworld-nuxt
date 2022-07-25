<template>
  <div>
    <form class="card comment-form" @submit.prevent="createComment($event)">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          v-model="newComment"
          minlength="1"
          maxlength="2000"
          required
        ></textarea>
      </div>
      <div class="card-footer">
        <img
          :src="
            user
              ? user.image
              : 'https://api.realworld.io/images/smiley-cyrus.jpeg'
          "
          class="comment-author-img"
        />
        <button class="btn btn-sm btn-primary" type="submit">
          Post Comment
        </button>
      </div>
    </form>

    <div class="card" v-for="(comment, index) in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">
          {{ comment.body }}
        </p>
      </div>
      <div class="card-footer">
        <nuxt-link
          :to="{
            name: 'profile-username',
            params: {
              username: comment.author.username
            }
          }"
          class="comment-author"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          :to="{
            name: 'profile-username',
            params: {
              username: comment.author.username
            }
          }"
          class="comment-author"
          >{{ comment.author.username }}</nuxt-link
        >
        <span class="date-posted">{{
          comment.createdAt | date('MMM DD, YYYY')
        }}</span>
        <span class="mod-options" v-if="canModify(comment)">
          <i
            class="ion-trash-a"
            @click="deleteComment(index, comment, $event)"
          ></i>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { getComments, addComment, delComment } from '@/api/article'
import { mapState } from 'vuex'

export default {
  name: 'ArticleComments',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['user']),
    canModify () {
      return comment =>
        this.user && this.user.username === comment.author.username
    }
  },
  data () {
    return {
      comments: [], // 文章的评论列表
      newComment: ''
    }
  },
  async mounted () {
    const { data } = await getComments(this.article.slug)
    this.comments = data.comments
  },
  methods: {
    async createComment ($event) {
      if (!this.user) {
        return this.$router.push({
          name: 'login'
        })
      }
      $event.target.disabled = true
      const { data } = await addComment(this.article.slug, {
        comment: {
          body: this.newComment
        }
      })
      this.comments.push(data.comment)
      this.newComment = ''
      $event.target.disabled = false
    },
    async deleteComment (index, comment, $event) {
      $event.target.disabled = true
      const { data } = await delComment(this.article.slug, comment)
      this.comments.splice(index, 1)
      $event.target.disabled = false
    }
  }
}
</script>
<style scoped></style>
