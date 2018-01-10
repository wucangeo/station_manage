<template>
  <div id="user-info">
    <Card>
      <p slot="title">
        <Icon type="compose"></Icon>
        专著信息
      </p>
      <Form ref="dataAddForm" :model="formData" :label-width="200" style="width:700px">
        <FormItem label="发表年度" prop="year">
          {{formData.year}}
        </FormItem>
        <FormItem label="著作名称" prop="title">
          {{formData.title}}
        </FormItem>
        <FormItem label="出版类型" prop="pub_type">
          {{formData.pub_type}}
        </FormItem>
        <FormItem label="著作类别" prop="categories">
          {{formData.categories}}
        </FormItem>
        <FormItem label="总字数" prop="word_count">
          {{formData.word_count}}
        </FormItem>
        <FormItem label="出版社" prop="press">
          {{formData.press}}
        </FormItem>
        <FormItem label="书号" prop="book_number">
          {{formData.book_number}}
        </FormItem>
        <FormItem label="出版时间" prop="pub_date">
          {{formData.pub_date}}
        </FormItem>
        <FormItem label="单位排名" prop="rank_depart">
          {{formData.rank_depart}}
        </FormItem>
        <FormItem label="全部封面作者" prop="author">
          {{formData.author}}
        </FormItem>
        <FormItem label="本单位首位封面作者排名" prop="rank_author">
          {{formData.rank_author}}
        </FormItem>
        <FormItem label="章节作者" prop="co_author">
          {{formData.co_author}}
        </FormItem>
        <FormItem label="著作首页、版权页及章节作者证明页电子版" prop="certified_path">
          <a :href="downloadPath" v-if="formData.certified_path" target="_blank">
            <Button>下载</Button>
          </a>
          <span v-if="!formData.certified_path">无 </span>
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
      data_id: 0,
      formData: {
        year: 2018, //发表年份
        title: '', //标题
        pub_type: '', // 出版类别:1国内出版-中文;2?
        categories: '', // 著作类别：1专著；2？
        word_count: 0, //'总字数（千）',
        press: '', // 出版社
        book_number: '', // 书号（如 978-7-03-045836-0)
        pub_date: '', // 出版时间
        rank_depart: 0, //   单位排名
        author: '', // 全部封面作者
        rank_author: 0, // 本单位首位作者排名
        co_author: '', // 章节作者
        certified_path: '' // 著作首页、版权页及章节作者证明页电子版
      },
      uploadHeader: { 'x-access-token': access_token },
      uploadData: { type: 2 }
    }
  },
  computed: {
    downloadPath: function() {
      return CONFIG.SERVER_URL + this.formData.certified_path
    },
    uploadURL: function() {
      return CONFIG.API_V1 + '/upload/upload'
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
          name: `monographyList`
        })
      }, 1500)
      return
    }
    this.data_id = parseInt(params.data_id)
    this.get(this.data_id)
  },
  methods: {
    async get(data_id) {
      let response = await this.apis.achv_monography.get(data_id)
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
        name: 'monographyEdit',
        params: { data_id: this.data_id }
      })
    },
    cancel() {
      this.$router.push({
        name: 'monographyList'
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
        certified_path: fileInfo.path
      }
      this.$refs.fileUploader.clearFiles()
      let response = await this.apis.achv_monography.update(
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
