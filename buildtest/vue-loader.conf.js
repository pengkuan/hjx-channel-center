var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'test'

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.test.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  }),
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
