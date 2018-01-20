<template>
  <div id="user-info">
    <Card>
      <p slot="title">
        <Icon type="compose"></Icon>
        专著信息
      </p>
      <Form ref="dataAddForm" :model="formData" :label-width="200" :rules="rules" style="width:700px">
        <FormItem label="授予年度" prop="year">
          <Select v-model="formData.year">
            <Option v-for="year in yearList" :value="year" :key="year">{{year}}</Option>
          </Select>
        </FormItem>
        <FormItem label="获奖项目名称" prop="title">
          <Input v-model="formData.title" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="奖项类别" prop="awards_type">
          <Select v-model="formData.awards_type">
            <Option v-for="awards_type in awards_type_list" :value="awards_type" :key="awards_type">{{awards_type}}</Option>
          </Select>
        </FormItem>
        <FormItem label="获奖等级" prop="awards_class">
          <Select v-model="formData.awards_class">
            <Option v-for="awards_class in awards_class_list" :value="awards_class" :key="awards_class">{{awards_class}}</Option>
          </Select>
        </FormItem>
        <FormItem label="获奖级别" prop="awards_level">
          <Select v-model="formData.awards_level">
            <Option v-for="awards_level in awards_level_list" :value="awards_level" :key="awards_level">{{awards_level}}</Option>
          </Select>
        </FormItem>
        <FormItem label="设奖单位" prop="awards_depart">
          <Input v-model="formData.awards_depart" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="获奖年份" prop="year">
          <Select v-model="formData.awards_year">
            <Option v-for="year in yearList" :value="year" :key="year">{{year}}</Option>
          </Select>
        </FormItem>
        <FormItem label="团体/个人奖项" prop="awards_oneorgroup">
          <Select v-model="formData.awards_oneorgroup">
            <Option v-for="awards_oneorgroup in awards_oneorgroup_list" :value="awards_oneorgroup" :key="awards_oneorgroup">{{awards_oneorgroup}}</Option>
          </Select>
        </FormItem>
        <FormItem label="全部完成单位" prop="author">
          <Input v-model="formData.author" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="全部完成人" prop="co_author">
          <Input v-model="formData.co_author" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="本单位排名" prop="rank_depart">
          <Select v-model="formData.rank_depart">
            <Option v-for="rank in rankList" :value="rank" :key="rank">{{rank}}</Option>
          </Select>
        </FormItem>
        <FormItem label="本单位首位完成人排名" prop="rank_author">
          <Select v-model="formData.rank_author">
            <Option v-for="rank in rankList" :value="rank" :key="rank">{{rank}}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="formData.remark" type='textarea' placeholder="请输入..."></Input>
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
        title: [
          { required: true, message: "获奖项目名称不能为空", trigger: "blur" }
        ],
        author: [
          { required: true, message: "获奖单位不能为空", trigger: "blur" }
        ]
      },
      data_id: 0,
      formData: {
        year: 1, //'授予年度',
        title: "", //'获奖项目名称',
        awards_type: "", //'奖项类别',
        awards_class: "", //'获奖等级',
        awards_level: "", //'获奖级别',
        awards_depart: "", //'设奖单位',
        awards_year: "", //'获奖年份',
        awards_oneorgroup: "团体", ///个人奖项',
        author: "", //'全部完成单位',
        rank_depart: 1, //'本单位排名',
        co_author: "", //'全部完成人',
        rank_author: 1, //'本单位首位完成人排名',
        remark: "", //'备注',
        file_path: "" //'证明材料电子版',
      },
      yearList: [],
      rankList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0],
      awards_type_list: [
        "社会科技奖",
        "	国家自然科学奖",
        "国家科学技术进步奖",
        "其他"
      ],
      awards_class_list: ["特等奖", "一等奖", "二等奖", "三等奖", " 其他"],
      awards_level_list: [
        "国家",
        "部委",
        "省级",
        "研究所（高校）",
        "中科院",
        "升级",
        " 其他"
      ],
      awards_oneorgroup_list: ["个人", "团体"]
    };
  },
  mounted() {
    //处理年份
    let now = new Date();
    let curYear = now.getFullYear();
    for (let year = curYear; year >= 1950; year--) {
      this.yearList.push(year);
    }
    this.formData.year = curYear;
    //获取待编辑数据
    let params = this.$route.params;
    if (!params || !params.data_id) {
      this.$Message.error({
        content: "参数错误，即将跳转至首页。",
        duration: 1.5
      });
      setTimeout(() => {
        this.$router.push({
          name: `awardsList`
        });
      }, 1500);
      return;
    }
    this.data_id = parseInt(params.data_id);
    this.get(this.data_id);
  },
  methods: {
    async get(data_id) {
      let response = await this.apis.achv_awards.get(data_id);
      let result = response.data;
      if (result.code === 0) {
        this.$Message.error({
          content: result.msg,
          duration: 1.5
        });
        return;
      }
      this.formData = result.data;
    },
    async update() {
      let valid = await this.$refs.dataAddForm.validate();
      if (!valid) {
        return;
      }
      //参数类型转换
      let formData = this.formData;
      formData.year = formData.year || 0;
      formData.awards_year = parseInt(formData.awards_year) || 0;
      formData.rank_depart = parseInt(formData.rank_depart) || 0;
      formData.rank_author = parseInt(formData.rank_author) || 0;

      formData.awards_type = formData.awards_type || "";
      formData.awards_class = formData.awards_class || "";
      formData.awards_level = formData.awards_level || "";
      formData.awards_depart = formData.awards_depart || "";
      formData.awards_oneorgroup = formData.awards_oneorgroup || "";
      formData.author = formData.author || "";
      formData.co_author = formData.co_author || "";
      formData.remark = formData.remark || "";
      formData.file_path = formData.file_path || "";

      let response = await this.apis.achv_awards.update(formData, this.data_id);
      let result = response.data;
      if (result.code === 0) {
        this.$Message.error({
          content: result.msg,
          duration: 3
        });
        return;
      } else {
        this.$Message.success({
          content: result.msg,
          duration: 3
        });
      }
      //跳转至数据详情页
      this.$router.push({
        name: "awardsInfo",
        params: { data_id: result.data.data_id }
      });
    },
    cancel() {
      this.$router.push({
        name: "awardsInfo",
        params: { data_id: this.data_id }
      });
    }
  }
};
</script>
