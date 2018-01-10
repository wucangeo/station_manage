<template>
  <div>
    <Row type="flex" justify="space-between">
      <Col span="18">
      <Input v-model="query.keys.title" icon="search" placeholder="请输入关键词搜索..." style="width: 200px" />
      </Col>
      <Col span="6">
      <Row type="flex" justify="end">
        <span>
          <Button type="error" size="small" @click="remove" icon="trash-b">彻底删除</Button>
          <Button type="primary" size="small" @click="list_data" icon="ios-arrow-back">返回</Button>
        </span>
      </Row>
      </Col>
    </Row>
    <Row class="margin-top-10 searchable-table-con1">
      <Table border :columns="tableColumns" @on-select="onTableSelect" :data="tableData"></Table>
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
          enable: 0
        },
        offset: 0,
        limit: 10,
        order: 0,
        order_by: 'data_id'
      },
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
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
          title: '著作名称',
          key: 'title',
          render: (h, params) => {
            return h('div', [h('strong', params.row.title)])
          }
        },
        {
          title: '出版类型',
          key: 'pub_type',
          width: 150,
          align: 'center'
        },
        {
          title: '出版社',
          key: 'press',
          width: 180,
          align: 'center'
        },
        {
          title: '作者',
          key: 'author',
          width: 130,
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          width: 130,
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
                        name: 'monographyInfo',
                        params: { data_id: params.row.data_id }
                      })
                    }
                  }
                },
                '查看'
              ),
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
                      this.update_enable(1, params.row.data_id)
                    }
                  }
                },
                '还原'
              ),
              h('Poptip', {
                props: {
                  confirm: true,
                  title: '您确认要彻底删除这条内容吗？',
                  width: 200,
                  placement: 'left'
                },
                on: {
                  'on-ok': () => {
                    this.remove([params.row.data_id])
                  }
                }
              })
            ])
          }
        }
      ],
      tableData: [],
      ids2Remove: []
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
      let response = await this.apis.achv_monography.list(this.query)
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
      let response = await this.apis.achv_monography.update(
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
    async remove() {
      let ids = this.ids2Remove
      if (ids.length === 0) {
        this.$Message.warning({
          content: '未选中任何内容。',
          duration: 1.5
        })
        return
      }
      let response = await this.apis.achv_monography.delete(ids)
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
    list_data() {
      this.$router.push({
        name: 'monographyList'
      })
    },
    onTableSelect(selection, row) {
      this.ids2Remove = []
      if (Array.isArray(selection)) {
        for (let sel of selection) {
          this.ids2Remove.push(sel.data_id)
        }
      }
    }
  },
  mounted() {
    this.list()
  }
}
</script>