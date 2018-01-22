<template>
  <div class="home-main">
    <Row :gutter="10">
      <Col :md="24" :lg="8">
      <Row class-name="home-page-row1" :gutter="10">
        <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
        <Card>
          <Row type="flex" class="user-infor">
            <Col span="16" style="padding-left:6px;">
            <Row class-name="made-child-con-middle" type="flex" align="middle">
              <div>
                <b class="card-user-infor-name">{{lastLogin.name}}</b>
                <b>{{lastLogin.username}}</b>
              </div>
            </Row>
            </Col>
          </Row>
          <div class="line-gray"></div>
          <Row class="margin-top-8">
            <Col span="8">
            <p class="notwrap">上次登录时间:</p>
            </Col>
            <Col span="16" class="padding-left-8">{{lastLogin.time|getENDatetime}}</Col>
          </Row>
          <Row class="margin-top-8">
            <Col span="8">
            <p class="notwrap">上次登录地点:</p>
            </Col>
            <Col span="16" class="padding-left-8">{{lastLogin.city}}</Col>
          </Row>
        </Card>
        </Col>
        <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
        <Card>
          <p slot="title" class="card-title">
            <Icon type="android-checkbox-outline"></Icon>
            上周每日来访量统计
          </p>
          <div class="to-do-list-con" style="height:200px">
            <figure>
              <chart style="width:100%;height:100%;" :options="bar" :init-options="initOptions" ref="bar" theme="ovilia-green" auto-resize
              />
            </figure>
          </div>
        </Card>
        </Col>
      </Row>
      </Col>
      <Col :md="24" :lg="16">
      <div>
        <Row :gutter="5">
          <Col v-for="item in count" :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
          <Card :padding="0">
            <div class="infor-card-con">
              <Col class="infor-card-icon-con" :style="{backgroundColor: item.color, color: 'white'}" span="8">
              <Row class="height-100" type="flex" align="middle" justify="center">
                <Icon :type="item.icon" size="50"></Icon>
              </Row>
              </Col>
              <Col span="16" class="height-100">
              <Row type="flex" align="middle" justify="center" class="height-100">
                <div>
                  <p class="infor-card-count user-created-count" :style="{textAlign: 'center', color: item.color, fontSize: '30px', fontWeight: 700}">
                    <span v-cloak id="user_created_count">{{ item.count }}</span>
                  </p>
                  <p class="infor-intro-text">{{ item.text }}</p>
                </div>
              </Row>
              </Col>
            </div>
          </Card>
          </Col>
        </Row>
      </div>
      <Row>
        <Card :padding="0">
          <p slot="title" class="card-title">
            <Icon type="map"></Icon>
            今日服务调用地理分布
          </p>
          <div class="map-con">
            <Col span="10">
            <!-- <map-data-table :cityData="cityData" height="281" :style-obj="{margin: '12px 0 0 11px'}"></map-data-table> -->
            </Col>
            <Col span="14" class="map-incon">
            <Row type="flex" justify="center" align="middle">
              <!-- <home-map :city-data="cityData"></home-map> -->
            </Row>
            </Col>
          </div>
        </Card>
      </Row>
      </Col>
    </Row>
  </div>
</template>
<script>
  import Cookies from 'js-cookie'
  import ECharts from 'vue-echarts/components/ECharts'
  import 'echarts/lib/chart/bar'

  export default {
    name: 'home',
    components: {
      chart: ECharts
    },
    data() {
      return {
        lastLogin: {
          username: '',
          name: '',
          time: '未知',
          city: '未知'
        },
        count: [{
            icon: 'android-person-add',
            color: '#2d8cf0',
            count: 0,
            text: '今日访问总量'
          },
          {
            icon: 'ios-eye',
            color: '#64d572',
            count: 0,
            text: '今日访问用户'
          },
          {
            icon: 'upload',
            color: '#ffd572',
            count: 0,
            text: '今日管理员登录'
          },
          {
            icon: 'shuffle',
            color: '#f25e43',
            count: 0,
            text: '今日数据新增和更新'
          }
        ],
        initOptions: {
          renderer: 'canvas'
        },
      }
    },
    computed: {
      bar() {
        let items = ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        return {
          title: {
            text: '异步数据加载示例'
          },
          tooltip: {},
          legend: {
            data: ['销量']
          },
          xAxis: {
            data: items
          },
          yAxis: {
            axisLabel: {
              show: true
            }
          },
          series: [{
            type: 'bar',
            name: '销量',
            data: items.map(() => Math.floor(Math.random() * 40 + 10))
          }]
        }
      }
    },
    methods: {
      //上次登录信息
      async getLastLogin() {
        let user_id = Cookies.get('user_id')
        this.lastLogin.username = Cookies.get('username')
        this.lastLogin.name = Cookies.get('user')
        if (user_id) {
          let query = {
            keys: {
              user_id: parseInt(user_id)
            },
            offset: 0,
            limit: 2,
            order: 0,
            order_by: 'data_id'
          }
          let res_last_login = await this.apis.log_view.list(query)
          if (res_last_login.status === 200 && res_last_login.data.code === 1) {
            let data = res_last_login.data.data.rows
            if (data.length > 0) {
              let index = data.length
              this.lastLogin.time = data[index - 1].created_at
              this.lastLogin.city = data[index - 1].city ?
                data[index - 1].city :
                this.lastLogin.city
            }
          }
        }
      },
      //用户浏览统计
      async userViewCount(type, from_time = 0, to_time = 1) {
        let query = {
          type,
          from_time,
          to_time
        }
        let count = 0
        let res_last_count = await this.apis.log_view.count(query)
        if (res_last_count.status === 200 && res_last_count.data.code === 1) {
          count = res_last_count.data.data
        }
        this.count[type].count = count
      }
    },
    async mounted() {
      //用户信息
      this.getLastLogin()
      //顶部统计
      this.userViewCount(0)
      this.userViewCount(1)
      this.userViewCount(2)
      this.userViewCount(3)
    }
  }
</script>
<style lang="less">
  .line-gray {
    height: 0;
    border-bottom: 2px solid #dcdcdc;
  }

  .notwrap {
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-user-infor-name {
    font-size: 2em;
    color: #2d8cf0;
  }

  .made-child-con-middle {
    height: 100%;
  }

  .infor-card-icon-con {
    height: 100%;
  }

  .height-100 {
    height: 100%;
  }

  .infor-card-con {
    height: 100px;
  }

  .infor-intro-text {
    font-size: 12px;
    font-weight: 500;
    color: #c8c8c8;
  }
</style>