<template>
  <div class="flex h-full w-full px-4">
    <aside class="w-max flex flex-col text-lg pr-4">
      <router-link :to="{ path: 'quickstart' }" class="text-gray-600"
        >Quickstart</router-link
      >
      <router-link :to="{ path: 'building' }" class="text-gray-600"
        >Building</router-link
      >
      <router-link :to="{ path: 'tiles-and-style' }" class="text-gray-600"
        >Style and Filter 3D Tiles</router-link
      >
      <router-link :to="{ path: 'style-point-cloud' }" class="text-gray-600"
        >Style Point Cloud</router-link
      >
      <router-link :to="{ path: 'tube' }" class="text-gray-600"
        >Tube</router-link
      >
    </aside>
    <div class="relative">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as Cesium from "cesium";
import { TOKEN } from "./util";
import "cesium/Build/Cesium/Widgets/widgets.css";

Cesium.Ion.defaultAccessToken = TOKEN;

// @ts-ignore
window.CESIUM_BASE_URL = "/cesium";
</script>
