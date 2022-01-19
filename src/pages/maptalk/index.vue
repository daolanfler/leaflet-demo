<template>
  <div class="map-wrapper">
    <NSpace style="margin-bottom: 8px;">
      <NSelect
        placeholder="请选择瓦片服务版本"
        style="width: 200px"
        v-model:value="tile"
        @update:value="changeTile"
        :options="list"
      >
      </NSelect>
    </NSpace>
    <div id="map"></div>
  </div>
</template>

<script lang="ts" setup>
import * as maptalks from "maptalks";
import moment from "moment";
import { onMounted, ref } from "vue";
import { NSelect, NSpace } from "naive-ui";

const udt = moment().format("YYYYMMDD");
console.log(udt);

const center = [112.85843755668577, 35.49174155526285];
// http://maponline{s}.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=20211208
// const tileUrl3 = `http://online{s}.map.bdimg.com/onlinelabel/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=${udt}`;
const tileUrl3 = `http://maponline{s}.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=20211208`;
const tileUrl2 = `https://gss{s}.bdstatic.com/8bo_dTSlRsgBo1vgoIiO_jowehsv/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=${udt}`;

const tile = ref<string>(tileUrl3);
const map = ref<maptalks.Map>();
const list = [
  {
    label: "百度地图2.0瓦片服务",
    value: tileUrl2,
  },
  {
    label: "百度地图3.0瓦片服务",
    value: tileUrl3,
  },
];
function changeTile(val: string) {
  const layer = new maptalks.TileLayer("base", {
    urlTemplate: val,
    subdomains: [0, 1, 2, 3],
    attribution:
      '&copy; <a target="_blank" href="http://map.baidu.com">Baidu</a>',
  });
  map.value!.setBaseLayer(layer);
}

onMounted(() => {
  map.value = new maptalks.Map("map", {
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
      projection: "baidu",
    },
    baseLayer: new maptalks.TileLayer("base", {
      urlTemplate: tile.value,
      subdomains: [0, 1, 2, 3],
      spatialReference: {
        projection: "BAIDU",
      },
      attribution:
        '&copy; <a target="_blank" href="http://map.baidu.com">Baidu</a>',
    }),
  });
});
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 100%;
}
#map {
  width: 100%;
  height: calc(100vh - 100px);
}
</style>
