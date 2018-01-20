<template>
  <div id="user-info">
    <Card>
      <p slot="title">
        <Icon type="compose"></Icon>
        专著信息
      </p>
      <Form ref="dataAddForm" :model="formData" :label-width="150" :rules="rules" style="width:700px">
        <FormItem label="发表年度" prop="year">
          <Select v-model="formData.year">
            <Option v-for="year in yearList" :value="year" :key="year">{{year}}</Option>
          </Select>
        </FormItem>
        <FormItem label="著作名称" prop="title">
          <Input v-model="formData.title" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="出版类型" prop="pub_type">
          <Select v-model="formData.pub_type">
            <Option v-for="pub_type in pub_type_list" :value="pub_type" :key="pub_type">{{pub_type}}</Option>
          </Select>
        </FormItem>
        <FormItem label="著作类别" prop="categories">
          <Select v-model="formData.categories">
            <Option v-for="categories in categories_list" :value="categories" :key="categories">{{categories}}</Option>
          </Select>
        </FormItem>
        <FormItem label="总字数" prop="word_count">
          <InputNumber :min="1" :step="1" v-model="formData.word_count"></InputNumber>
        </FormItem>
        <FormItem label="出版社" prop="press">
          <Input v-model="formData.press" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="书号" prop="book_number">
          <Input v-model="formData.book_number" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="出版时间" prop="pub_date">
          <Input v-model="formData.pub_date" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="单位排名" prop="rank_depart">
          <Select v-model="formData.rank_depart">
            <Option v-for="rank in rankList" :value="rank" :key="rank">{{rank}}</Option>
          </Select>
        </FormItem>
        <FormItem label="全部封面作者" prop="author">
          <Input v-model="formData.author" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="本单位首位封面作者排名" prop="rank_author">
          <Select v-model="formData.rank_author">
            <Option v-for="rank in rankList" :value="rank" :key="rank">{{rank}}</Option>
          </Select>
        </FormItem>
        <FormItem label="章节作者" prop="co_author">
          <Input v-model="formData.co_author" placeholder="请输入..."></Input>
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
        title: [
          { required: true, message: "论文标题不能为空", trigger: "blur" }
        ],
        journal: [
          { required: true, message: "刊物名称不能为空", trigger: "blur" }
        ],
        author: [
          { required: true, message: "全部作者不能为空", trigger: "blur" }
        ]
      },
      formData: {
        year: 2018, //发表年份
        title: "", //标题
        pub_type: "国内出版-中文", // 出版类别:1国内出版-中文;2?
        categories: "专著", // 著作类别：1专著；2？
        word_count: 0, //'总字数（千）',
        press: "", // 出版社
        book_number: "", // 书号（如 978-7-03-045836-0)
        pub_date: "", // 出版时间
        rank_depart: 1, //   单位排名
        author: "", // 全部封面作者
        rank_author: 1, // 本单位首位作者排名
        co_author: "", // 章节作者
        certified_path: "" // 著作首页、版权页及章节作者证明页电子版
      },
      yearList: [],
      rankList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0],
      pub_type_list: [
        "国内出版-中文",
        "国内出版-外文",
        "国外出版-外文",
        "其他"
      ],
      categories_list: ["专著", "其他"]
    };
  },
  mounted() {
    let now = new Date();
    let curYear = now.getFullYear();
    for (let year = curYear; year >= 1950; year--) {
      this.yearList.push(year);
    }
    this.formData.year = curYear;
  },
  methods: {
    async create() {
      let valid = await this.$refs.dataAddForm.validate();
      if (!valid) {
        return;
      }
      let response = await this.apis.achv_monography.create(this.formData);
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
        name: "monographyInfo",
        params: { data_id: result.data.data_id }
      });
    },
    cancel() {
      this.$router.push({
        name: "monographyList"
      });
    }
  }
};
</script>
