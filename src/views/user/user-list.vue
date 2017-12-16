<template>
  <div>
    <Row type="flex" justify="space-between">
      <Col span="18">
      <Input v-model="query.key" icon="search" placeholder="请输入姓名搜索..." style="width: 200px" />
      </Col>
      <Col span="6">
      <Row type="flex" justify="end">
        <span>
          <Button type="primary" size="small" @click="add_user" icon="plus">添加用户</Button>
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
      delayTimer: null, //用于搜索延迟
      query: {
        key: null,
        offset: 0,
        limit: 10,
        order: 0,
        order_by: 'data_id'
      },
      tableColumns: [
        {
          title: '编号',
          key: 'data_id',
          width: 60,
          align: 'center'
        },
        {
          title: '用户名',
          key: 'username',
          render: (h, params) => {
            return h('div', [h('strong', params.row.username)])
          }
        },
        {
          title: '姓名',
          key: 'name',
          width: 120
        },
        {
          title: '单位',
          key: 'department'
        },
        {
          title: '手机号',
          key: 'phone'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '启用',
          key: 'enable',
          width: 80,
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
                      // this.show(params.index)
                      this.$router.push({
                        name: 'userInfo',
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
  watch: {
    'query.key': function(val, oldVal) {
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
      let response = await this.apis.user.list(this.query)
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
    show(index) {
      let userInfo = this.tableData[index]
      this.$Modal.info({
        title: '用户信息',
        content: `用户名：${userInfo.username}<br>
        姓名：${userInfo.name}<br>
        单位：${userInfo.department}<br>
        电话：${userInfo.phone}<br>
        邮箱：${userInfo.email}<br>
        启用：${userInfo.enable}<br>
        管理员：${userInfo.is_admin}<br>
        创建时间：${userInfo.created_at}
        `
      })
    },
    async update_enable(status, data_id) {
      let response = await this.apis.user.update({ enable: status }, data_id)
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
      let response = await this.apis.user.delete([data_id])
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
    add_user() {
      this.$router.push({
        name: 'userAdd'
      })
    }
  },
  mounted() {
    this.list()
  }
}
</script>