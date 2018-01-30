<template>
  <div id="user-info">
    <Card>
      <p slot="title">
        <Icon type="compose"></Icon>
        样地资源
      </p>
      <Form ref="dataAddForm" :model="formData" :label-width="150" :rules="rules" style="width:700px">
        <FormItem label="样地代码" prop="code">
          <Input v-model="formData.code" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="样地名称" prop="name">
          <Input v-model="formData.name" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="样地类型" prop="type">
          <Select v-model="formData.type">
            <Option v-for="type in typeList" :value="type" :key="type">{{type}}</Option>
          </Select>
        </FormItem>
        <FormItem label="建立日期" prop="build_year">
          <Select v-model="formData.build_year">
            <Option v-for="year in yearList" :value="year" :key="year">{{year}}</Option>
          </Select>
        </FormItem>
        <FormItem label="设计使用年限" prop="use_year">
          <Select v-model="formData.use_year">
            <Option v-for="useYear in useYearList" :value="useYear" :key="useYear">{{useYear}}</Option>
          </Select>
        </FormItem>
        <FormItem label="样地面积(平米)" prop="area">
          <InputNumber :min="0" :step="0.1" v-model="formData.area"></InputNumber>
        </FormItem>
        <FormItem label="样地形状" prop="sharp">
          <Select v-model="formData.sharp">
            <Option v-for="sharp in sharpList" :value="sharp" :key="sharp">{{sharp}}</Option>
          </Select>
        </FormItem>
        <FormItem label="可进行工作" prop="ready_to">
          <Input v-model="formData.ready_to" type="textarea" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="样地代表性描述" prop="desc">
          <Input v-model="formData.desc" type="textarea" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="样地性质" prop="property">
          <Input v-model="formData.property" type="textarea" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="所在地点" prop="location">
          <Input v-model="formData.location" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="经度" prop="longitude">
          <InputNumber :step="0.1" v-model="formData.longitude"></InputNumber>
        </FormItem>
        <FormItem label="纬度" prop="latitude">
          <InputNumber :step="0.1" v-model="formData.latitude"></InputNumber>
        </FormItem>
        <FormItem label="高程(米)" prop="altitude">
          <InputNumber :step="0.1" v-model="formData.altitude"></InputNumber>
        </FormItem>
        <FormItem label="土壤类型" prop="soil_type">
          <Input v-model="formData.soil_type" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="地形地貌" prop="topography">
          <Input v-model="formData.topography" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="植被类型" prop="vegetation_type">
          <Input v-model="formData.vegetation_type" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="植物群落特征" prop="plant_property">
          <Input v-model="formData.plant_property" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="建立后管理措施" prop="manage">
          <Input v-model="formData.manage" type="textarea" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="是否对外服务" prop="is_public">
          <i-switch v-model="formData.is_public" size="large" :true-value="1" :false-value="0">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" type="textarea" placeholder="请输入..."></Input>
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
        name: [
          { required: true, message: '样地名称不能为空', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '样地位置不能为空', trigger: 'blur' }
        ]
      },
      formData: {
        code: '', // '样地代码',
        name: '', // '样地名称',
        type: '永久样地', // '样地类型',
        build_year: 0, // '建立日期',
        use_year: '永久', // '设计使用年限',
        area: 0, // '样地面积',
        sharp: '长方形', // '样地形状',
        ready_to: '', // '可进行工作',
        desc: '', // '样地代表性描述',
        property: '', // '样地性质',
        location: '', // '所在地点',
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
      typeList: ['永久样地', '长期样地'],
      yearList: [],
      useYearList: [
        '永久',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '15',
        '20',
        '25',
        '30',
        '35',
        '40',
        '45',
        '50'
      ],
      sharpList: ['正方形', '长方形', '圆形', '三角形', '不规则多边形']
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
      let response = await this.apis.res_land.create(this.formData)
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
        name: 'landResourceInfo',
        params: { data_id: result.data.data_id }
      })
    },
    cancel() {
      this.$router.push({
        name: 'landResourceList'
      })
    }
  }
}
</script>
