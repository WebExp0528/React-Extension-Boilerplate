const webpack = require("webpack");
const ExtReloader = require("webpack-ext-reloader");

const {
    getHTMLPlugins,
    getOutput,
    getCopyPlugins,
    getEntry,
    getResolves,
    getDefinePlugins,
    getCleanWebpackPlugin,
    config,
    getExtensionManifestPlugin,
    getEslintPlugin,
} = require("./webpack.utils");

const NODE_ENV = "development";
const TARGET = process.env.TARGET;

const generalConfig = {
    mode: "development",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                use: [
                    {
                        loader: "ts-loader",
                        // options: {
                        //     transpileOnly: true,
                        // },
                    },
                ],
                exclude: /node_modules/,
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
    stats: {
        all: false,
        builtAt: true,
        errors: true,
        hash: true,
    },
    watch: true,
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000,
    },
};

module.exports = [
    {
        ...generalConfig,
        entry: getEntry(config?.SRC_DIR ?? "src"),
        output: getOutput(TARGET, config?.DEV_DIR ?? "dev"),
        plugins: [
            ...getCleanWebpackPlugin(TARGET, config?.DEV_DIR ?? "dev"),
            new webpack.ProgressPlugin(),
            ...getEslintPlugin(),
            ...getDefinePlugins({ NODE_ENV }),
            ...getHTMLPlugins(TARGET, config.DEV_DIR, config?.SRC_DIR ?? "src"),
            ...getCopyPlugins(TARGET, config.DEV_DIR, config?.SRC_DIR ?? "src"),
            ...getExtensionManifestPlugin(),
            new ExtReloader({
                port: 9090,
                reloadPage: true,
                entries: {
                    contentScript: ["content"],
                    background: "background",
                    extensionPage: ["popup", "options"],
                },
            }),
        ],
    },
];
