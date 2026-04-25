export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  nitro: {
    preset: 'netlify'
  },
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Dudung News — Berita Terkini',
      meta: [
        { name: 'description', content: 'Portal berita modern milik Dudung' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap',
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: 'https://api.npoint.io/749e4cc46af7d03db38a',
    },
  },
})