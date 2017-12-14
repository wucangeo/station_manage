<template>
  <div id="main" class="app-main">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  mounted() {
    this.verify()
  },
  beforeDestroy() {},
  methods: {
    verify() {
      this.apis.user
        .verify()
        .then(res => {
          if (res.status === 401) {
            this.$router.push({ name: 'login' })
          }
        })
        .catch(err => {
          this.$router.push({ name: 'login' })
        })
    }
  }
}
</script>

<style>
.app-main {
  width: 100%;
  height: 100%;
}
</style>
