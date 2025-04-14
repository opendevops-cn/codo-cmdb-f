const path = require("path")
// @ts-ignore
// eslint-disable-next-line import/extensions
const { name } = require("./package")

function resolve(dir) {
  return path.join(__dirname, dir)
}

const port = 8082 // dev port
// const BASE_URL = process.env.NODE_ENV === 'production' ? '/' : '/'

module.exports = {
  lintOnSave: false,
  outputDir: "dist",
  assetsDir: "static",
  filenameHashing: true,
  publicPath: `/web/${process.env.VUE_APP_CODE}/`,
  // publicPath: BASE_URL,
  runtimeCompiler: true,
  crossorigin: "",
  devServer: {
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    proxy: {
      "/api/v2/cmdb": {
        target: "http://10.60.16.18:8899",
        changeOrigin: true,
        // headers: { Authorization: "" },
      },
    },
  },
  // 自定义webpack配置
  configureWebpack: {
    externals: /\.(md)$/,
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: "umd",
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },

  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin("preload").tap(() => [
      {
        rel: "preload",
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: "initial",
      },
    ])

    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      //
      config.module.rule('fonts').use('url-loader').loader('url-loader').options({}).end();
      config.module.rule('images').use('url-loader').loader('url-loader').options({}).end();

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete("prefetch")

    // set svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/icons")).end()
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end()
  },
}
