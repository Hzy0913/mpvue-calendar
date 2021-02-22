const path = require("path");

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/mpvue-calendar/' : '/',
  configureWebpack: {
    context: path.resolve(__dirname, './'),
    entry: {
      app: process.env.NODE_ENV === 'production' ? './src/mpvue-calendar.vue' : './example/main.js'
    },
  },
  css: {
    extract: false
  },
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV !== 'production'
}
