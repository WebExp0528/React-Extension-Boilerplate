const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');

const baseManifest = require('./src/baseManifest.json');

const envConfig = dotenv.parsed ?? {
    DEV_DIR: 'dev',
    DIST_DIR: 'dist',
    TEMP_DIR: 'temp',
    SRC_DIR: 'src',
};

const getHTMLPlugins = (browserDir, outputDir = 'dev', sourceDir = 'src') => [
    new HtmlWebpackPlugin({
        title: 'Popup',
        filename: path.resolve(__dirname, `${outputDir}/${browserDir}/popup/index.html`),
        template: `${sourceDir}/popup/index.html`,
        chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
        title: 'Options',
        filename: path.resolve(__dirname, `${outputDir}/${browserDir}/options/index.html`),
        template: `${sourceDir}/options/index.html`,
        chunks: ['options'],
    }),
];

const getDefinePlugins = (config = {}) => [
    new webpack.DefinePlugin({
        'process.env': JSON.stringify({ ...config, ...envConfig }),
    }),
];

const getOutput = (browserDir, outputDir = 'dev') => {
    return {
        path: path.resolve(process.cwd(), `${outputDir}/${browserDir}`),
        filename: '[name]/[name].js',
    };
};

const getEntry = (sourceDir = 'src') => {
    return {
        popup: [path.resolve(__dirname, `${sourceDir}/popup/index.tsx`)],
        options: [path.resolve(__dirname, `${sourceDir}/options/options.tsx`)],
        content: [path.resolve(__dirname, `${sourceDir}/content/index.tsx`)],
        background: [path.resolve(__dirname, `${sourceDir}/background/index.ts`)],
    };
};

const getCopyPlugins = (browserDir, outputDir = 'dev', sourceDir = 'src') => [
    new CopyWebpackPlugin({
        patterns: [
            {
                from: `${sourceDir}/assets`,
                to: path.resolve(__dirname, `${outputDir}/${browserDir}/assets`),
            },
            {
                from: `${sourceDir}/_locales`,
                to: path.resolve(__dirname, `${outputDir}/${browserDir}/_locales`),
            },
        ],
    }),
];

const getZipPlugin = (browserDir, outputDir = 'dist') => {
    return [
        new ZipPlugin({
            path: path.resolve(__dirname, `${outputDir}/${browserDir}`),
            filename: browserDir,
            extension: 'zip',
            fileOptions: {
                mtime: new Date(),
                mode: 0o100664,
                compress: true,
                forceZip64Format: false,
            },
            zipOptions: {
                forceZip64Format: false,
            },
        }),
    ];
};

const getAnalyzerPlugin = () => {
    return [
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
        }),
    ];
};

const getCleanWebpackPlugin = (browserDir, ...dirs) => {
    return [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                ...(dirs ? dirs.map((dir) => path.join(process.cwd(), `${dir}/${browserDir}`)) : ['dist', 'temp']),
            ],
            cleanStaleWebpackAssets: false,
            verbose: true,
        }),
    ];
};

const getResolves = () => {
    return {
        alias: {
            utils: path.resolve(__dirname, './src/utils/'),
            popup: path.resolve(__dirname, './src/popup/'),
            background: path.resolve(__dirname, './src/background/'),
            options: path.resolve(__dirname, './src/options/'),
            content: path.resolve(__dirname, './src/content/'),
            assets: path.resolve(__dirname, './src/assets/'),
            components: path.resolve(__dirname, './src/components/'),
            types: path.resolve(__dirname, './src/types/'),
            hooks: path.resolve(__dirname, './src/hooks/'),
            '@redux': path.resolve(__dirname, './src/@redux/'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    };
};

const getExtensionManifestPlugin = () => {
    return [
        new WebpackExtensionManifestPlugin({
            config: { base: baseManifest },
        }),
    ];
};

const eslintOptions = {
    fix: true,
};

const getEslintPlugin = () => {
    return [new ESLintPlugin(eslintOptions)];
};

module.exports = {
    getHTMLPlugins,
    getOutput,
    getCopyPlugins,
    getZipPlugin,
    getEntry,
    getResolves,
    getDefinePlugins,
    getAnalyzerPlugin,
    getCleanWebpackPlugin,
    getExtensionManifestPlugin,
    getEslintPlugin,
    config: envConfig,
};
