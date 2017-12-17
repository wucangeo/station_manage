<template>
  <div id="intro-view">
    <Card>
      <Row type="flex" justify="space-between">
        <span class="news-title">
          水土保持试验站简介
        </span>
        <span>
          <Button type="primary" @click="edit_intro" icon="edit">编辑</Button>
        </span>
      </Row>
    </Card>
    <Card>
      <quill-editor v-model="content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)">
      </quill-editor>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      content: `<p class="tip">在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 <a href="https://en.wikipedia.org/wiki/Cross-site_scripting" target="_blank" rel="noopener">XSS 攻击</a>。只在可信内容上使用 <code>v-html</code>，<strong>永不</strong>用在用户提交的内容上。</p>`,
      editorOption: {
        // some quill options
      }
    }
  },
  methods: {
    edit_intro() {
      this.$router.push({
        name: 'stationIntroductionEdit'
      })
    },
    onEditorBlur(quill) {
      console.log('editor blur!', quill)
    },
    onEditorFocus(quill) {
      console.log('editor focus!', quill)
    },
    onEditorReady(quill) {
      console.log('editor ready!', quill)
    },
    onEditorChange({ quill, html, text }) {
      console.log('editor change!', quill, html, text)
      this.content = html
    },
    uploadImgReq(formData) {},
    uploadImg: async function(id) {
      var vm = this
      vm.imageLoading = true
      var formData = new FormData($('#' + id)[0])
      try {
        const url = await vm.uploadImgReq(formData) // 自定义的图片上传函数
        if (url != null && url.length > 0) {
          var value = url
          vm.addImgRange = vm.$refs.myQuillEditor.quill.getSelection()
          value = value.indexOf('http') != -1 ? value : 'http:' + value
          vm.$refs.myQuillEditor.quill.insertEmbed(
            vm.addImgRange != null ? vm.addImgRange.index : 0,
            'image',
            value,
            Quill.sources.USER
          )
        } else {
          vm.$message.warning('图片增加失败')
        }
        document.getElementById(vm.uniqueId).value = ''
      } catch ({ message: msg }) {
        document.getElementById(vm.uniqueId).value = ''
        vm.$message.warning(msg)
      }
      vm.imageLoading = false
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  mounted() {
    // console.log('this is current quill instance object', this.editor)
  }
}
</script>
<style lang="less">
.news-title {
  font-size: 20px;
  font-weight: 600;
}
</style>
