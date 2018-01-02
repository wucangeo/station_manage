<template>
  <div>
    <!-- <Card :padding="10"> -->
    <Row type="flex" justify="end">
      <span>
        <Button type="primary" @click="" icon="plus">添加</Button>
      </span>
    </Row>
    <Row type="flex" justify="start" class="image-list-row">
      <Col class="image-item" v-for="item in image_list">
      <div @mouseover="mouseHover(item)" @mouseleave="mouseLeave(item)">
        <Card :padding="10">
          <p slot="title">{{item.name}}</p>
          <p slot="extra" v-show="item.data_id==cur_hover">
            <Icon type="edit" class="image-extra-edit"></Icon>
            <Icon type="close" class="image-extra-remove"></Icon>
          </p>
          <p>
            <router-link :to="{ name: 'scientificImageView', params: { type: 1,data_id:item.data_id }}"><img :src="item.path | getAbsolutePath"></router-link>
          </p>
          <p class="image-item-footer">{{item.updated_at|getENDatetime}} </p>
          <!-- <Button type="error">Delete</Button> -->
        </Card>
      </div>
      </Col>
      <Col class="image-item">
      <Card :padding="10">
        <p slot="title">添加新的图片
        </p>
        <p class="image-item-title">
          <Input placeholder="请输入标题..." style="width: 258px"></Input>
        </p>
        <p class="upload-image">
          <Upload multiple type="drag" action="//jsonplaceholder.typicode.com/posts/">
            <div style="padding: 20px 0">
              <Icon type="plus-round" size="52" style="color: #3399ff"></Icon>
              <p>点击这里上传</p>
            </div>
          </Upload>
        </p>
        <!-- <Button type="error">Delete</Button> -->
      </Card>
      </Col>
    </Row>
    <!-- </Card> -->
  </div>
</template>
<script>
export default {
  name: 'image',
  data() {
    return {
      query: {
        key: '',
        type: 1,
        offset: 0,
        limit: 10,
        order: 1,
        order_by: 'data_id'
      },
      image_list: [],
      cur_hover: null
    }
  },
  methods: {
    async list() {
      let response = await this.apis.image.list(this.query)
      let result = response.data
      if (result.code === 0) {
        this.$Message.error({
          content: result.msg,
          duration: 1.5
        })
        return
      }
      this.image_list = result.data.rows
    },
    mouseHover(item) {
      this.cur_hover = item.data_id
    },
    mouseLeave(item) {
      this.cur_hover = null
    }
  },
  mounted() {
    this.list()
  }
}
</script>
<style lang="less">
.image-list-row {
  overflow-y: auto;
  .image-item {
    width: 278px;
    height: 250px;
    margin: 8px 4px;
    .ivu-card {
      height: 100%;
      width: 100%;
      .ivu-card-head {
        padding: 10px;
      }
      .image-item-footer {
        margin: 10px;
        color: #828282;
      }
      .ivu-upload {
        height: 130px;
      }
      .image-item-title {
        margin-bottom: 10px;
      }
      .image-extra {
        display: none;
      }
      .image-extra-edit {
        cursor: pointer;
        color: #0d98ff;
        margin-right: 8px;
      }
      .image-extra-remove {
        cursor: pointer;
        color: #fa2d2d;
      }
      .image-body {
        cursor: pointer;
      }
    }
    .image-item:hover {
      .image-extra {
        display: inherit;
      }
    }

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>
