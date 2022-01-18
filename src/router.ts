import { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: { path: "/leaflet" },
  },
  {
    path: "/maptalk",
    component: () => import("./pages/maptalk/index.vue"),
  },
  {
    path: "/leaflet",
    component: () => import("./pages/leaflet/index.vue"),
  },
];
