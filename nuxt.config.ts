// Nuxt config file
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  modules: ["vuetify-nuxt-module", "@vite-pwa/nuxt"],

  imports: {
    presets: [
      {
        from: "vue-i18n",
        imports: ["useI18n"],
      },
      {
        from: "vuetify",
        imports: ["useDisplay"],
      },
      {
        from: "firebase/database",
        imports: [
          "onValue",
          "set",
          "update",
          "push",
          ["ref", "dbRef"],
          "DataSnapshot",
        ],
      },
      {
        from: "firebase/storage",
        imports: ["getDownloadURL", "uploadBytes", ["ref", "sRef"]],
      },
      {
        from: "firebase/auth",
        imports: ["getAuth"],
      },
    ],
  },

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },

  compatibilityDate: "2024-07-04",

  pwa: {
    manifest: {
      name: "찾아줄게! 너의 동아리",
      short_name: "찾동!",
      description: "판교고 학생들을 위한 동아리 정보 제공 플랫폼",
      lang: "ko",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
      orientation: "portrait",
      scope: "/",
      start_url: "/",
      dir: "ltr",
      icons: [
        {
          src: "/icon.png",
          sizes: "998x998",
          type: "image/png",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },
});