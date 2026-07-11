import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://insure-pages.vercel.app",
  integrations: [sitemap()],
});
