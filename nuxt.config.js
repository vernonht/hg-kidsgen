import pkg from './package'

export default {
  mode: 'spa',
  server: {
      port: 8000,
      host: '0.0.0.0'
  },
  /*
  ** Headers of the page
  */
  head: {
      title: pkg.name,
      meta: [
          { charset: 'utf-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          { hid: 'description', name: 'description', content: pkg.description },
          { hid: 'og:image', property: 'og:image', content: '/kidsgen_logo.png' }
      ],
      link: [
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      script: [
          { src: 'https://code.jquery.com/jquery-3.4.1.min.js' }
      ],
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/tailwind.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios',
    '~/plugins/moment',
    '~/plugins/ant',
    '~/plugins/quagga',
    '~/plugins/qrcode',
    '~/plugins/cropper',
    '~/plugins/lodash'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
