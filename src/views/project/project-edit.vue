<template>
  <div id="user-info">
    <Card>
      <p slot="title">
        <Icon type="compose"></Icon>
        编辑项目信息
      </p>
      <Form ref="dataAddForm" :model="formData" :label-width="200" :rules="rules" style="width:700px">
        <FormItem label="课题名称" prop="title">
          <Input v-model="formData.title" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="课题负责人" prop="author">
          <Input v-model="formData.author" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="课题级别" prop="project_level">
          <Select v-model="formData.project_level">
            <Option v-for="project_level in project_level_list" :value="project_level" :key="project_level">{{project_level}}</Option>
          </Select>
        </FormItem>
        <FormItem label="课题总经费" prop="project_funds">
          <InputNumber :min="0" :step="0.1" v-model="formData.project_funds"></InputNumber>
        </FormItem>
        <FormItem label="课题所属项目来源部门" prop="project_depart">
          <Input v-model="formData.project_depart" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="课题所属项目类型" prop="project_type">
          <Select v-model="formData.project_type">
            <Option v-for="project_type in project_type_list" :value="project_type" :key="project_type">{{project_type}}</Option>
          </Select>
        </FormItem>
        <FormItem label="起始日期" prop="start_date">
          <DatePicker type="date" v-model="formData.start_date" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="结束日期" prop="end_date">
          <DatePicker type="date" v-model="formData.end_date" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="新增/在研/结题" prop="project_status">
          <Select v-model="formData.project_status">
            <Option v-for="project_status in project_status_list" :value="project_status" :key="project_status">{{project_status}}</Option>
          </Select>
        </FormItem>
        <FormItem label="结题年份" prop="finish_year">
          <Select v-model="formData.finish_year">
            <Option v-for="year in yearList" :value="year" :key="year">{{year}}</Option>
          </Select>
        </FormItem>
        <FormItem label="填报年份" prop="fillin_year">
          <Select v-model="formData.fillin_year">
            <Option v-for="year in yearList" :value="year" :key="year">{{year}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="update">确定</Button>
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
      typeDic: [null, 'kjb', 'jjw', 'zky', 'qtbw', 'df', 'qt'],
      rules: {
        title: [{ required: true, message: '课题名称不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '课题类型不能为空', trigger: 'blur' }],
        author: [{ required: true, message: '课题负责人不能为空', trigger: 'blur' }]
      },
      data_id: 0,
      formData: {
        title: '', //'课题名称',
        author: '', // '课题负责人',
        type: 0, //科技部项目；基金委项目；中科院项目；其他部委项目；地方项目；其他项目；
        project_level: '项目', // '课题级别,'项目','课题','子课题'',
        project_funds: 0, // '课题总经费',
        project_depart: '', // '课题所属项目来源部门',
        project_type: '', // '课题所属项目类型',
        start_date: '', // ' 起始日期',
        end_date: '', // '结束日期',
        project_status: '新增', // ' 新增/在研/结题',
        finish_year: 0, // '结题年份',
        fillin_year: 0 // '填报年份',
      },
      yearList: [],
      project_type_list: ['其他'],
      project_level_list: ['项目', '课题', '子课题'],
      project_status_list: ['新增', '在研', '结题']
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
    //处理年份
    let now = new Date()
    let curYear = now.getFullYear()
    for (let year = curYear; year >= 1950; year--) {
      this.yearList.push(year)
    }
    this.formData.finish_year = curYear
    this.formData.fillin_year = curYear
    //处理类型
    let params = this.$route.params
    if (!params || !params.type || !params.data_id) {
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
    this.formData.type = parseInt(params.type)
    this.listType(this.type)
    //获取待编辑数据
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
    async update() {
      let valid = await this.$refs.dataAddForm.validate()
      if (!valid) {
        return
      }
      //参数类型转换
      let formData = this.formData
      formData.project_funds = formData.project_funds || 0
      formData.finish_year = formData.finish_year || 0
      formData.fillin_year = formData.fillin_year || 0

      formData.project_level = formData.project_level || ''
      formData.project_depart = formData.project_depart || ''
      formData.project_type = formData.project_type || ''
      formData.project_status = formData.project_status || ''
      if (formData.start_date) {
        let start_date = this.filters.getENDateByObj(formData.start_date)
        formData.start_date = start_date || '2018-01-01'
      } else {
        formData.start_date = '2018-01-01'
      }
      if (formData.end_date) {
        let end_date = this.filters.getENDateByObj(formData.end_date)
        formData.end_date = end_date || '2018-01-01'
      } else {
        formData.end_date = '2018-01-01'
      }

      let response = await this.apis.project.update(formData, this.data_id)
      let result = response.data
      if (result.code === 0) {
        this.$Message.error({
          content: result.msg,
          duration: 3
        })
        return
      } else {
        this.$Message.success({
          content: result.msg,
          duration: 3
        })
      }
      //跳转至数据详情页
      this.$router.push({
        name: `${this.typeName}ProjectInfo`,
        params: { data_id: result.data.data_id, type: this.type }
      })
    },
    cancel() {
      this.$router.push({
        name: `${this.typeName}ProjectInfo`,
        params: { data_id: this.data_id, type: this.type }
      })
    },
    async listType(type) {
      let response = await this.apis.project_type.list({ keys: { type } })
      let result = response.data
      if (result.code === 0 || !result.data) {
        this.$Message.error({
          content: result.msg,
          duration: 1.5
        })
        return
      }
      for (let type of result.data.rows) {
        this.project_type_list.push(type['name'])
      }
    }
  }
}
</script>
