const path = require("path");

module.exports = {
  configureWebpack: {
    context: path.resolve(__dirname, './'),
    entry: {
      app: './example/main.js'
    },
  },
  lintOnSave: process.env.NODE_ENV !== 'production'
}
