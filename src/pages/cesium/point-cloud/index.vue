<template>
  <div id="cesiumContainer" class="h-[calc(100vh-80px)]"></div>
</template>

<script setup lang="ts">
import * as Cesium from "cesium";
import { onMounted } from "vue";

onMounted(() => {
  var viewer = new Cesium.Viewer("cesiumContainer", {
    terrainProvider: Cesium.createWorldTerrain(),
    animation: false,
  });

  // A ~10 billion point 3D Tileset of the city of Montreal, Canada captured in 2015 with a resolution of 20 cm. Tiled and hosted by Cesium ion.
  var pointCloudTileset = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(1421836),
      pointCloudShading: {
        attenuation: true,
        maximumAttenuation: 2,
      },
    })
  );

  // Fly to the Biosphere Museum
  viewer.camera.setView({
    destination: new Cesium.Cartesian3(
      1269319.8408991008,
      -4293301.826913256,
      4527724.561372451
    ),
    orientation: {
      direction: new Cesium.Cartesian3(
        -0.742505030107832,
        -0.3413204607149223,
        -0.5763563336703441
      ),
      up: new Cesium.Cartesian3(
        -0.04655102331027917,
        -0.8320643756800384,
        0.5527222421370013
      ),
    },
    easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
  });

  pointCloudTileset.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ["${Classification} === 2", "color('brown')"], // ground
        ["${Classification} === 3", "color('greenyellow')"], // low vegetation
        ["${Classification} === 4", "color('green')"], // medium vegetation
        ["${Classification} === 5", "color('darkgreen')"], // high vegetation
        ["true", "color('white')"],
      ],
    },
  });
});
</script>
