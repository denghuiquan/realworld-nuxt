<template>
  <div>
    <h1 class="error">Page Not Found: {{ $route.path }}</h1>
    <p class="error-messages">Will redirect to home page '/' in 3 seconds.</p>
    <nuxt-link to="/">Back Home page manually</nuxt-link>
  </div>
</template>
<script>
export default {
  mounted () {
    setTimeout(() => {
      this.$router.push({
        name: 'index'
      })
    }, 3000)
  }
}
</script>
