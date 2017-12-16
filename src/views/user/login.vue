<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con" v-if="is_loginForm" @keydown.enter="loginSubmit">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登录
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="formLoginData" :rules="rules">
            <FormItem prop="username">
              <Input v-model="formLoginData.username" placeholder="请输入用户名">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="formLoginData.password" placeholder="请输入密码">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="loginSubmit" type="primary" long>登录</Button>
              <label class="login-tip">{{login_msg}}</label>
            </FormItem>
          </Form>
        </div>
        <div class="form-register">
          <span @click="switch_login(false)"> 注册</span>
        </div>
      </Card>
    </div>
    <div class="login-con" v-if="!is_loginForm" @keydown.enter="registerSubmit">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎注册
        </p>
        <div class="form-con">
          <Form ref="registerForm" :model="formRegisterData" :rules="rules">
            <FormItem prop="test">
              <Input v-model="formRegisterData.username" placeholder="用户名">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="formRegisterData.password" placeholder="密码">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="name">
              <Input type="text" v-model="formRegisterData.name" placeholder="姓名">
              <span slot="prepend">
                <Icon :size="14" type="social-reddit"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="email">
              <Input type="email" v-model="formRegisterData.email" placeholder="邮箱地址">
              <span slot="prepend">
                <Icon :size="14" type="email"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="department">
              <Input type="text" v-model="formRegisterData.department" placeholder="单位名称">
              <span slot="prepend">
                <Icon :size="14" type="filing"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="registerSubmit" type="primary" long>注册</Button>
              <label class="login-tip">{{login_msg}}</label>
            </FormItem>
          </Form>
        </div>
        <div class="form-register">
          <span @click="switch_login(true)"> 已有账号？请登录</span>
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
      is_loginForm: true,
      formLoginData: {
        username: '',
        password: ''
      },
      formRegisterData: {
        username: '',
        name: '',
        department: '',
        phone: '',
        email: ''
      },
      rules: {
        username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        email: [
          { required: true, message: '邮箱地址错误', trigger: 'blur', type: 'email' }
        ],
        department: [{ required: true, message: '单位不能为空', trigger: 'blur' }]
      },
      login_msg: ''
    }
  },
  watch: {
    'formLoginData.username': function(val, oldVal) {
      this.login_msg = ''
    },
    'formLoginData.password': function(val, oldVal) {
      this.login_msg = ''
    }
  },
  methods: {
    async loginSubmit() {
      //表单验证
      let valid = await this.$refs.loginForm.validate()
      if (!valid) {
        return
      }
      //登陆
      let response = await this.apis.user.login(this.formLoginData)
      let result = response.data
      if (result.code === 0) {
        this.login_msg = result.msg
        return
      }
      Cookies.set('user', result.data.name)
      let access_token = result.data.access_token
      Cookies.set('access_token', access_token)
      this.$router.push({
        name: 'home_index'
      })
    },
    async registerSubmit() {
      let valid = await this.$refs.registerForm.validate()
      if (!valid) {
        return
      }
      let response = await this.apis.user.register(this.formRegisterData)
      let result = response.data
      if (result.code === 0) {
        this.$Message.error({
          content: result.msg,
          duration: 1.5
        })
        return
      }
      //注册成功
      this.$Modal.success({
        title: '注册成功',
        content: '注册成功，请联系管理员进行账户验证。'
      })
      this.switch_login(true)
    },
    switch_login(status) {
      this.is_loginForm = status
    }
  }
}
</script>

<style>

</style>
