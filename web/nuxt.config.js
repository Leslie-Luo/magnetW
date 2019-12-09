module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: `${process.env.npm_package_productName} - ${process.env.npm_package_description} `,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { name: 'robots', content: 'noindex,nofollow,noarchive' },
      { name: 'format-detection', content: 'telephone=no,email=no,adress=no' },
      { 'http-equiv': 'window-target', content: '_top' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [],
  styleResources: {
    scss: '@/assets/css/app.scss'
  },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/app',
    '@/plugins/element-ui',
    '@/plugins/filter',
    '@/plugins/project',
    '@/plugins/localstorage',
    '@/plugins/localsetting'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/style-resources'
  ],
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
