import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'
import axios from 'axios'
import pkg from './package'

const STORYBLOK_TOKEN = 'aIJuarUNgJGXTh7b5ZGDfAtt'

export default {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'msapplication-TileColor', content: '#000000' },
      { name: 'theme-color', content: '#ffffff' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      {
        rel: 'apple-touch-icon',
        size: '180x180',
        href: 'favicons/apple-touch-icon.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: 'favicons/favicon-32x32.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: 'favicons/favicon-16x16.png'
      },
      { rel: 'manifest', href: '/site.webmanifest' },
      {
        rel: 'mask-icon',
        href: 'favicons/safari-pinned-tab.svg',
        color: '#525252'
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: ['~/assets/style/app.styl', '~/assets/_variables.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/vuetify',
    '~/plugins/components',
    '~/plugins/filters',
    '~/plugins/breakpoints'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    [
      'storyblok-nuxt',
      { accessToken: STORYBLOK_TOKEN, cacheProvider: 'memory' }
    ],
    [
      'nuxt-fontawesome',
      {
        component: 'fa',
        imports: [
          {
            set: '@fortawesome/free-brands-svg-icons',
            icons: ['faInstagram', 'faFacebookSquare']
          }
        ]
      }
    ]
  ],

  /*
   ** Nuxt.js middleware
   */
  router: {
    middleware: 'languageDetection'
  },

  /*
   ** Nuxt.js page generation
   */
  generate: {
    routes: function(callback) {
      const token = STORYBLOK_TOKEN
      const version = 'published'
      let cacheVersion = 0
      const routes = ['/'] // adds / directly

      axios
        .get(`https://api.storyblok.com/v1/cdn/spaces/me?token=${token}`)
        .then(spaceRes => {
          cacheVersion = spaceRes.data.space.version
          axios
            .get(
              `https://api.storyblok.com/v1/cdn/links?token=${token}&version=${version}&cv=${cacheVersion}`
            )
            .then(res => {
              Object.keys(res.data.links).forEach(key => {
                if (!res.data.links[key].slug !== 'yhdistys') {
                  routes.push('/' + res.data.links[key].slug)
                }
              })
              callback(null, routes)
            })
        })
    }
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
