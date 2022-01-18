import { createApp } from 'vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import App from './App.vue'
import { routes } from './router'
import 'virtual:windi.css'

createApp(App).use(createRouter({
  routes: routes,
  history: createWebHashHistory()
})).mount('#app')
