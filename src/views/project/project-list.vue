<template>
  <div>
    <Row type="flex" justify="space-between">
      <Col span="18">
      <Input v-model="query.keys.title" icon="search" placeholder="请输入搜索关键词..." style="width: 200px" />
      </Col>
      <Col span="6">
      <Row type="flex" justify="end">
        <span>
          <Button type="warning" size="small" @click="trash_data" icon="trash-b">回收站</Button>
          <Button type="primary" size="small" @click="add_data" icon="plus">添加</Button>
        </span>
      </Row>
      </Col>
    </Row>
    <Row class="margin-top-10">
      <Table border :columns="tableColumns" :data="tableData.rows" :height="table_height"></Table>
    </Row>
    <Row class="margin-top-10">
      <Page :total="tableData.count" :page-size="query.limit" @on-change="page_change" show-elevator show-total></Page>
    </Row>
  </div>

</template>

<script>
export default {
  name: 'project',
  data() {
    return {
      typeDic: [null, 'kjb', 'jjw', 'zky', 'qtbw', 'df', 'qt'],
      delayTimer: null, //用于搜索延迟
      page_num: 1,
      table_height: 600, //表格高度
      query: {
        keys: {
          title: null,
          type: 1, //1科技部项目；2基金委项目；3中科院项目；4其他部委项目；5地方项目；6其他项目；
          enable: 1
        },
        offset: 0,
        limit: 20,
        order: 0,
        order_by: 'data_id'
      },
      tableColumns: [
        {
          key: 'data_id',
          width: 60,
          align: 'center'
        },
        {
          title: '项目名称',
          key: 'title',
          render: (h, params) => {
            return h('div', [h('strong', params.row.title)])
          }
        },
        {
          title: '项目来源',
          key: 'project_depart',
          width: 150,
          align: 'center'
        },
        {
          title: '课题负责人',
          key: 'author',
          width: 130,
          align: 'center'
        },
        {
          title: '开始日期',
          key: 'start_date',
          width: 130,
          align: 'center'
        },
        {
          title: '结束日期',
          key: 'end_date',
          width: 130,
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          width: 140,
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
                        name: `${this.typeName}ProjectInfo`,
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
                      this.update_enable(0, params.row.data_id)
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
      return this.query.keys.type
    },
    typeName() {
      return this.typeDic[this.type]
    }
  },
  watch: {
    'query.keys.title': function(val, oldVal) {
      if (this.delayTimer) {
        clearTimeout(this.delayTimer)
      }
      this.delayTimer = setTimeout(() => {
        this.list()
      }, 500)
    },
    $route(to, from) {
      let query = this.$route.query
      let params = this.$route.params
      if (query && query.page_num) {
        this.page_num = query.page_num
        this.query.offset = (this.page_num - 1) * this.query.limit
      }
      if (params && params.type) {
        this.query.keys.type = params.type
      }
      this.list()
    }
  },
  methods: {
    async list() {
      let response = await this.apis.project.list(this.query)
      let result = response.data
      if (result.code === 0) {
        this.$Message.error({
          content: result.msg,
          duration: 1.5
        })
        return
      }
      this.tableData = result.data
    },
    async update_enable(status, data_id) {
      let response = await this.apis.project.update({ enable: status }, data_id)
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
      let response = await this.apis.project.delete([data_id])
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
    add_data() {
      this.$router.push({
        name: `${this.typeName}ProjectAdd`,
        params: { type: this.type }
      })
    },
    trash_data() {
      this.$router.push({
        name: `${this.typeName}ProjectTrash`,
        params: { type: this.type }
      })
    },
    page_change(page_num) {
      this.page_num = page_num
      this.$router.push({
        name: `${this.typeName}ProjectList`,
        params: { type: this.type },
        query: { page_num: this.page_num }
      })
    }
  },
  mounted() {
    //处理类型
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
    this.query.keys.type = parseInt(params.type)
    //处理翻页
    let query = this.$route.query
    if (query && query.page_num) {
      this.page_num = query.page_num
      this.query.offset = (this.page_num - 1) * this.query.limit
    }
    this.table_height = document.body.offsetHeight - 170

    this.list()
  }
}
</script>