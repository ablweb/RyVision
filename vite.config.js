import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        about: new URL('./about.html', import.meta.url).pathname,
        daily: new URL('./daily.html', import.meta.url).pathname,
        gamedev: new URL('./gamedev.html', import.meta.url).pathname,
        'privacy-policy': new URL('./privacy-policy.html', import.meta.url).pathname,
      },
    },
  },
});
