const { resolve } = require('path')
const { realpathSync } = require('fs')

const appDirectory = realpathSync(process.cwd())
const resolveApp = relativePath => resolve(appDirectory, relativePath)

module.exports = {
  appBuild: resolveApp('build'),
  appStatic: resolveApp('static'),
  appHtml: resolveApp('static/index.html'),
  appIndexJs: resolveApp('src/index.js')
}
