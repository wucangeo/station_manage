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
            近七天每日来访量统计
          </p>
          <div class="to-do-list-con" style="height:200px">
            <chart style="width:100%;height:100%;" :options="barOption" :init-options="initOptions" ref="bar" theme="ovilia-green" auto-resize
            />
          </div>
        </Card>
        </Col>
      </Row>
      </Col>
      <Col :md="24" :lg="16">
      <div>
        <Row :gutter="5">
          <Col v-for="item in topCount" :key="item.color" :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
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
            近七天服务调用地理分布
          </p>
          <div style="height:266px">
            <Col span="8">
            <Table stripe :columns="tableColumn" :data="tableData" height="260"></Table>
            </Col>
            <Col span="16">
            <!-- <Row type="flex" justify="center" align="middle"> -->
            <!-- <home-map :city-data="cityData"></home-map> -->
            <chart style="width:100%;height:260px;" :options="mapOption" :init-options="initOptions" ref="map" auto-resize />
            <!-- </Row> -->
            </Col>
          </div>
        </Card>
      </Row>
      </Col>
    </Row>
    <Row :gutter="10">
      <Card>
        <p slot="title" class="card-title">
          <Icon type="android-checkbox-outline"></Icon>
          近七天每日服务调用量
        </p>
        <div class="to-do-list-con" style="height:250px">
          <chart style="width:100%;height:100%;" :options="lineOption" :init-options="initOptions" ref="line" theme="ovilia-green"
            auto-resize />
        </div>
      </Card>
    </Row>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import ECharts from "vue-echarts/components/ECharts";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/chart/scatter";
import "echarts/lib/chart/effectScatter";
import "echarts/lib/chart/map";
import "echarts/lib/component/visualMap";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/geo";
import "echarts/lib/component/legend";
import "echarts/lib/component/title";

import geoCoordMap from "./geoCoordMap.json";
import chinaJson from "./chinaMap.json";
ECharts.registerMap("china", chinaJson);

export default {
  name: "home",
  components: {
    chart: ECharts
  },
  data() {
    return {
      lastLogin: {
        username: "",
        name: "",
        time: "未知",
        city: "未知"
      },
      topCount: [
        {
          icon: "ios-eye",
          color: "#2d8cf0",
          count: 0,
          text: "今日访问总量"
        },
        {
          icon: "happy",
          color: "#64d572",
          count: 0,
          text: "今日访问用户"
        },
        {
          icon: "person-stalker",
          color: "#ffd572",
          count: 0,
          text: "今日管理员登录"
        },
        {
          icon: "wand",
          color: "#f25e43",
          count: 0,
          text: "今日新增和更新"
        }
      ],
      initOptions: {
        renderer: "canvas"
      },
      barUrlCount: {
        items: [],
        values: []
      }, //按模块统计， 柱状图
      lineUrlCount: {
        items: [
          "台站信息",
          "台站风光",
          "新闻公告",
          "数据资源",
          "科研成果",
          "科研项目"
        ],
        data: {
          station: [0, 0, 0, 0, 0, 0, 0],
          image: [0, 0, 0, 0, 0, 0, 0],
          news: [0, 0, 0, 0, 0, 0, 0],
          data: [0, 0, 0, 0, 0, 0, 0],
          achv: [0, 0, 0, 0, 0, 0, 0],
          project: [0, 0, 0, 0, 0, 0, 0]
        },
        dateDic: {}, //存放日期索引
        dateItems: [] //日期
      },
      tableColumn: [
        {
          title: "城市",
          key: "name"
        },
        {
          title: "浏览量",
          key: "value",
          width: 80
        }
      ],
      tableData: [],
      mapData: [], //地图数据
      maxMapCount: 10 //地图中城市最大浏览量
    };
  },
  computed: {
    barOption() {
      return {
        tooltip: {
          trigger: "item"
        },
        yAxis: {
          type: "category",
          data: this.barUrlCount.items
        },
        xAxis: {
          type: "value",
          axisLabel: {
            show: true
          }
        },
        grid: {
          top: "0",
          left: "0",
          right: "10px",
          bottom: "0",
          containLabel: true
        },
        series: [
          {
            type: "bar",
            name: "浏览量",
            data: this.barUrlCount.values
          }
        ]
      };
    },
    lineOption() {
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: this.lineUrlCount.items
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          top: "5px",
          left: "5px",
          right: "15px",
          bottom: "5px",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.lineUrlCount.dateItems
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "台站信息",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {}
            },
            data: this.lineUrlCount.data.station
          },
          {
            name: "台站风光",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {}
            },
            data: this.lineUrlCount.data.image
          },
          {
            name: "新闻公告",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {}
            },
            data: this.lineUrlCount.data.news
          },
          {
            name: "数据资源",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {}
            },
            data: this.lineUrlCount.data.data
          },
          {
            name: "科研成果",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {}
            },
            data: this.lineUrlCount.data.achv
          },
          {
            name: "科研项目",
            type: "line",
            stack: "总量",
            areaStyle: {
              normal: {}
            },
            data: this.lineUrlCount.data.project
          }
        ]
      };
    },
    mapOption() {
      return {
        backgroundColor: "#404a59",
        tooltip: {
          trigger: "item",
          formatter: function(data) {
            return data.name + ":" + data.value[2];
          }
        },
        legend: {
          orient: "vertical",
          y: "bottom",
          x: "right",
          data: ["浏览量"],
          textStyle: {
            color: "#fff"
          }
        },
        geo: {
          map: "china",
          label: {
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: "#323c48",
              borderColor: "#111"
            },
            emphasis: {
              areaColor: "#2a333d"
            }
          }
        },
        series: [
          {
            name: "浏览量",
            type: "scatter",
            coordinateSystem: "geo",
            data: this.mapData,
            symbolSize: val => {
              return Math.ceil(val[2]) * 40 / this.maxMapCount;
            },
            label: {
              normal: {
                formatter: "{b}",
                position: "right",
                show: false
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: "#ddb926"
              }
            }
          }
        ]
      };
    }
  },
  methods: {
    //上次登录信息
    async getLastLogin() {
      let user_id = Cookies.get("user_id");
      this.lastLogin.username = Cookies.get("username");
      this.lastLogin.name = Cookies.get("user");
      if (user_id) {
        let query = {
          keys: {
            user_id: parseInt(user_id)
          },
          offset: 0,
          limit: 2,
          order: 0,
          order_by: "data_id"
        };
        let res_last_login = await this.apis.log_view.list(query);
        if (res_last_login.status === 200 && res_last_login.data.code === 1) {
          let data = res_last_login.data.data.rows;
          if (data.length > 0) {
            let index = data.length;
            this.lastLogin.time = data[index - 1].created_at;
            this.lastLogin.city = data[index - 1].city
              ? data[index - 1].city
              : this.lastLogin.city;
          }
        }
      }
    },
    //用户浏览统计
    async userViewCount(type, from_time = -1, to_time = 0) {
      let query = {
        type,
        from_time,
        to_time
      };
      let count = 0;
      let res_last_count = await this.apis.log_view.count(query);
      if (res_last_count.status === 200 && res_last_count.data.code === 1) {
        count = res_last_count.data.data;
      }
      this.topCount[type].count = count;
    },
    //按模块浏览统计
    async urlViewCount(type, from_time = -7, to_time = 0) {
      let query = {
        type,
        from_time,
        to_time
      };
      let data = [];
      let res_last_count = await this.apis.log_view.url(query);
      if (res_last_count.status === 200 && res_last_count.data.code === 1) {
        data = res_last_count.data.data;
        if (type === 2) {
          let lineData = {
            station: [0, 0, 0, 0, 0, 0, 0],
            image: [0, 0, 0, 0, 0, 0, 0],
            news: [0, 0, 0, 0, 0, 0, 0],
            data: [0, 0, 0, 0, 0, 0, 0],
            achv: [0, 0, 0, 0, 0, 0, 0],
            project: [0, 0, 0, 0, 0, 0, 0]
          };
          for (let dd of data) {
            let date = dd.date;
            let key = dd.name;
            let value = dd.value;
            let dateIndex = this.lineUrlCount.dateDic[date];
            if (dateIndex === undefined) {
              continue;
            }
            if (
              ![
                "station",
                "image",
                "news",
                "data",
                "paper",
                "monography",
                "patent",
                "awards",
                "project"
              ].includes(key)
            ) {
              continue;
            }
            if (["paper", "monography", "patent", "awards"].includes(key)) {
              key = "achv";
            }
            lineData[key][dateIndex] = value;
          }
          this.lineUrlCount.data = lineData;
        } else {
          let items = [],
            values = [];
          for (let dd of data) {
            items.push(dd.date);
            values.push(dd.value);
          }
          this.barUrlCount.items = items;
          this.barUrlCount.values = values;
        }
      }
    },
    //按地图浏览统计
    async mapViewCount(type, from_time = -7, to_time = 0) {
      let query = {
        type,
        from_time,
        to_time
      };
      let res_last_count = await this.apis.log_view.map(query);
      if (res_last_count.status === 200 && res_last_count.data.code === 1) {
        let data = res_last_count.data.data;
        this.tableData = data;
        var res = [];
        for (var i = 0; i < data.length; i++) {
          let city = data[i];
          var geoCoord = geoCoordMap[city.name];
          if (geoCoord) {
            if (city.value > this.maxMapCount) {
              this.maxMapCount = city.value;
            }
            res.push({
              name: city.name,
              value: geoCoord.concat(city.value)
            });
          }
        }
        this.mapData = res;
        console.log("mapData:", this.mapData);
      }
    }
  },
  async mounted() {
    let dateDic = this.filters.getLast7DateDic();
    this.lineUrlCount.dateDic = dateDic.dic;
    this.lineUrlCount.dateItems = dateDic.date;
    //用户信息
    this.getLastLogin();
    //顶部统计
    this.userViewCount(0);
    this.userViewCount(1);
    this.userViewCount(2);
    this.userViewCount(3);
    this.urlViewCount(1);
    this.urlViewCount(2);
    this.mapViewCount(1);
  }
};
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