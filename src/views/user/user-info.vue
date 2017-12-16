<template>
  <div id="user-info">
    <Card>
      <p slot="title">
        <Icon type="compose"></Icon>
        登录信息
      </p>
      <Form :model="formData" :label-width="80" style="width:600px">
        <FormItem label="用户名">
          <Row v-if="!formEdit.username">
            <Col span="18">
            <span>{{formData.username}} </span>
            </Col>
            <Col span="4" offset="1">
            <Button type="text" icon="edit" @click="formEdit.username=true"></Button>
            </Col>
          </Row>
          <Row v-if="formEdit.username">
            <Col span="18">
            <Input v-model="formData.username" placeholder="请输入用户名"></Input>
            </Col>
            <Col span="4" offset="1">
            <Button type="text" icon="checkmark" size="small" shape="circle" @click="update({username:formData.username})"></Button>
            <Button type="text" icon="close-round" size="small" shape="circle" @click="formEdit.username=false"></Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="密码">
          <Button type="default" size="small" @click="formEdit.username=false">重置密码</Button>
        </FormItem>
        <FormItem label="是否启用">
          <i-switch v-model="formData.enable" size="large" :true-value="1" :false-value="0" @on-change="change_enable">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="是否管理员">
          <i-switch v-model="formData.is_admin" size="large" :true-value="1" :false-value="0" @on-change="change_is_admin">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
      </Form>
    </Card>
    <Card>
      <p slot="title">
        <Icon type="compose"></Icon>
        详细信息
      </p>
      <Form :model="formData" :label-width="80" style="width:600px">
        <FormItem label="姓名">
          <Row v-if="!formEdit.name">
            <Col span="18">
            <span>{{formData.name}} </span>
            </Col>
            <Col span="4" offset="1">
            <Button type="text" icon="edit" @click="formEdit.name=true"></Button>
            </Col>
          </Row>
          <Row v-if="formEdit.name">
            <Col span="18">
            <Input v-model="formData.name" placeholder="请输入用户名"></Input>
            </Col>
            <Col span="4" offset="1">
            <Button type="text" icon="checkmark" size="small" shape="circle" @click="update({name:formData.name})"></Button>
            <Button type="text" icon="close-round" size="small" shape="circle" @click="formEdit.name=false"></Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="单位">
          <Row v-if="!formEdit.department">
            <Col span="18">
            <span>{{formData.department}} </span>
            </Col>
            <Col span="4" offset="1">
            <Button type="text" icon="edit" @click="formEdit.department=true"></Button>
            </Col>
          </Row>
          <Row v-if="formEdit.department">
            <Col span="18">
            <Input v-model="formData.department" placeholder="请输入用户名"></Input>
            </Col>
            <Col span="4" offset="1">
            <Button type="text" icon="checkmark" size="small" shape="circle" @click="update({department:formData.department})"></Button>
            <Button type="text" icon="close-round" size="small" shape="circle" @click="formEdit.department=false"></Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="电话">
          <Row v-if="!formEdit.phone">
            <Col span="18">
            <span>{{formData.phone}} </span>
            </Col>
            <Col span="4" offset="1">
            <Button type="text" icon="edit" @click="formEdit.phone=true"></Button>
            </Col>
          </Row>
          <Row v-if="formEdit.phone">
            <Col span="18">
            <Input v-model="formData.phone" placeholder="请输入用户名"></Input>
            </Col>
            <Col span="4" offset="1">
            <Button type="text" icon="checkmark" size="small" shape="circle" @click="update({phone:formData.phone})"></Button>
            <Button type="text" icon="close-round" size="small" shape="circle" @click="formEdit.phone=false"></Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="邮箱">
          <Row v-if="!formEdit.email">
            <Col span="18">
            <span>{{formData.email}} </span>
            </Col>
            <Col span="4" offset="1">
            <Button type="text" icon="edit" @click="formEdit.email=true"></Button>
            </Col>
          </Row>
          <Row v-if="formEdit.email">
            <Col span="18">
            <Input v-model="formData.email" placeholder="请输入用户名"></Input>
            </Col>
            <Col span="4" offset="1">
            <Button type="text" icon="checkmark" size="small" shape="circle" @click="update({email:formData.email})"></Button>
            <Button type="text" icon="close-round" size="small" shape="circle" @click="formEdit.email=false"></Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="最近更新">
          <span>{{formData.updated_at | getCNDatetime}} </span>
        </FormItem>
        <FormItem label="创建日期">
          <span>{{formData.created_at | getCNDatetime}} </span>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data_id: null,
      formEdit: {
        username: false,
        name: false,
        department: false,
        phone: false,
        email: false,
        enable: false,
        is_admin: false
      },
      formData: {
        username: '',
        name: '',
        department: '',
        phone: '',
        email: true,
        enable: '',
        is_admin: '',
        created_at: '',
        updated_at: ''
      }
    }
  },
  mounted() {
    let params = this.$route.params
    if (!params || !params.data_id) {
      this.$Message.error({
        content: '参数错误，即将跳转至用户列表。',
        duration: 1.5
      })
      setTimeout(() => {
        this.$router.push({ name: 'userList' })
      }, 3000)
      return
    }
    this.data_id = params.data_id
    this.get(this.data_id)
  },
  methods: {
    async get(data_id) {
      let response = await this.apis.user.get(data_id)
      let result = response.data
      if (result.code === 0) {
        this.$Message.error({
          content: result.msg,
          duration: 1.5
        })
        return
      } else {
        if (!result.data) {
          this.$Message.error({
            content: '未找到该用户。',
            duration: 1.5
          })
          return
        }
        this.formData = result.data
      }
    },
    async update(item) {
      let response = await this.apis.user.update(item, this.data_id)
      let result = response.data
      if (result.code === 0) {
        this.$Message.error({
          content: result.msg,
          duration: 1.5
        })
        return
      } else {
        this.$Message.success({
          content: '修改成功！',
          duration: 1.5
        })
        //关闭编辑按钮
        this.formEdit.username = false
        this.formEdit.name = false
        this.formEdit.department = false
        this.formEdit.phone = false
        this.formEdit.email = false
        this.formEdit.enable = false
        this.formEdit.is_admin = false
        //刷新页面值
        this.formData = result.data
      }
    },
    change_enable(status) {
      this.update({ enable: status })
    },
    change_is_admin(status) {
      this.update({ is_admin: status })
    }
  }
}
</script>
