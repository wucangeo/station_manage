<template>
  <div id="user-info">
    <Card>
      <p slot="title">
        <Icon type="compose"></Icon>
        项目信息
      </p>
      <Form ref="dataAddForm" :model="formData" :label-width="200" style="width:700px">
        <FormItem label="课题名称" prop="title">
          {{formData.title}}
        </FormItem>
        <FormItem label="课题负责人" prop="author">
          {{formData.author}}
        </FormItem>
        <FormItem label="课题级别" prop="project_level">
          {{formData.project_level}}
        </FormItem>
        <FormItem label="课题总经费" prop="project_funds">
          {{formData.project_funds}}
        </FormItem>
        <FormItem label="课题所属项目来源部门" prop="project_depart">
          {{formData.project_depart}}
        </FormItem>
        <FormItem label="课题所属项目类型" prop="project_type">
          {{formData.project_type}}
        </FormItem>
        <FormItem label="起始日期" prop="start_date">
          {{formData.start_date}}
        </FormItem>
        <FormItem label="结束日期" prop="end_date">
          {{formData.end_date}}
        </FormItem>
        <FormItem label="新增/在研/结题" prop="project_status">
          {{formData.project_status}}
        </FormItem>
        <FormItem label="结题年份" prop="finish_year">
          {{formData.finish_year}}
        </FormItem>
        <FormItem label="填报年份" prop="fillin_year">
          {{formData.fillin_year}}
        </FormItem>
        <FormItem>
          <Button type="primary" @click="edit">编辑</Button>
          <Button type="ghost" @click="cancel" style="margin-left: 8px">返回</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
let access_token = Cookies.get('access_token')
export default {
  data() {
    return {
      data_id: 0,
      typeDic: [null, 'kjb', 'jjw', 'zky', 'qtbw', 'df', 'qt'],
      formData: {
        title: '', //'课题名称',
        author: '', // '课题负责人',
        type: 0, //科技部项目；基金委项目；中科院项目；其他部委项目；地方项目；其他项目；
        project_level: '', // '课题级别',
        project_funds: '', // '课题总经费',
        project_depart: '', // '课题所属项目来源部门',
        project_type: '', // '课题所属项目类型',
        start_date: '', // ' 起始日期',
        end_date: '', // '结束日期',
        project_status: '', // ' 新增/在研/结题',
        finish_year: 0, // '结题年份',
        fillin_year: 0 // '填报年份',
      },
      uploadHeader: { 'x-access-token': access_token },
      uploadData: { type: 2 }
    }
  },
  computed: {
    type() {
      return this.formData.type
    },
    typeName() {
      return this.typeDic[this.type]
    }
  },
  mounted() {
    //获取待编辑数据
    let params = this.$route.params
    if (!params || !params.data_id) {
      this.$Message.error({
        content: '参数错误，即将跳转至首页。',
        duration: 1.5
      })
      setTimeout(() => {
        this.$router.push({
          name: `${this.typeName}ProjectList`,
          params: { type: this.type }
        })
      }, 1500)
      return
    }
    this.data_id = parseInt(params.data_id)
    this.get(this.data_id)
  },
  methods: {
    async get(data_id) {
      let response = await this.apis.project.get(data_id)
      let result = response.data
      if (result.code === 0) {
        this.$Message.error({
          content: result.msg,
          duration: 1.5
        })
        return
      }
      this.formData = result.data
    },
    async edit() {
      //跳转至数据详情页
      this.$router.push({
        name: `${this.typeName}ProjectEdit`,
        params: { data_id: this.data_id, type: this.type }
      })
    },
    cancel() {
      this.$router.push({
        name: `${this.typeName}ProjectList`,
        params: { type: this.type }
      })
    }
  }
}
</script>
