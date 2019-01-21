process.env.NODE_ENV = 'production'
const { emptyDirSync, copySync } = require('fs-extra')
const webpack = require('webpack')
const config = require('../webpack.config')
const paths = require('../config/paths')

// clear out old build
emptyDirSync(paths.appBuild)

// copy static to build
copySync(paths.appStatic, paths.appBuild, {
  dereference: true,
  filter: file => file !== paths.appHtml
})

// build
webpack(config).run((err, stats) => {
  // TODO: stuff?
})


