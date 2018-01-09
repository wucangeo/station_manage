<template>
  <div id="user-info">
    <Card>
      <p slot="title">
        <Icon type="compose"></Icon>
        论文信息
      </p>
      <Form ref="dataAddForm" :model="formData" :label-width="150" style="width:700px">
        <FormItem label="发表年度" prop="year">
          {{formData.year}}
        </FormItem>
        <FormItem label="论文标题" prop="title">
          {{formData.title}}
        </FormItem>
        <FormItem label="刊物名称" prop="journal">
          {{formData.journal}}
        </FormItem>
        <FormItem label="年,卷期,页码" prop="volume">
          {{formData.volume}}
        </FormItem>
        <FormItem label="标准刊号" prop="issue_number">
          {{formData.issue_number}}
        </FormItem>
        <FormItem label="全部作者" prop="author">
          {{formData.author}}
        </FormItem>
        <FormItem label="通讯作者" prop="co_author">
          {{formData.co_author}}
        </FormItem>
        <FormItem label="摘要" prop="abstract">
          {{formData.abstract}}
        </FormItem>
        <FormItem label="单位标注排名" prop="rank_depart">
          {{formData.rank_depart}}
        </FormItem>
        <FormItem label="本单位首位作者排名" prop="rank_author">
          {{formData.rank_author}}
        </FormItem>
        <FormItem label="刊物级别" prop="journal_level">
          {{formData.journal_level}}
        </FormItem>
        <FormItem label="影响因子" prop="index">
          {{formData.index}}
        </FormItem>
        <FormItem label="是否国际合作论文" prop="is_coop">
          {{formData.is_coop===1?"是":"否"}}
        </FormItem>
        <FormItem label="备注" prop="remark">
          {{formData.remark}}
        </FormItem>
        <FormItem label="论文附件" prop="file_path">
          <a :href="downloadPath" v-if="formData.file_path" target="_blank">
            <Button>下载</Button>
          </a>
          <span v-if="!formData.file_path">无 </span>
          <Upload ref="fileUploader" :action="uploadURL" :on-success="uploadSuccess" :on-error="uploadError" :headers="uploadHeader" :data="uploadData">
            <Button type="ghost" icon="ios-cloud-upload-outline">点击上传论文</Button>
          </Upload>
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
      rules: {
        title: [{ required: true, message: '论文标题不能为空', trigger: 'blur' }],
        journal: [{ required: true, message: '刊物名称不能为空', trigger: 'blur' }],
        author: [{ required: true, message: '全部作者不能为空', trigger: 'blur' }]
      },
      data_id: 0,
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
      journal_level_list: ['SCI', '中文', '其他'],
      uploadHeader: { 'x-access-token': access_token },
      uploadData: { type: 1 }
    }
  },
  computed: {
    downloadPath: function() {
      return CONFIG.SERVER_URL + this.formData.file_path
    },
    uploadURL: function() {
      return CONFIG.API_V1 + '/upload/upload'
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
          name: `paperList`
        })
      }, 1500)
      return
    }
    this.data_id = parseInt(params.data_id)
    this.get(this.data_id)
  },
  methods: {
    async get(data_id) {
      let response = await this.apis.achv_paper.get(data_id)
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
        name: 'paperEdit',
        params: { data_id: this.data_id }
      })
    },
    cancel() {
      this.$router.push({
        name: 'paperList'
      })
    },
    async uploadSuccess(data) {
      if (data.code === 0) {
        this.$Message.error({
          content: '上传失败，请刷新重试。',
          duration: 3
        })
        return
      }
      let fileInfo = data.data
      let update_item = {
        file_path: fileInfo.path
      }
      this.$refs.fileUploader.clearFiles()
      let response = await this.apis.achv_paper.update(
        update_item,
        this.data_id
      )
      let result = response.data
      if (result.code === 0) {
        this.$Message.error({
          content: '上传文件失败！',
          duration: 3
        })
        return
      } else {
        this.$Message.success({
          content: '上传文件成功！',
          duration: 3
        })
        this.get(this.data_id)
      }
    },
    uploadError(err) {
      this.$Message.error({
        content: err,
        duration: 1.5
      })
    }
  }
}
</script>
