<template>
  <div id="history-view">
    <Card>
      <Row type="flex" justify="space-between">
        <span class="news-title">
          {{news.title}}
        </span>
        <span>
          <Button type="primary" @click="edit_news" icon="edit">编辑</Button>
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
      typeDic: [
        null,
        null,
        null,
        null,
        'thematicProduction',
        'thematicScience',
        'scientificKnowledge'
      ],
      data_id: null,
      news: {
        type: 1,
        title: '',
        content: ''
      }
    }
  },
  computed: {
    type() {
      return this.news.type
    },
    typeName() {
      return this.typeDic[this.type]
    }
  },
  methods: {
    async get(data_id) {
      let response = await this.apis.station.get(data_id)
      let result = response.data
      if (result.code === 0) {
        this.$Message.error({
          content: result.msg,
          duration: 1.5
        })
        return
      }
      if (!result.data) {
        this.$Message.error({
          content: '未获取到数据，请联系管理员初始数据。',
          duration: 1.5
        })
        return
      }
      this.news = result.data
    },
    edit_news() {
      this.$router.push({
        name: `${this.typeName}Edit`,
        params: { data_id: this.data_id }
      })
    }
  },
  mounted() {
    let params = this.$route.params
    if (!params || !params.data_id || !params.type) {
      this.$Message.error({
        content: '参数错误，即将跳转至规章制度列表。',
        duration: 1.5
      })
      setTimeout(() => {
        this.$router.push({
          name: `${this.typeName}List`,
          params: { type: this.type }
        })
      }, 1500)
      return
    }
    this.data_id = params.data_id
    this.news.type = parseInt(params.type)
    this.get(this.data_id)
  }
}
</script>
<style lang="less">
.news-title {
  font-size: 20px;
  font-weight: 600;
}
</style>
