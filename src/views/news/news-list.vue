<template>
  <div>
    <Row type="flex" justify="space-between">
      <Col span="18">
      <Input v-model="query.key" icon="search" placeholder="请输入标题..." style="width: 200px" />
      </Col>
      <Col span="6">
      <Row type="flex" justify="end">
        <span>
          <Button type="primary" size="small" @click="add_news" icon="plus">添加</Button>
        </span>
      </Row>
      </Col>
    </Row>
    <Row class="margin-top-10 searchable-table-con1">
      <Table border :columns="tableColumns" :data="tableData"></Table>
    </Row>
  </div>

</template>

<script>
export default {
  name: 'user',
  data() {
    return {
      typeDic: [
        null,
        'Notice',
        'News',
        'Research',
        'Service',
        'Exchange',
        'Popularization',
        'Report'
      ],
      delayTimer: null, //用于搜索延迟
      query: {
        key: null,
        type: 1, //类型为3，规章制度
        offset: 0,
        limit: 10,
        order: 1,
        order_by: 'data_id'
      },
      tableColumns: [
        {
          // type: 'index',
          key: 'data_id',
          width: 60,
          align: 'center'
        },
        {
          title: '标题',
          key: 'title',
          render: (h, params) => {
            return h('div', [h('strong', params.row.title)])
          }
        },
        {
          title: '启用',
          key: 'enable',
          align: 'center',
          width: 70,
          render: (h, params) => {
            var enable =
              params.row.enable == 0
                ? false
                : params.row.enable == 1 ? true : false
            return h(
              'i-switch',
              {
                props: {
                  type: 'success',
                  size: 'small',
                  value: enable
                },
                on: {
                  'on-change': status => {
                    this.update_enable(status, params.row.data_id)
                  }
                }
              },
              ''
            )
          }
        },
        {
          title: '最近修改',
          key: 'updated_at',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('strong', this.filters.getCNDatetime(params.row.updated_at))
            ])
          }
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: `news${this.typeName}View`,
                        params: { data_id: params.row.data_id, type: this.type }
                      })
                    }
                  }
                },
                '查看'
              ),
              h(
                'Poptip',
                {
                  props: {
                    confirm: true,
                    title: '您确认删除这条内容吗？',
                    width: 200,
                    placement: 'left'
                  },
                  on: {
                    'on-ok': () => {
                      this.remove(params.row.data_id)
                    }
                  }
                },
                [
                  h(
                    'Button',
                    {
                      style: {
                        margin: '5px'
                      },
                      props: {
                        type: 'error',
                        size: 'small'
                      }
                    },
                    '删除'
                  )
                ]
              )
            ])
          }
        }
      ],
      tableData: []
    }
  },
  computed: {
    type() {
      return this.query.type
    },
    typeName() {
      return this.typeDic[this.type]
    }
  },
  watch: {
    'query.key': function(val, oldVal) {
      if (this.delayTimer) {
        clearTimeout(this.delayTimer)
      }
      this.delayTimer = setTimeout(() => {
        this.list()
      }, 500)
    },
    $route(to, from) {
      let params = this.$route.params
      if (!params || !params.type) {
        this.$Message.error({
          content: '参数错误，即将跳转至首页。',
          duration: 2
        })
        setTimeout(() => {
          this.$router.push({
            name: 'home',
            params: { type: this.type }
          })
        }, 1500)
        return
      }
      this.query.type = parseInt(params.type)
      this.list()
    }
  },
  methods: {
    async list() {
      let response = await this.apis.news.list(this.query)
      let result = response.data
      if (result.code === 0) {
        this.$Message.error({
          content: result.msg,
          duration: 1.5
        })
        return
      }
      this.tableData = result.data.rows
    },
    async update_enable(status, data_id) {
      let response = await this.apis.news.update({ enable: status }, data_id)
      let result = response.data
      if (result.code === 1) {
        this.$Message.success({
          content: result.msg,
          duration: 1.5
        })
      } else {
        this.$Message.error({
          content: result.msg,
          duration: 1.5
        })
      }
      this.list()
    },
    async remove(data_id) {
      let response = await this.apis.news.delete([data_id])
      let result = response.data
      if (result.code === 1) {
        this.$Message.success({
          content: result.msg,
          duration: 1.5
        })
      } else {
        this.$Message.error({
          content: result.msg,
          duration: 1.5
        })
      }
      this.list()
    },
    add_news() {
      this.$router.push({
        name: `news${this.typeName}Add`,
        params: { type: this.type }
      })
    }
  },
  mounted() {
    let params = this.$route.params
    if (!params || !params.type) {
      this.$Message.error({
        content: '参数错误，即将跳转至首页。',
        duration: 2
      })
      setTimeout(() => {
        this.$router.push({
          name: 'home',
          params: { type: this.type }
        })
      }, 1500)
      return
    }
    this.query.type = parseInt(params.type)
    this.list()
  }
}
</script>