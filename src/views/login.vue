<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登录
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="username">
              <Input v-model="form.username" placeholder="请输入用户名">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
              <label class="login-tip">{{login_msg}}</label>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      },
      login_msg: ''
    }
  },
  watch: {
    'form.username': function(val, oldVal) {
      this.login_msg = ''
    },
    'form.password': function(val, oldVal) {
      this.login_msg = ''
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.apis.user.login(this.form).then(res => {
            let result = res.data
            if (result.code === 1) {
              Cookies.set('user', result.data.name)
              let access_token = result.data.access_token
              Cookies.set('access_token', access_token)
              this.$router.push({
                name: 'home_index'
              })
            } else {
              this.login_msg = result.msg
            }
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
