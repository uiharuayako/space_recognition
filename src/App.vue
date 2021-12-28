<template>
  <div id="app" class="main-view">
    <div class="bg-view">
      <div id="date-set" class="set-view">
        <a-range-picker :locale="locale" :showTime="true" :defaultValue="[moment('2020-09-08'),moment('2020-09-13')]"
                        @ok="dateChange"></a-range-picker>
        <a-button type="primary" @click="handler">加载数据点</a-button>
        <a-button type="primary" @click="clear" :disabled="clearDis">清空数据点</a-button>
        <i>当前共有{{ pointNum }}个数据点</i>
      </div>
    </div>
    <baidu-map class="bm-view" :center="center" :zoom="zoom" @ready="getMap" :scroll-wheel-zoom="true">
      <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
      <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
      <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT"
                   offset="100"></bm-map-type>
      <bm-overview-map anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :isOpen="true"></bm-overview-map>
      <bm-polyline :path="markers" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2"
                   :editing="false"></bm-polyline>
      <bml-marker-clusterer>
        <bm-marker v-for="(marker,index) of markers" :key="index" :position="{lng: marker.lng, lat: marker.lat}"
                   @click="openInfo(index)">
          <bm-label :content="marker.info" :labelStyle="{color: 'red', fontSize : '5px'}"
                    :offset="{width: 0, height: 30}"></bm-label>
          <bm-info-window :position="{lng: marker.lng, lat: marker.lat}" title="记录详情" :show="marker.showInfo"
                          @close="closeInfo(index)">
            <p v-text="marker.time"></p><br>
            <p v-text="marker.pos"></p><br>
            <p v-text="marker.air"></p>
          </bm-info-window>
        </bm-marker>
      </bml-marker-clusterer>
    </baidu-map>
  </div>
</template>

<script>
import {BmlMarkerClusterer} from 'vue-baidu-map';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

export default {
  name: 'App',
  metaInfo: {
    title: '时空轨迹追踪',
  },
  data() {
    return {
      center: {lng: 114.36510278530572, lat: 30.53221509469662},
      zoom: 15,
      pos_points: [],
      markers: [],
      startTime: '1599494400000',
      endTime: '1599926400000',
      pointNum: 0,
      clearDis: true,
      map: null,
      BMap: null,
      locale,
      moment
    }
  },
  methods: {
    getMap({BMap, map}) {
      this.BMap = BMap
      this.map = map
    },
    handler() {
      this.$axios.get('/wm/web/rest/v2/positionInfo/listTrack?did=88010E2005003C15&orderByType=ASC&pageNo=1&pageSize=200&utcBegin=' + this.startTime + '&utcEnd=' + this.endTime, {
        headers: {
          'Accept': '*/*',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJqc2Npb3Q0NWI0YjRhZDVjNzI0MTg4ODEiLCJzY29wZSI6WyJhbGwiXSwidW5pcXVlVXNlck5hbWUiOiJVc2VyXzMwNjAyOTI2MzIzIiwiZXhwIjoxNjQxMjg3MDY4LCJ1c2VyTmFtZSI6ImpzY2lvdDQ1YjRiNGFkNWM3MjQxODg4MSIsInR5cGUiOjQsInVzZXJJZCI6IjQ1YjRiNGFkNWM3MjQxODg4MTI5MmY5MmRmNWFhMWM2IiwiYXV0aG9yaXRpZXMiOlsiKjoqOioiXSwianRpIjoiZDgzNGQ2OTgtMGZhZC00ZDY4LWE3MWQtZDYzM2VkYTMwZjQ5IiwiY2xpZW50X2lkIjoieGlhb3dlaSJ9.3EvKUUUZozp8_MejN-LAZPKkYDwsQyFKDELgKprdDRw',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        this.pos_points = []
        this.markers = []
        this.pos_points = res.data.data.rows
        this.pos_points.forEach((point, index) => {
          var tmpDate = new Date(point.utcCreate)
          this.markers.push({
            lng: point.lngBd + Math.random() / 100,
            lat: point.latBd + Math.random() / 100,
            info: "第" + (index + 1).toString() + "点",
            showInfo: false,
            pos: point.address,
            air: "气压：" + point.air.toString() + "Pa",
            time: tmpDate.toLocaleString()
          })
        })
        this.pointNum = this.pos_points.length
        this.clearDis = false
      })
    },
    closeInfo(id) {
      this.markers[id].showInfo = false
    },
    openInfo(id) {
      this.center = {lng: this.markers[id].lng,lat: this.markers[id].lat}
      this.zoom=19
      this.markers[id].showInfo = true
    },
    dateChange(range) {
      this.startTime = range[0].valueOf().toString()
      this.endTime = range[1].valueOf().toString()
    },
    clear() {
      this.pos_points = []
      this.markers = []
      this.pointNum = 0
      this.clearDis = true
    }
  },
  components: {
    BmlMarkerClusterer,
  }
}
</script>
<style>
.bm-view {
  width: 100%;
  height: inherit;
}

.main-view {
  height: 650px;
}

.bg-view {
  width: 100%;
  background-color: antiquewhite;
}

.set-view {
  text-align: center;
  background-color: antiquewhite;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex: 0.9;
  width: 50%;
}
</style>
