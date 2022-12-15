<template>
  <div class="wrapper">
    <div id="map"></div>
    <div style="margin-top: 12px">
      <NSpace>
        <NButton @click="setBasicMarker" strong secondary type="primary"
          >Marker/Polyline/Polygon</NButton
        >
        <NButton @click="addGeoJSON" strong secondary type="primary"
          >简单的 GeoJSON</NButton
        >
        <NButton @click="addChoropleth" strong secondary type="primary"
          >choropleth(等值线)</NButton
        >
        <NButton @click="addD3Layer" strong secondary type="primary"
          >D3</NButton
        >
      </NSpace>
    </div>
  </div>
</template>

<script lang="ts" setup>
import L from "leaflet";
import "leaflet.chinatmsproviders";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { NButton, NSpace } from "naive-ui";
import "proj4";
import "proj4leaflet";
import { onMounted, onUnmounted } from "vue";
import { MAPBOX_TOKEN } from "./constant";
import { setBasicMarker } from "./demos/basic";
import { addChoropleth } from "./demos/choropleth";
import { addGeoJSON } from "./demos/geoJSON";
import { addD3Layer } from "./demos/with-d3";
import { useMap } from "./useMap";

// https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-48340269kjk9
delete (L.Icon as any).Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

function initMap() {
  const [map, setMap] = useMap();

  if (!map.value) {
    setMap(L.map("map").setView([51.508, -0.11], 13));

    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: MAPBOX_TOKEN,
      }
    ).addTo(map.value!);
  }
  return map;
}

onUnmounted(() => {
  // Because map is not inside this component, when this comp unmounts, the map
  // object is still in memory, thus needs to clean it
  const [, setMap] = useMap();
  setMap();
});

onMounted(() => {
  initMap();
  const [map, setMap] = useMap();
  map.value!.on("viewreset", () => {
    console.log("resset viwer");
  });

  setBasicMarker();
});
</script>

<style lang="css" scoped>
#map {
  height: calc(100vh - 100px);
}
</style>

<style>
.info {
  padding: 6px 8px;
  font: 14px/16px Arial, Helvetica, sans-serif;
  background: white;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}
.info h4 {
  margin: 0 0 5px;
  color: #777;
}

.legend {
  line-height: 18px;
  color: #555;
}
.legend i {
  width: 18px;
  height: 18px;
  float: left;
  margin-right: 8px;
  opacity: 0.7;
}
/* // for the d3 */
svg {
  position: relative;
}
path {
  fill: yellow;
  stroke-width: 2px;
  stroke: red;
  stroke-opacity: 1;
}
.travelMarker {
  fill: yellow;
  opacity: 0.75;
}
.waypoints {
  fill: black;
  opacity: 0;
}

.drinks {
  stroke: black;
  fill: red;
}
.lineConnect {
  fill: none;
  stroke: black;
  opacity: 1;
}
.locnames {
  fill: black;
  text-shadow: 1px 1px 1px #fff, 3px 3px 5px #000;
  font-weight: bold;
  font-size: 13px;
}
</style>
