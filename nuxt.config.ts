import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-01-15",
  devtools: { enabled: true },
  css: ["~/assets/styles/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  imports: {
    autoImport: true,
  },

  modules: ["@nuxt/image"],
});