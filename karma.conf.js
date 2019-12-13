module.exports = function(config) {
  config.set({
    browsers: ["Chrome"], // run in Chrome
    singleRun: true, // just run once by default
    frameworks: ["mocha"], // use the mocha test framework
    files: [{ pattern: "webpack.tests.js", watched: false }],
    preprocessors: {
      "webpack.tests.js": ["webpack", "sourcemap"]
    },
    reporters: ["dots"], // report results in this format
    webpack: {
      // kind of a copy of your webpack config
      devtool: "inline-source-map", // just do inline source maps instead of the default
      mode: "development",
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
    },
    plugins: [
      require("karma-mocha"),
      require("karma-webpack"),
      require("karma-sourcemap-loader"),
      require("karma-chrome-launcher")
    ]
  });
};
