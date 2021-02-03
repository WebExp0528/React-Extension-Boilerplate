const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const {
    getHTMLPlugins,
    getOutput,
    getCopyPlugins,
    getZipPlugin,
    getFirefoxCopyPlugins,
    getEntry,
    getResolves,
} = require("./webpack.utils");
const config = require("./config.json");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

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
                            presets: [
                                "@babel/preset-env",
                                "@babel/preset-react",
                            ],
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
                test: /\.js(\?.*)?$/i,
            }),
        ],
    },
};

const eslintOptions = {
    fix: true,
};

module.exports = [
    {
        ...generalConfig,
        output: getOutput("chrome", config.tempDirectory),
        entry: getEntry(config.chromePath),
        plugins: [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ["dist", "temp"],
            }),
            new ESLintPlugin(eslintOptions),
            ...getHTMLPlugins(
                "chrome",
                config.tempDirectory,
                config.chromePath
            ),
            ...getCopyPlugins(
                "chrome",
                config.tempDirectory,
                config.chromePath
            ),
            getZipPlugin("chrome", config.distDirectory),
        ],
    },
    {
        ...generalConfig,
        output: getOutput("opera", config.tempDirectory),
        entry: getEntry(config.operaPath),
        plugins: [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ["dist", "temp"],
            }),
            new ESLintPlugin(eslintOptions),
            ...getHTMLPlugins("opera", config.tempDirectory, config.operaPath),
            ...getCopyPlugins("opera", config.tempDirectory, config.operaPath),
            getZipPlugin("opera", config.distDirectory),
        ],
    },
    {
        ...generalConfig,
        entry: getEntry(config.firefoxPath),
        output: getOutput("firefox", config.tempDirectory),
        plugins: [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ["dist", "temp"],
            }),
            new ESLintPlugin(eslintOptions),
            ...getHTMLPlugins(
                "firefox",
                config.tempDirectory,
                config.firefoxPath
            ),
            ...getFirefoxCopyPlugins(
                "firefox",
                config.tempDirectory,
                config.firefoxPath
            ),
            getZipPlugin("firefox", config.distDirectory),
        ],
    },
];
