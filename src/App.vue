<script setup lang="ts"></script>

<template>
  <div class="page">
    <div class="link-wrapper">
      <router-link to="/maptalk">maptalk</router-link>
      <router-link to="/leaflet">leaflet</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.link-wrapper {
  margin-bottom: 24px;
}
</style>
