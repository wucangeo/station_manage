<template>
  <div id="user-info">
    <Card>
      <p slot="title">
        <Icon type="compose"></Icon>
        样地资源
      </p>
      <Form ref="dataAddForm" :model="formData" :label-width="200" style="width:700px">
        <FormItem label="样地代码" prop="code">
          {{formData.code}}
        </FormItem>
        <FormItem label="样地名称" prop="name">
          {{formData.name}}
        </FormItem>
        <FormItem label="样地类型" prop="type">
          {{formData.type}}
        </FormItem>
        <FormItem label="建立日期" prop="build_year">
          {{formData.build_year}}
        </FormItem>
        <FormItem label="设计使用年限" prop="use_year">
          {{formData.use_year}}
        </FormItem>
        <FormItem label="样地面积" prop="area">
          {{formData.area}}
        </FormItem>
        <FormItem label="样地形状" prop="sharp">
          {{formData.sharp}}
        </FormItem>
        <FormItem label="可进行工作" prop="ready_to">
          {{formData.ready_to}}
        </FormItem>
        <FormItem label="样地代表性描述" prop="desc">
          {{formData.desc}}
        </FormItem>
        <FormItem label="样地性质" prop="property">
          {{formData.property}}
        </FormItem>
        <FormItem label="位置" prop="location">
          {{formData.location}}
        </FormItem>
        <FormItem label="经度" prop="longitude">
          {{formData.longitude}}
        </FormItem>
        <FormItem label="纬度" prop="latitude">
          {{formData.latitude}}
        </FormItem>
        <FormItem label="高程" prop="altitude">
          {{formData.altitude}}
        </FormItem>
        <FormItem label="土壤类型" prop="soil_type">
          {{formData.soil_type}}
        </FormItem>
        <FormItem label="地形地貌" prop="topography">
          {{formData.topography}}
        </FormItem>
        <FormItem label="植被类型" prop="vegetation_type">
          {{formData.vegetation_type}}
        </FormItem>
        <FormItem label="植物群落特征" prop="plant_property">
          {{formData.plant_property}}
        </FormItem>
        <FormItem label="建立后管理措施" prop="manage">
          {{formData.manage}}
        </FormItem>
        <FormItem label="是否对外服务" prop="is_public">
          {{formData.is_public}}
        </FormItem>
        <FormItem label="备注" prop="remark">
          {{formData.remark}}
        </FormItem>
        <!-- <FormItem label="证明材料电子版" prop="file_path">
          <a :href="downloadPath" v-if="formData.file_path" target="_blank">
            <Button>下载</Button>
          </a>
          <span v-if="!formData.file_path">无 </span>
          <Upload ref="fileUploader" :action="uploadURL" :on-success="uploadSuccess" :on-error="uploadError" :headers="uploadHeader" :data="uploadData">
            <Button type="ghost" icon="ios-cloud-upload-outline">点击上传材料</Button>
          </Upload>
        </FormItem> -->
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
        code: '', // '样地代码',
        name: '', // '样地名称',
        type: '', // '样地类型',
        build_year: 0, // '建立日期',
        use_year: 0, // '设计使用年限',
        area: 0, // '样地面积',
        sharp: '', // '样地形状',
        ready_to: '', // '可进行工作',
        desc: '', // '样地代表性描述',
        property: '', // '样地性质',
        location: '', // '位置',
        longitude: 0, // '经度',
        latitude: 0, // '纬度',
        altitude: 0, // '高程',
        soil_type: '', // '土壤类型',
        topography: '', // '地形地貌',
        vegetation_type: '', // '植被类型',
        plant_property: '', // '植物群落特征',
        manage: '', // '建立后管理措施',
        is_public: 0, //'是否对外服务',
        remark: '', // '备注',
        images: JSON //照片
      },
      uploadHeader: { 'x-access-token': access_token },
      uploadData: { type: 3 }
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
    //获取待编辑数据
    let params = this.$route.params
    if (!params || !params.data_id) {
      this.$Message.error({
        content: '参数错误，即将跳转至首页。',
        duration: 1.5
      })
      setTimeout(() => {
        this.$router.push({
          name: `landResourceList`
        })
      }, 1500)
      return
    }
    this.data_id = parseInt(params.data_id)
    this.get(this.data_id)
  },
  methods: {
    async get(data_id) {
      let response = await this.apis.res_land.get(data_id)
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
        name: 'landResourceEdit',
        params: { data_id: this.data_id }
      })
    },
    cancel() {
      this.$router.push({
        name: 'landResourceList'
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
      let response = await this.apis.res_land.update(update_item, this.data_id)
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
