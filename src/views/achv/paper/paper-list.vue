<template>
  <div>
    <Row type="flex" justify="space-between">
      <Col span="18">
      <Input v-model="query.keys.title" icon="search" placeholder="请输入关键词搜索..." style="width: 200px" />
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
    <Row class="margin-top-10 searchable-table-con1">
      <Table border :columns="tableColumns" :data="tableData"></Table>
    </Row>
  </div>

</template>

<script>
export default {
  name: 'paper',
  data() {
    return {
      delayTimer: null, //用于搜索延迟
      query: {
        keys: {
          title: null,
          enable: 1
        },
        offset: 0,
        limit: 10,
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
          title: '发表年份',
          key: 'year',
          width: 70,
          align: 'center'
        },
        {
          title: '论文题目',
          key: 'title',
          render: (h, params) => {
            return h('div', [h('strong', params.row.title)])
          }
        },
        {
          title: '刊物名称',
          key: 'journal'
        },
        {
          title: '论文作者',
          key: 'author'
        },
        {
          title: '级别',
          key: 'journal_level',
          width: 70,
          align: 'center'
        },
        {
          title: 'Action',
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
                        name: 'paperInfo',
                        params: { data_id: params.row.data_id }
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
  watch: {
    'query.keys.title': function(val, oldVal) {
      if (this.delayTimer) {
        clearTimeout(this.delayTimer)
      }
      this.delayTimer = setTimeout(() => {
        this.list()
      }, 500)
    }
  },
  methods: {
    async list() {
      let response = await this.apis.achv_paper.list(this.query)
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
      let response = await this.apis.achv_paper.update(
        { enable: status },
        data_id
      )
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
      let response = await this.apis.achv_paper.delete([data_id])
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
        name: 'paperAdd'
      })
    },
    trash_data() {
      this.$router.push({
        name: 'paperTrash'
      })
    }
  },
  mounted() {
    this.list()
  }
}
</script>