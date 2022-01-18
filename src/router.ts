import { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/maptalks",
    component: () => import('./pages/maptalk/index.vue'),
  },
  {
    path: "/leaflet",
    component: () => import('./pages/leaflet/index.vue')
  }
];
