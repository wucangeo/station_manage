<template>
  <div id="intro-view">
    <Card>
      <Row type="flex" justify="space-between">
        <span class="news-title">
          水土保持试验站简介
        </span>
        <span>
          <Button type="primary" @click="edit_intro" icon="edit">编辑</Button>
        </span>
      </Row>
    </Card>
    <Card>
      <div v-html="content"></div>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      content: `<p class="tip">在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 <a href="https://en.wikipedia.org/wiki/Cross-site_scripting" target="_blank" rel="noopener">XSS 攻击</a>。只在可信内容上使用 <code>v-html</code>，<strong>永不</strong>用在用户提交的内容上。</p>`
    }
  },
  methods: {
    edit_intro() {
      this.$router.push({
        name: 'stationIntroductionEdit'
      })
    }
  }
}
</script>
<style lang="less">
.news-title {
  font-size: 20px;
  font-weight: 600;
}
</style>
