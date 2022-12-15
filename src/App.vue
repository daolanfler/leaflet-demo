<script setup lang="ts">
</script>

<template>
  <div class="page">
    <div  class="text-xl py-2 flex justify-center">
      <router-link to="/leaflet" class="mr-4">Leaflet</router-link>
      <router-link to="/maptalk" class="mr-4" >Maptalk</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.router-link-active {
  @apply text-blue-500;
}
</style>
