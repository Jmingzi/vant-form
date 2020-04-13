const externals = process.env.VUE_APP_DIST ? {
  vue: 'Vue',
  'element-ui': 'ELEMENT',
  '@vue/composition-api': 'vueCompositionApi',
  vant: 'vant'
} : {
  vue: {
    commonjs: 'Vue',
    commonjs2: 'Vue',
    root: 'Vue'
  },
  vant: {
    commonjs: 'vant',
    commonjs2: 'vant',
    root: 'vant'
  },
  'element-ui': {
    commonjs: 'ELEMENT',
    commonjs2: 'ELEMENT',
    root: 'ELEMENT'
  },
  '@vue/composition-api': {
    commonjs: 'vueCompositionApi',
    commonjs2: 'vueCompositionApi',
    root: 'vueCompositionApi'
  }
}

module.exports = {
  publicPath: './',
  outputDir: process.env.VUE_APP_DIST || 'dist',
  configureWebpack: config => {
    config.externals = externals
  }
}
