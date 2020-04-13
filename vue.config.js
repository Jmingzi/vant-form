module.exports = {
  publicPath: './',
  outputDir: process.env.VUE_APP_DIST || 'dist',
  configureWebpack: config => {
    config.externals = {
      vue: 'Vue',
      'element-ui': 'ELEMENT',
      '@vue/composition-api': 'vueCompositionApi',
      vant: 'vant'
    }
  }
}
