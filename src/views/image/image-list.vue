<template>
  <div>
    <Row type="flex" justify="start" class="image-list-row">
      <Col class="image-item" v-for="item in image_list" :key="item.data_id">
      <div @mouseover="mouseHover(item)" @mouseleave="mouseLeave(item)">
        <Card :padding="10">
          <p slot="title" v-if="cur_edit!=item.data_id">{{item.name}}</p>
          <p slot="title" v-if="cur_edit==item.data_id">
            <Input type="text" v-model="newImageName" :value="item.name" size="small" placeholder="请输入图片名称" style="width:200px;margin-right:10px;"></Input>
            <Icon type="checkmark" @click.native="updateImageName(item)" class="image-extra-edit"></Icon>
            <Icon type="close-round" @click.native="setEditCancel" class="image-extra-edit"></Icon>
          </p>
          <p slot="extra" v-show="item.data_id==cur_hover&&cur_edit!=item.data_id">
            <Icon type="edit" @click.native="setEdit(item)" class="image-extra-edit"></Icon>
            <Icon type="close" @click.native="deleteImage(item)" class="image-extra-remove"></Icon>
          </p>
          <p class="image-container">
            <router-link :to="{ name: 'scientificImageView', params: { type: 1,data_id:item.data_id }}"><img :src="item.path | getAbsolutePath"></router-link>
          </p>
          <p class="image-item-footer">{{item.updated_at|getENDatetime}} </p>
        </Card>
      </div>
      </Col>
      <Col class="image-item">
      <Card :padding="10">
        <p slot="title">上传新的图片
        </p>
        <p class="upload-image">
          <Upload ref="imageUploader" type="drag" :action="uploadURL" :on-success="uploadSuccess" :on-error="uploadError" :headers="uploadHeader" :data="uploadData">
            <div style="padding: 20px 0">
              <Icon type="plus-round" size="52" style="color: #3399ff"></Icon>
              <p>点击这里上传</p>
            </div>
          </Upload>
        </p>
      </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import Cookies from "js-cookie";

export default {
  name: "image",
  data() {
    return {
      query: {
        keys: {
          name: null,
          type: 1
        },
        offset: 0,
        limit: -1,
        order: 0,
        order_by: "data_id"
      },
      image_list: [],
      cur_hover: null,
      is_add_modal: false,
      cur_edit: null,
      newImageName: ""
    };
  },
  computed: {
    uploadURL: function() {
      return CONFIG.API_V1 + "/image/upload";
    },
    uploadHeader: function() {
      let access_token = Cookies.get("access_token");
      return { "x-access-token": access_token };
    },
    type: {
      get: function() {
        return this.query.keys.type;
      },
      set: function(value) {
        this.query.keys.type = value;
      }
    },
    uploadData: function() {
      return { type: this.type };
    }
  },
  watch: {
    $route(to, from) {
      let params = this.$route.params;
      if (!params || !params.type) {
        this.$Message.error({
          content: "参数错误，即将跳转至首页。",
          duration: 2
        });
        setTimeout(() => {
          this.$router.push({
            name: "home",
            params: { type: this.type }
          });
        }, 1500);
        return;
      }
      this.type = parseInt(params.type);
      this.list();
    }
  },
  methods: {
    async list() {
      let response = await this.apis.image.list(this.query);
      let result = response.data;
      if (result.code === 0) {
        this.$Message.error({
          content: result.msg,
          duration: 1.5
        });
        return;
      }
      this.image_list = result.data.rows;
    },
    mouseHover(item) {
      this.cur_hover = item.data_id;
    },
    mouseLeave(item) {
      this.cur_hover = null;
    },
    uploadSuccess() {
      this.$refs.imageUploader.clearFiles();
      this.list();
    },
    uploadError(err) {
      this.$Message.error({
        content: err,
        duration: 1.5
      });
    },
    setEdit(item) {
      this.cur_edit = item.data_id;
      this.newImageName = item.name;
    },
    setEditCancel() {
      this.cur_edit = null;
    },
    async deleteImage(item) {
      let response = await this.apis.image.delete([item.data_id]);
      let result = response.data;
      if (result.code === 0) {
        this.$Message.error({
          content: result.msg,
          duration: 1.5
        });
      } else {
        this.$Message.success({
          content: result.msg,
          duration: 1.5
        });
        this.list();
      }
    },
    async updateImageName(item, name) {
      let response = await this.apis.image.update(
        { name: this.newImageName },
        item.data_id
      );
      let result = response.data;
      if (result.code === 0) {
        this.$Message.error({
          content: result.msg,
          duration: 1.5
        });
      } else {
        this.$Message.success({
          content: result.msg,
          duration: 1.5
        });
        item.name = this.newImageName;
        this.setEditCancel();
      }
    }
  },
  mounted() {
    let params = this.$route.params;
    if (!params || !params.type) {
      this.$Message.error({
        content: "参数错误，即将跳转至首页。",
        duration: 1.5
      });
      setTimeout(() => {
        this.$router.push({
          name: `home`
        });
      }, 1500);
      return;
    }
    this.type = parseInt(params.type);
    this.list();
  }
};
</script>
<style lang="less">
.image-list-row {
  // overflow-y: auto;
  .image-item {
    width: 274px;
    height: 250px;
    margin: 8px 4px;
    overflow: hidden;
    .ivu-card {
      height: 100%;
      width: 100%;
      .ivu-card-head {
        padding: 10px;
      }
      .image-item-footer {
        margin-top: 3px;
        color: #a5a5a5;
        font-size: 10px;
      }
      .ivu-upload {
        height: 140px;
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
      .image-container {
        width: 100%;
        height: 161px;
        overflow: hidden;
        text-align: center;
        img {
          height: auto;
          width: 100%;
          max-width: 100%;
          // max-height: 100%;
        }
      }
    }
    .image-item:hover {
      .image-extra {
        display: inherit;
      }
    }
  }
}
</style>
