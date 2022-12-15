import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteStaticCopy } from "vite-plugin-static-copy";
import WindiCSS from "vite-plugin-windicss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/cesium/Build/Cesium/Workers/**/*",
          dest: "cesium/Workers",
        },
        {
          src: "node_modules/cesium/Build/Cesium/ThirdParty/**/*",
          dest: "cesium/ThirdParty",
        },
        {
          src: "node_modules/cesium/Build/Cesium/Assets/**/*",
          dest: "cesium/Assets",
        },
        {
          src: "node_modules/cesium/Build/Cesium/Widgets/**/*",
          dest: "cesium/Widgets",
        },
      ],
    }),
  ],
});
