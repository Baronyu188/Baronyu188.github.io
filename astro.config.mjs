// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://foeai.netlify.app',
  // base removed for root deployment on Netlify
  trailingSlash: 'always'
});
