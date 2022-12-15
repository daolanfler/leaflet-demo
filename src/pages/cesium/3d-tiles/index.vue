<template>
  <div id="cesiumContainer" class="h-[calc(100vh-80px)]"></div>
  <div id="toolbar">
    <select class="cesium-button" id="dropdown">
      <option value="0">Apply Basic Style</option>
      <option value="1">Show Features Based on Property</option>
      <option value="2">Color Features with Conditions</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import * as Cesium from "cesium";
import { onMounted } from "vue";

onMounted(() => {
  var viewer = new Cesium.Viewer("cesiumContainer", {
    terrainProvider: Cesium.createWorldTerrain(),
    animation: false,
  });

  // Adjust the camera to look at Melbourne
  viewer.camera.lookAt(
    new Cesium.Cartesian3.fromDegrees(144.96007, -37.82249),
    new Cesium.Cartesian3(0.0, -1500.0, 1200.0)
  );

  // Add OSM Building tileset
  var osmBuildingsTileset = Cesium.createOsmBuildings();
  viewer.scene.primitives.add(osmBuildingsTileset);

  // Applying a basic style
  function applyBasicStyle() {
    osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle({
      color: {
        conditions: [
          ["${name} === 'Crown Entertainment Complex'", "color('red')"],
          ["true", "color('white')"],
        ],
      },
    });
  }

  // Show features based on property
  function showFeaturesWithProperty() {
    osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle({
      show: "${feature['building']} === 'residential' || ${feature['building']} === 'apartments'",
    });
  }

  // Color features with conditions
  function colorFeaturesWithConditions() {
    osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle({
      defines: {
        distance:
          "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(144.96007, -37.82249))",
      },
      color: {
        conditions: [
          ["${distance} > 0.010", "color('#d65c5c')"],
          ["${distance} > 0.006", "color('#f58971')"],
          ["${distance} > 0.002", "color('#f5af71')"],
          ["${distance} > 0.0001", "color('#f5ec71')"],
          ["true", "color('#ffffff')"],
        ],
      },
    });
  }

  var menu = document.getElementById("dropdown");

  menu.options[0].onselect = function () {
    applyBasicStyle();
  };

  menu.options[1].onselect = function () {
    showFeaturesWithProperty();
  };

  menu.options[2].onselect = function () {
    colorFeaturesWithConditions();
  };

  menu.onchange = function () {
    var item = menu.options[menu.selectedIndex];
    if (item && typeof item.onselect === "function") {
      item.onselect();
    }
  };

  applyBasicStyle();
});
</script>

<style>

#toolbar {
  position: absolute;
  z-index: 1;
  top: 20px;
  left: 20px;
}

.infoPanel {
  background: rgba(42, 42, 42, 0.8);
  padding: 4px;
  border: 1px solid #444;
  border-radius: 4px;
}
</style>
