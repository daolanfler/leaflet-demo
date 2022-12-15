import { RouteRecordRaw } from "vue-router";
import QuickStart from "./quickstart/index.vue";
import Building from "./building/index.vue";
import TilesAndStyle from "./3d-tiles/index.vue";
import PointCloud from "./point-cloud/index.vue";
import TubePage from "./tube/index.vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/cesium",
    component: () => import("./index.vue"),
    redirect: {
        path: '/cesium/quickstart'
    },
    children: [
      {
        path: "quickstart",
        component: QuickStart,
      },
      {
        path: "building",
        component: Building,
      },
      {
        path: "tiles-and-style",
        component: TilesAndStyle,
      },
      {
        path: "style-point-cloud",
        component: PointCloud,
      },
      {
        path: "tube",
        component: TubePage,
      },
    ],
  },
];
