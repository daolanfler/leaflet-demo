<template>
  <div id="cesiumContainer" class="h-[calc(100vh-80px)]"></div>
  <button id="toggle-building" @click="toggleBuilding">Toggle new building</button>
</template>

<script setup lang="ts">
import * as Cesium from "cesium";
import { onMounted, ref } from "vue";

const newBuilding = ref<any>();

onMounted(() => {
  // Initialize the viewer with Cesium World Terrain.
  const viewer = new Cesium.Viewer("cesiumContainer", {
    terrainProvider: Cesium.createWorldTerrain(),
  });
  // Add Cesium OSM Buildings.
  const buildingsTileset = viewer.scene.primitives.add(
    Cesium.createOsmBuildings()
  );
  // Fly the camera to Denver, Colorado at the given longitude, latitude, and height.
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(-104.9965, 39.74248, 4000),
  });

  // 1420741
  // STEP 3 CODE
  async function addBuildingGeoJSON() {
    // Load the GeoJSON file from Cesium ion.
    const geoJSONURL = await Cesium.IonResource.fromAssetId(1420741);
    // Create the geometry from the GeoJSON, and clamp it to the ground.
    const geoJSON = await Cesium.GeoJsonDataSource.load(geoJSONURL, {
      clampToGround: true,
    });
    // Add it to the scene.
    const dataSource = await viewer.dataSources.add(geoJSON);
    // By default, polygons in CesiumJS will be draped over all 3D content in the scene.
    // Modify the polygons so that this draping only applies to the terrain, not 3D buildings.
    for (const entity of dataSource.entities.values) {
      // @ts-ignore
      entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN;
    }
    // Move the camera so that the polygon is in view.
    viewer.flyTo(dataSource);
  }

  addBuildingGeoJSON();

  // STEP 4 CODE
  // Hide individual buildings in this area using 3D Tiles Styling language.
  buildingsTileset.style = new Cesium.Cesium3DTileStyle({
    // Create a style rule to control each building's "show" property.
    show: {
      conditions: [
        // Any building that has this elementId will have `show = false`.
        ["${elementId} === 332469316", false],
        ["${elementId} === 332469317", false],
        ["${elementId} === 235368665", false],
        ["${elementId} === 530288180", false],
        ["${elementId} === 530288179", false],
        ["${elementId} === 532245203", false],
        // If a building does not have one of these elementIds, set `show = true`.
        [true, true],
      ],
    },
    // Set the default color style for this particular 3D Tileset.
    // For any building that has a `cesium#color` property, use that color, otherwise make it white.
    color:
      "Boolean(${feature['cesium#color']}) ? color(${feature['cesium#color']}) : color('#ffffff')",
  });

  // STEP 6 CODE
  // Add the 3D Tileset you created from your Cesium ion account.
  const newBuildingTileset = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(1420754),
    })
  );
  // Move the camera to the new building.
  viewer.flyTo(newBuildingTileset);

  newBuilding.value = newBuildingTileset
});

function toggleBuilding() {
  newBuilding.value!.show = !newBuilding.value!.show
}

</script>

<style>
#toggle-building {
  z-index: 1;
  position: absolute;
  top: 20px;
  left: 20px;
  color: #fff;
  @apply bg-blue-700 px-4;

}
</style>
