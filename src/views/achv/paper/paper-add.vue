<template>
  <div id="user-info">
    <Card>
      <p slot="title">
        <Icon type="compose"></Icon>
        论文信息
      </p>
      <Form ref="dataAddForm" :model="formData" :label-width="150" :rules="rules" style="width:700px">
        <FormItem label="发表年度" prop="year">
          <Select v-model="formData.year">
            <Option v-for="year in yearList" :value="year" :key="year">{{year}}</Option>
          </Select>
        </FormItem>
        <FormItem label="论文标题" prop="title">
          <Input v-model="formData.title" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="刊物名称" prop="journal">
          <Input v-model="formData.journal" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="年,卷期,页码" prop="volume">
          <Input v-model="formData.volume" placeholder="例如：2016,400(1):67-79"></Input>
        </FormItem>
        <FormItem label="标准刊号" prop="issue_number">
          <Input v-model="formData.issue_number" placeholder="例如：0032-079X"></Input>
        </FormItem>
        <FormItem label="全部作者" prop="author">
          <Input v-model="formData.author" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="通讯作者" prop="co_author">
          <Input v-model="formData.co_author" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="摘要" prop="abstract">
          <Input v-model="formData.abstract" type="textarea" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="单位标注排名" prop="rank_depart">
          <Select v-model="formData.rank_depart">
            <Option v-for="rank in rankList" :value="rank" :key="rank">{{rank}}</Option>
          </Select>
        </FormItem>
        <FormItem label="本单位首位作者排名" prop="rank_author">
          <Select v-model="formData.rank_author">
            <Option v-for="rank in rankList" :value="rank" :key="rank">{{rank}}</Option>
          </Select>
        </FormItem>
        <FormItem label="刊物级别" prop="journal_level">
          <Select v-model="formData.journal_level">
            <Option v-for="level in journal_level_list" :value="level" :key="level">{{level}}</Option>
          </Select>
        </FormItem>
        <FormItem label="影响因子" prop="index">
          <InputNumber :max="100" :min="0" :step="0.1" v-model="formData.index"></InputNumber>
        </FormItem>
        <FormItem label="是否国际合作论文" prop="is_coop">
          <i-switch v-model="formData.is_coop" size="large" :true-value="1" :false-value="0">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" type="textarea" placeholder="请输入..."></Input>
        </FormItem>
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
        title: [{ required: true, message: '论文标题不能为空', trigger: 'blur' }],
        journal: [{ required: true, message: '刊物名称不能为空', trigger: 'blur' }],
        author: [{ required: true, message: '全部作者不能为空', trigger: 'blur' }]
      },
      formData: {
        year: 2018, //发表年份
        title: '', //标题
        journal: '', //期刊名称
        volume: '', //年，卷期，页码
        issue_number: '', //标准刊号
        author: '', //全部作者
        co_author: '', //通讯作者
        abstract: '', //摘要
        rank_depart: 1, //单位标注排名
        rank_author: 1, //本单位首位作者排名
        journal_level: 'SCI', //刊物级别：1SCI；2专著；3中文；4其他
        index: 0, //SCI/SSCI影响因子
        is_coop: 0, //是否为国际合作论文
        remark: '', //备注
        file_path: '' //文件路径
      },
      yearList: [],
      rankList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      journal_level_list: ['SCI', '中文', '其他']
    }
  },
  mounted() {
    let now = new Date()
    let curYear = now.getFullYear()
    for (let year = curYear; year >= 1950; year--) {
      this.yearList.push(year)
    }
    this.formData.year = curYear
  },
  methods: {
    async create() {
      let valid = await this.$refs.dataAddForm.validate()
      if (!valid) {
        return
      }
      let response = await this.apis.achv_paper.create(this.formData)
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
        name: 'paperInfo',
        params: { data_id: result.data.data_id }
      })
    },
    cancel() {
      this.$router.push({
        name: 'paperList'
      })
    }
  }
}
</script>
