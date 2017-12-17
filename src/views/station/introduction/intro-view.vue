<template>
  <div id="intro-view">
    <Card>
      <Row type="flex" justify="space-between">
        <span class="news-title">
          {{news.title}}
        </span>
        <span>
          <Button type="primary" @click="edit_intro" icon="edit">编辑</Button>
        </span>
      </Row>
    </Card>
    <Card class="ql-editor">
      <div v-html="news.content"></div>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      news: {
        title: '',
        content: ''
      }
    }
  },
  methods: {
    async get() {
      let query = {
        type: 1
      }
      let response = await this.apis.station.list(query)
      let result = response.data
      if (result.code === 0) {
        this.$Message.error({
          content: result.msg,
          duration: 1.5
        })
        return
      }
      if (!result.data.rows || result.data.rows.length === 0) {
        this.$Message.error({
          content: '未获取到数据，请联系管理员初始数据。',
          duration: 1.5
        })
        return
      }
      this.news = result.data.rows[0]
    },
    edit_intro() {
      this.$router.push({
        name: 'stationIntroductionEdit'
      })
    }
  },
  mounted() {
    this.get()
  }
}
</script>
<style lang="less">
.news-title {
  font-size: 20px;
  font-weight: 600;
}
</style>
