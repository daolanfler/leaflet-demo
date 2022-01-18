<template>
  <div class="map-wrapper">
    <el-select style="width: 300px" v-model="tile" @change="changeTile">
      <el-option
        v-for="item in list"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      ></el-option>
    </el-select>
    <div id="map"></div>
  </div>
</template>

<script lang="ts">
import * as maptalks from "maptalks";
import moment from "moment";

const udt = moment().format("YYYYMMDD");
console.log(udt);

const center = [112.85843755668577, 35.49174155526285];
// http://maponline{s}.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=20211208
// const tileUrl3 = `http://online{s}.map.bdimg.com/onlinelabel/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=${udt}`;
const tileUrl3 = `http://maponline{s}.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=20211208`;
const tileUrl2 = `https://gss{s}.bdstatic.com/8bo_dTSlRsgBo1vgoIiO_jowehsv/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=${udt}`;

export default {
  name: "MapdemoIndex",
  data() {
    return {
      tile: tileUrl3,
      /** @type {maptalks.Map} */
      map: null,
      list: [
        {
          label: "2.0",
          value: tileUrl2
        },
        {
          label: "3.0",
          value: tileUrl3
        }
      ]
    };
  },
  methods: {
    changeTile(val) {
      const layer = new maptalks.TileLayer("base", {
        urlTemplate: val,
        subdomains: [0, 1, 2, 3],
        attribution:
          '&copy; <a target="_blank" href="http://map.baidu.com">Baidu</a>'
      });
      this.map.setBaseLayer(layer);
    }
  },
  mounted() {
    const map = new maptalks.Map("map", {
      center,
      zoom: 14,
      minZoom: 1,
      maxZoom: 19,
      draggable: true,
      scaleControl: true,
      zoomControl: true,
      dragRotate: false,
      dragPitch: false,
      dragRotatePitch: false,
      spatialReference: {
        projection: "baidu"
      },
      baseLayer: new maptalks.TileLayer("base", {
        urlTemplate: this.tile,
        subdomains: [0, 1, 2, 3],
        spatialReference: {
          projection: "BAIDU"
        },
        attribution:
          '&copy; <a target="_blank" href="http://map.baidu.com">Baidu</a>'
      })
    });
    this.map = map;
  },
  created() {}
};
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 100%;
}
#map {
  width: 100%;
  height: calc(100vh - 60px)
}
</style>
