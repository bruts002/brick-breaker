const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const mode = process.env.NODE_ENV || "development";
const isProd = mode === "production";
const paths = require('./config/paths')

const srcPath = subdir => path.join(__dirname, "src", subdir)

const config = {
  mode,
  devtool: isProd ? "hidden-source-map" : "source-map",
  context: path.resolve("./src"),
  entry: {
    app: "./index.tsx"
  },
  output: {
    path: paths.appBuild,
    filename: "[name].bundle.js",
    sourceMapFilename: "[name].bundle.map",
    devtoolModuleFilenameTemplate: info => `file:///${info.absoluteResourcePath}`
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: ["awesome-typescript-loader", "source-map-loader"]
      },
      { test: /\.html$/, loader: "html-loader" },
      { test: /\.css$/, loaders: ["style-loader", "css-loader"] },
      {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          loader: 'file?name=public/fonts/[name].[ext]'
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      App: srcPath('App'),
      util: srcPath('util'),
      biblioteca: srcPath('biblioteca'),
      micro: srcPath('micro')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(mode)
      }
    }),
    new HtmlWebpackPlugin({
      title: "Brick Breaker | Capture the Flag",
      description: "Brick Breaker JavaScript game",
      template: "!!ejs-loader!static/index.html"
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        tslint: {
          emitErrors: true,
          failOnHint: true
        }
      }
    })
  ],
  devServer: {
    compress: true,
    port: 3002,
    // hot: true
  }
};

module.exports = config;
