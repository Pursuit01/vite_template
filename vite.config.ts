import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import path from "path";
import { viteMockServe } from "vite-plugin-mock";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import ElementPlus from 'unplugin-element-plus/vite'
// https://vitejs.dev/config/

export default defineConfig(() => {
  return {
    plugins: [
      vue(),
      ElementPlus({
        useSource: true,
      }),
      viteMockServe({
        // default
        mockPath: "mock",
        enable: true,
      }),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), "src/icons")],
        // Specify symbolId format
        symbolId: "icon-[dir]-[name]",
        // inject?: 'body-last' | 'body-first'
        // customDomId: '__svg__icons__dom__',
      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        imports: ["vue", "vue-router"],
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {},
        scss: {
          additionalData: `@use "@/style/modules/index.scss";`
        }
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
