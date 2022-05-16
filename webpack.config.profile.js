const ESLintPlugin = require('eslint-webpack-plugin');
const {
    getHTMLPlugins,
    getOutput,
    getCopyPlugins,
    getEntry,
    getResolves,
    getDefinePlugins,
    getCleanWebpackPlugin,
    getAnalyzerPlugin,
    config,
} = require('./webpack.utils');
const webpack = require('webpack');

const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');
const baseManifest = require('./src/baseManifest.json');

const NODE_ENV = 'development';
const TARGET = process.env.TARGET;

const generalConfig = {
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                use: [
                    {
                        loader: 'ts-loader',
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
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'sass-loader',
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
};

const eslintOptions = {
    fix: true,
};

module.exports = [
    {
        ...generalConfig,
        entry: getEntry(config.SRC_DIR),
        output: getOutput(TARGET, config.DEV_DIR),
        plugins: [
            ...getCleanWebpackPlugin(TARGET, config.DEV_DIR),
            new webpack.ProgressPlugin(),
            new ESLintPlugin(eslintOptions),
            ...getDefinePlugins({ NODE_ENV }),
            ...getHTMLPlugins(TARGET, config.DEV_DIR, config.SRC_DIR),
            ...getCopyPlugins(TARGET, config.DEV_DIR, config.SRC_DIR),
            new WebpackExtensionManifestPlugin({
                config: { base: baseManifest },
            }),
            ...getAnalyzerPlugin(),
        ],
    },
];
