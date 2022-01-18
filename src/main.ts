import { createApp } from 'vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import App from './App.vue'
import { routes } from './router'


createApp(App).use(createRouter({
  routes: routes,
  history: createWebHistory()
})).mount('#app')
