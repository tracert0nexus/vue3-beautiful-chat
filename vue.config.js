ifProd = () => process.env.NODE_ENV === 'production'

module.exports = {
  lintOnSave: false,
  productionSourceMap: ifProd(),
  chainWebpack: (config) => {
    // Inline images & svgs into build
    config.module
      .rule('images')
      .use('url-loader')
      .options({
        limit: 4096 * 3
      })
    config.module
      .rule('svg')
      .use('file-loader')
      .loader('url-loader')
      .options({
        limit: 4096 * 3
      })
  },

  css: {
    extract: false
  },

  pages: {
    demo: {
      entry: 'demo/src/main.js',
      template: 'demo/public/mockup.html',
      filename: 'index.html'
    }
  }
}
