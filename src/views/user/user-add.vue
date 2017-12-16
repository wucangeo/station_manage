<template>
  <div id="user-info">
    <Card>
      <p slot="title">
        <Icon type="compose"></Icon>
        登录信息
      </p>
      <Form ref="usrAddForm" :model="formData" :label-width="80" :rules="rules" style="width:600px">
        <FormItem label="用户名" prop="username">
          <Row>
            <Col span="18">
            <Input v-model="formData.username" placeholder="请输入用户名"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="密码">
          <span>无需设置，初始密码为123456，用户首次登陆时需要修改密码</span>
        </FormItem>
        <FormItem label="是否启用">
          <i-switch v-model="formData.enable" size="large" :true-value="1" :false-value="0">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="是否管理员">
          <i-switch v-model="formData.is_admin" size="large" :true-value="1" :false-value="0">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="姓名" prop="name">
          <Row>
            <Col span="18">
            <Input v-model="formData.name" placeholder="请输入用户名"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="单位">
          <Row>
            <Col span="18">
            <Input v-model="formData.department" placeholder="请输入用户名"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="电话">
          <Row>
            <Col span="18">
            <Input v-model="formData.phone" placeholder="请输入用户名"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="邮箱">
          <Row>
            <Col span="18">
            <Input v-model="formData.email" placeholder="请输入用户名"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="create">确定</Button>
          <Button type="ghost" @click="cancel" style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rules: {
        username: [{ required: true, message: '登陆账号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }]
      },
      formData: {
        username: '',
        name: '',
        department: '',
        phone: '',
        email: '',
        enable: 1,
        is_admin: 0
      }
    }
  },
  mounted() {},
  methods: {
    async create() {
      let valid = await this.$refs.usrAddForm.validate()
      if (!valid) {
        return
      }
      let response = await this.apis.user.create(this.formData)
      let result = response.data
      if (result.code === 0) {
        this.$Message.error({
          content: result.msg,
          duration: 3
        })
        return
      }
      //跳转至用户详情页
      this.$router.push({
        name: 'userInfo',
        params: { data_id: result.data.data_id }
      })
    },
    cancel() {
      this.$router.push({
        name: 'userList'
      })
    }
  }
}
</script>
