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
  name: 'landResource',
  data() {
    return {
      delayTimer: null, //用于搜索延迟
      page_num: 1,
      table_height: 600, //表格高度
      query: {
        keys: {
          title: null,
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
          title: '样地名称',
          key: 'name',
          render: (h, params) => {
            return h('div', [h('strong', params.row.name)])
          }
        },
        {
          title: '样地位置',
          key: 'location',
          width: 250,
          align: 'center'
        },
        {
          title: '样地类型',
          key: 'type',
          width: 150,
          align: 'center'
        },
        {
          title: '建立日期',
          key: 'build_year',
          width: 100,
          align: 'center'
        },
        {
          title: '土壤类型',
          key: 'soil_type',
          width: 100,
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
                        name: 'landResourceInfo',
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
    },
    $route(to, from) {
      this.init()
    }
  },
  methods: {
    async init() {
      let query = this.$route.query
      if (query && query.page_num) {
        this.page_num = query.page_num
        this.query.offset = (this.page_num - 1) * this.query.limit
      }
      this.list()
    },
    async list() {
      let response = await this.apis.res_land.list(this.query)
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
      let response = await this.apis.res_land.update(
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
      let response = await this.apis.res_land.delete([data_id])
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
        name: 'landResourceAdd'
      })
    },
    trash_data() {
      this.$router.push({
        name: 'landResourceTrash'
      })
    },
    page_change(page_num) {
      this.page_num = page_num
      this.$router.push({
        name: 'landResourceList',
        query: { page_num: this.page_num }
      })
    }
  },
  mounted() {
    this.table_height = document.body.offsetHeight - 170
    this.init()
  }
}
</script>
