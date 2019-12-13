const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const {
  getHTMLPlugins,
  getOutput,
  getCopyPlugins,
  getZipPlugin,
  getFirefoxCopyPlugins,
  getEntry
} = require("./webpack.utils");
const config = require("./config.json");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const generalConfig = {
  mode: "production",
  module: {
    rules: [
      {
        loader: "babel-loader",
        exclude: /node_modules/,
        test: /\.(js|jsx)$/,
        query: {
          presets: ["@babel/preset-env", "@babel/preset-react"]
        },
        resolve: {
          extensions: [".js", ".jsx"]
        }
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["eslint-loader"]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      }
    ]
  }
};

module.exports = [
  {
    ...generalConfig,
    output: getOutput("chrome", config.tempDirectory),
    entry: getEntry(config.chromePath),
    plugins: [
      new CleanWebpackPlugin(["dist", "temp"]),
      new UglifyJsPlugin(),
      ...getHTMLPlugins("chrome", config.tempDirectory, config.chromePath),
      ...getCopyPlugins("chrome", config.tempDirectory, config.chromePath),
      getZipPlugin("chrome", config.distDirectory)
    ]
  },
  {
    ...generalConfig,
    output: getOutput("opera", config.tempDirectory),
    entry: getEntry(config.operaPath),
    plugins: [
      new CleanWebpackPlugin(["dist", "temp"]),
      new UglifyJsPlugin(),
      ...getHTMLPlugins("opera", config.tempDirectory, config.operaPath),
      ...getCopyPlugins("opera", config.tempDirectory, config.operaPath),
      getZipPlugin("opera", config.distDirectory)
    ]
  },
  {
    ...generalConfig,
    entry: getEntry(config.firefoxPath),
    output: getOutput("firefox", config.tempDirectory),
    plugins: [
      new CleanWebpackPlugin(["dist", "temp"]),
      new UglifyJsPlugin(),
      ...getHTMLPlugins("firefox", config.tempDirectory, config.firefoxPath),
      ...getFirefoxCopyPlugins(
        "firefox",
        config.tempDirectory,
        config.firefoxPath
      ),
      getZipPlugin("firefox", config.distDirectory)
    ]
  }
];
