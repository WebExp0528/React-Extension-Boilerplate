const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");

const {
    getHTMLPlugins,
    getOutput,
    getCopyPlugins,
    getZipPlugin,
    getEntry,
    getResolves,
    getDefinePlugins,
    getCleanWebpackPlugin,
    config,
    getExtensionManifestPlugin,
    getEslintPlugin,
} = require("./webpack.utils");

const NODE_ENV = "production";
const TARGET = process.env.TARGET;

const generalConfig = {
    mode: "production",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env", "@babel/preset-react"],
                        },
                    },
                ],
                exclude: /node_modules/,
                resolve: {
                    extensions: [".js", ".jsx"],
                },
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "sass-loader",
                    },
                ],
            },
        ],
    },
    resolve: getResolves(),
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
};

module.exports = [
    {
        ...generalConfig,
        entry: getEntry(config?.SRC_DIR ?? "src"),
        output: getOutput(TARGET, config?.TEMP_DIR ?? "tmp"),
        plugins: [
            ...getCleanWebpackPlugin(TARGET, config.TEMP_DIR, config.DIST_DIR),
            new webpack.ProgressPlugin(),
            ...getEslintPlugin(),
            ...getExtensionManifestPlugin(),
            ...getDefinePlugins({ NODE_ENV }),
            ...getHTMLPlugins(TARGET, config.TEMP_DIR, config.SRC_DIR),
            ...getCopyPlugins(TARGET, config.TEMP_DIR, config.SRC_DIR),
            ...getZipPlugin(TARGET, config.DIST_DIR),
        ],
    },
];
