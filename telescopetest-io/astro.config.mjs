// // @ts-check
// import { defineConfig } from 'astro/config';

// import cloudflare from '@astrojs/cloudflare';

// // https://astro.build/config
// export default defineConfig({
//   adapter: cloudflare()
// });

// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    mode: 'advanced',
    functionPerRoute: false,
  }),
  output: 'server',
  vite: {
    ssr: {
      external: [],
    }
  }
});