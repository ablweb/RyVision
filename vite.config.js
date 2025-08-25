import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        page2: new URL('./about.html', import.meta.url).pathname,
        page3: new URL('./daily.html', import.meta.url).pathname,
      },
    },
  },
});
