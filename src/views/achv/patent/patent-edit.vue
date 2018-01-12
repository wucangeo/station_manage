<template>
  <div id="user-info">
    <Card>
      <p slot="title">
        <Icon type="compose"></Icon>
        专著信息
      </p>
      <Form ref="dataAddForm" :model="formData" :label-width="200" :rules="rules" style="width:700px">
        <FormItem label="发表年度" prop="year">
          <Select v-model="formData.year">
            <Option v-for="year in yearList" :value="year" :key="year">{{year}}</Option>
          </Select>
        </FormItem>
        <FormItem label="专利名称" prop="title">
          <Input v-model="formData.title" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="申请号" prop="apply_code">
          <Input v-model="formData.apply_code" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="申请日期" prop="apply_date">
          <!-- <Input v-model="formData.apply_date" placeholder="请输入..."></Input> -->
          <DatePicker type="date" v-model="formData.apply_date" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="专利号" prop="patent_no">
          <Input v-model="formData.patent_no" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="授权日期" prop="auth_date">
          <!-- <Input v-model="formData.auth_date" placeholder="请输入..."></Input> -->
          <DatePicker type="date" v-model="formData.auth_date" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="专利状态" prop="patent_status">
          <Select v-model="formData.patent_status">
            <Option v-for="patent_status in patent_status_list" :value="patent_status" :key="patent_status">{{patent_status}}</Option>
          </Select>
        </FormItem>
        <FormItem label="专利类别" prop="patent_type">
          <Select v-model="formData.patent_type">
            <Option v-for="patent_type in patent_type_list" :value="patent_type" :key="patent_type">{{patent_type}}</Option>
          </Select>
        </FormItem>
        <FormItem label="国别/专利组织" prop="country_org">
          <Input v-model="formData.country_org" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="专利权人" prop="author">
          <Input v-model="formData.author" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="全部发明人" prop="co_author">
          <Input v-model="formData.co_author" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="本台站所属单位排名" prop="rank_depart">
          <Select v-model="formData.rank_depart">
            <Option v-for="rank in rankList" :value="rank" :key="rank">{{rank}}</Option>
          </Select>
        </FormItem>
        <FormItem label="本单位首位发明人排序" prop="rank_author">
          <Select v-model="formData.rank_author">
            <Option v-for="rank in rankList" :value="rank" :key="rank">{{rank}}</Option>
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
      rules: {
        title: [{ required: true, message: '专利标题不能为空', trigger: 'blur' }],
        patent_type: [{ required: true, message: '专利类别不能为空', trigger: 'blur' }],
        patent_status: [
          { required: true, message: '专利状态不能为空', trigger: 'blur' }
        ]
      },
      data_id: 0,
      formData: {
        year: 2018, // '申请/授权年度',
        title: '', // '专利名称',
        apply_code: '', // '申请号',
        apply_date: '', // '申请日期',
        patent_no: '', // '专利号',
        auth_date: '', // '授权日期',
        patent_status: '授权', // '专利状态 授权/申请',
        patent_type: '实用新型', // '专利类别：实用新型',
        country_org: '', // '国别/专利组织',
        author: '', // '专利权人',
        rank_depart: 1, // '本台站所属单位排名',
        co_author: '', // '全部发明人',
        rank_author: 1, // '本单位首位发明人排序',
        file_path: '' // '证明材料电子版',
      },
      yearList: [],
      rankList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0],
      patent_status_list: ['授权', '申请'],
      patent_type_list: ['实用新型', '发明专利']
    }
  },
  mounted() {
    //处理年份
    let now = new Date()
    let curYear = now.getFullYear()
    for (let year = curYear; year >= 1950; year--) {
      this.yearList.push(year)
    }
    this.formData.year = curYear
    //获取待编辑数据
    let params = this.$route.params
    if (!params || !params.data_id) {
      this.$Message.error({
        content: '参数错误，即将跳转至首页。',
        duration: 1.5
      })
      setTimeout(() => {
        this.$router.push({
          name: `patentList`
        })
      }, 1500)
      return
    }
    this.data_id = parseInt(params.data_id)
    this.get(this.data_id)
  },
  methods: {
    async get(data_id) {
      let response = await this.apis.achv_patent.get(data_id)
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
      formData.year = formData.year || 0
      formData.word_count = formData.word_count || 0
      formData.rank_depart = formData.rank_depart || 0
      formData.rank_author = formData.rank_author || 0

      formData.pub_type = formData.pub_type || ''
      formData.categories = formData.categories || ''
      formData.book_number = formData.book_number || ''
      formData.pub_date = formData.pub_date || ''
      formData.co_author = formData.co_author || ''

      let response = await this.apis.achv_patent.update(formData, this.data_id)
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
        name: 'patentInfo',
        params: { data_id: result.data.data_id }
      })
    },
    cancel() {
      this.$router.push({
        name: 'patentInfo',
        params: { data_id: this.data_id }
      })
    }
  }
}
</script>
