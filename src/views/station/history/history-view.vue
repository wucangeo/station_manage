<template>
  <div id="history-view">
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
  name: 'history-view',
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
        keys: { type: 2 }, //类型为2，历史沿革
        limit: 1
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
        name: 'stationHistoryEdit'
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
