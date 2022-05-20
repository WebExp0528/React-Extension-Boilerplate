import TerserPlugin from 'terser-webpack-plugin';

import {
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
    getProgressPlugins,
} from './webpack.config.utils';

const NODE_ENV = 'production';

const TARGET = process.env.TARGET ?? 'chrome';

const generalConfig = {
    mode: 'production',
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

export default [
    {
        ...generalConfig,
        entry: getEntry(config?.SRC_DIR ?? 'src'),
        output: getOutput(TARGET, config?.TEMP_DIR ?? 'tmp'),
        plugins: [
            ...getCleanWebpackPlugin(TARGET, config.TEMP_DIR, config.DIST_DIR),
            ...getProgressPlugins(),
            ...getEslintPlugin(),
            ...getExtensionManifestPlugin(),
            ...getDefinePlugins({ NODE_ENV }),
            ...getHTMLPlugins(TARGET, config.TEMP_DIR, config.SRC_DIR),
            ...getCopyPlugins(TARGET, config.TEMP_DIR, config.SRC_DIR),
            ...getZipPlugin(TARGET, config.DIST_DIR),
        ],
    },
];
