import ESLintPlugin from 'eslint-webpack-plugin';
import {
    getHTMLPlugins,
    getOutput,
    getCopyPlugins,
    getEntry,
    getResolves,
    getDefinePlugins,
    getCleanWebpackPlugin,
    getAnalyzerPlugin,
    config,
    getExtensionManifestPlugin,
} from './webpack.config.utils';
import webpack from 'webpack';

const NODE_ENV = 'development';

const TARGET = process.env.TARGET ?? 'chrome';

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

export default [
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
            ...getExtensionManifestPlugin(),
            ...getAnalyzerPlugin(),
        ],
    },
];
