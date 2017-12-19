<template>
  <div id="regulation-edit">
    <div v-if="!is_preview">
      <Card>
        <div class="news-title">
          <div class="news-title-content">
            <Input v-model="news.title" type="text" placeholder="请输入标题"></Input>
          </div>
          <div class="news-title-button">
            <Row type="flex" justify="end">
              <Button type="primary" @click="preiview_change(true)" icon="edit" style="margin-right:10px;">预览</Button>
              <Button type="primary" @click="update" icon="edit">保存</Button>
            </Row>
          </div>
        </div>
      </Card>
      <Card class="textarea-card">
        <div>
          <quill-editor v-model="news.content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)">
          </quill-editor>
          <form action="" method="post" enctype="multipart/form-data" id="uploadFormMulti">
            <input style="display: none" :id="fileInputId" type="file" name="avator" multiple accept="image/jpg,image/jpeg,image/png,image/gif" @change="uploadImg(fileInputId)">
          </form>
        </div>
      </Card>
    </div>
    <div v-if="is_preview">
      <Card>
        <Row type="flex" justify="space-between">
          <span class="news-title">
            {{news.title}}
          </span>
          <span>
            <Button type="primary" @click="preiview_change(false)" icon="edit">返回</Button>
            <Button type="primary" @click="update" icon="edit">发布</Button>
          </span>
        </Row>
      </Card>
      <Card class="ql-editor">
        <div v-html="news.content"></div>
      </Card>
    </div>

  </div>
</template>
<script>
import { Quill } from 'vue-quill-editor'
import ImageResize from 'quill-image-resize-module'
Quill.register('modules/imageResize', ImageResize)

export default {
  name: 'regulation-edit',
  data() {
    return {
      typeDic: [
        null,
        null,
        null,
        null,
        'thematicProduction',
        'thematicScience',
        'scientificKnowledge'
      ],
      data_id: null,
      news: {
        type: 1,
        data_id: '',
        title: '',
        content: ''
      },
      editorOption: {
        // some quill options
        placeholder: '请输入文字',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
            [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
            [{ direction: 'rtl' }], // text direction
            [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],
            ['clean'], // remove formatting button,
            ['link', 'image'] // add's image support: 'video', 'formula'
          ],
          imageResize: {
            // displayStyles: {
            //   backgroundColor: 'black',
            //   border: 'none',
            //   color: 'white'
            // }
            // modules: ['Resize', 'DisplaySize', 'Toolbar']
          }
        }
      },
      imageLoading: false,
      fileInputId: '12412349',
      is_preview: false
    }
  },
  computed: {
    type() {
      return this.news.type
    },
    typeName() {
      return this.typeDic[this.type]
    },
    quillEditor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  methods: {
    async get(data_id) {
      let response = await this.apis.station.get(data_id)
      let result = response.data
      if (result.code === 0) {
        this.$Message.error({
          content: result.msg,
          duration: 1.5
        })
        return
      }
      if (!result.data) {
        this.$Message.error({
          content: '',
          duration: 1.5
        })
        return
      }
      let news = result.data
      this.news.data_id = news.data_id
      this.news.title = news.title
      this.news.content = news.content
    },
    async update() {
      let response = await this.apis.station.update(
        this.news,
        this.news.data_id
      )
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
        //刷新页面值
        let routerViewName = `${this.typeDic[this.type]}View`
        this.$router.push({
          name: routerViewName,
          params: { data_id: this.data_id, type: this.type }
        })
      }
    },
    preiview_change(status) {
      this.is_preview = status
    },
    onEditorBlur(quill) {
      // console.log('editor blur!', quill)
    },
    onEditorFocus(quill) {
      // console.log('editor focus!', quill)
    },
    onEditorReady(quill) {
      // console.log('editor ready!', quill)
    },
    onEditorChange({ quill, html, text }) {
      // this.content = html
    },
    async uploadImgReq(formData) {
      let response = await this.apis.upload.upload(formData)
      let result = response.data
      if (result.code === 0) {
        this.$Message.error({
          content: result.msg,
          duration: 1.5
        })
        return null
      }
      return result.data.path
    },
    async uploadImg(id) {
      var fileInput = document.getElementById(id) //隐藏的file文本ID
      this.imageLoading = true
      var formData = new FormData()
      formData.append('file', fileInput.files[0])
      try {
        const url = await this.uploadImgReq(formData) // 自定义的图片上传函数
        if (url != null && url.length > 0) {
          var value = CONFIG.SERVER_URL + url
          this.addImgRange = this.quillEditor.getSelection()
          value = value.indexOf('http') != -1 ? value : 'http:' + value
          this.quillEditor.insertEmbed(
            this.addImgRange != null ? this.addImgRange.index : 0,
            'image',
            value,
            Quill.sources.USER
          )
        } else {
          this.$Message.warning('图片添加失败')
        }
        document.getElementById(this.fileInputId).value = ''
      } catch ({ message: msg }) {
        document.getElementById(this.fileInputId).value = ''
        this.$message.warning(msg)
      }
      this.imageLoading = false
    },
    imgHandler(image) {
      this.addImgRange = this.quillEditor.getSelection()
      if (image) {
        var fileInput = document.getElementById(this.fileInputId) //隐藏的file文本ID
        fileInput.click() //加一个触发事件
      }
    }
  },
  mounted() {
    let params = this.$route.params
    if (!params || !params.data_id) {
      this.$Message.error({
        content: '参数错误，即将跳转至规章制度列表。',
        duration: 1.5
      })
      setTimeout(() => {
        this.$router.push({
          name: `${this.typeName}List`,
          params: { type: this.type }
        })
      }, 1500)
      return
    }
    this.data_id = parseInt(params.data_id)
    this.news.type = parseInt(params.type)
    this.get(this.data_id)

    this.quillEditor.getModule('toolbar').addHandler('image', this.imgHandler)
    let quifllHeight = document.body.offsetHeight - 230
    document.getElementsByClassName('ql-container')[0].style.height =
      quifllHeight + 'px'
  }
}
</script>
<style lang="less">
.news-title {
  display: flex;
  flex-flow: row;
  .news-title-content {
    font-size: 20px;
    font-weight: 600;
    flex: 1;
  }
  .news-title-button {
    width: 180px;
    float: left;
  }
}
.ql-container {
  min-height: 400px;
  // height: calc(~'50% - 30px');
  overflow-y: auto;
}
.textarea-card {
  height: 100%;
  // max-height: 400px;
}
.main .single-page-con {
  overflow: hidden;
}
</style>
