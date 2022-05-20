import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ZipPlugin from 'zip-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import WebpackExtensionManifestPlugin from 'webpack-extension-manifest-plugin';

const baseManifest = require('../src/baseManifest.json');

const dotenv = require('dotenv').config({ path: __dirname + '/.env' });

/**
 * Environment Config
 *
 */
const envConfig = dotenv.parsed ?? {
    DEV_DIR: 'dev',
    DIST_DIR: 'dist',
    TEMP_DIR: 'temp',
    SRC_DIR: 'src',
};

/**
 * Get HTML Plugins
 *
 * @param browserDir
 * @param outputDir
 * @param sourceDir
 * @returns
 */
export const getHTMLPlugins = (browserDir: string, outputDir = 'dev', sourceDir = 'src') => [
    new HtmlWebpackPlugin({
        title: 'Popup',
        filename: path.resolve(__dirname, `../${outputDir}/${browserDir}/popup/index.html`),
        template: `${sourceDir}/popup/index.html`,
        chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
        title: 'Options',
        filename: path.resolve(__dirname, `../${outputDir}/${browserDir}/options/index.html`),
        template: `${sourceDir}/options/index.html`,
        chunks: ['options'],
    }),
];

/**
 * Get DefinePlugins
 *
 * @param config
 * @returns
 */
export const getDefinePlugins = (config = {}) => [
    new webpack.DefinePlugin({
        'process.env': JSON.stringify({ ...config, ...envConfig }),
    }),
];

/**
 * Get Output Configurations
 *
 * @param browserDir
 * @param outputDir
 * @returns
 */
export const getOutput = (browserDir: string, outputDir = 'dev') => {
    return {
        path: path.resolve(process.cwd(), `../${outputDir}/${browserDir}`),
        filename: '[name]/[name].js',
    };
};

/**
 * Get Entry Points
 *
 * @param sourceDir
 * @returns
 */
export const getEntry = (sourceDir = 'src') => {
    return {
        popup: [path.resolve(__dirname, `../${sourceDir}/popup/index.tsx`)],
        options: [path.resolve(__dirname, `../${sourceDir}/options/options.tsx`)],
        content: [path.resolve(__dirname, `../${sourceDir}/content/index.tsx`)],
        background: [path.resolve(__dirname, `../${sourceDir}/background/index.ts`)],
    };
};

/**
 * Get CopyPlugins
 *
 * @param browserDir
 * @param outputDir
 * @param sourceDir
 * @returns
 */
export const getCopyPlugins = (browserDir: string, outputDir = 'dev', sourceDir = 'src') => [
    new CopyWebpackPlugin({
        patterns: [
            {
                from: `${sourceDir}/assets`,
                to: path.resolve(__dirname, `../${outputDir}/${browserDir}/assets`),
            },
            {
                from: `${sourceDir}/_locales`,
                to: path.resolve(__dirname, `../${outputDir}/${browserDir}/_locales`),
            },
        ],
    }),
];

/**
 * Get ZipPlugins
 *
 * @param browserDir
 * @param outputDir
 * @returns
 */
export const getZipPlugin = (browserDir: string, outputDir = 'dist') => {
    return [
        new ZipPlugin({
            path: path.resolve(__dirname, `../${outputDir}/${browserDir}`),
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

/**
 * Get Analyzer Plugins
 *
 * @returns
 */
export const getAnalyzerPlugin = () => {
    return [
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
        }),
    ];
};

/**
 * Get CleanWebpackPlugins
 *
 * @param browserDir
 * @param dirs
 * @returns
 */
export const getCleanWebpackPlugin = (browserDir: string, ...dirs: string[]) => {
    return [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                ...(dirs ? dirs.map((dir) => path.join(process.cwd(), `../${dir}/${browserDir}`)) : ['dist', 'temp']),
            ],
            cleanStaleWebpackAssets: false,
            verbose: true,
        }),
    ];
};

/**
 * Get Resolves
 *
 * @returns
 */
export const getResolves = () => {
    return {
        alias: {
            utils: path.resolve(__dirname, '../src/utils/'),
            popup: path.resolve(__dirname, '../src/popup/'),
            background: path.resolve(__dirname, '../src/background/'),
            options: path.resolve(__dirname, '../src/options/'),
            content: path.resolve(__dirname, '../src/content/'),
            assets: path.resolve(__dirname, '../src/assets/'),
            components: path.resolve(__dirname, '../src/components/'),
            types: path.resolve(__dirname, '../src/types/'),
            hooks: path.resolve(__dirname, '../src/hooks/'),
            '@redux': path.resolve(__dirname, '../src/@redux/'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    };
};

/**
 * Get Extension Manifest Plugins
 *
 * @returns
 */
export const getExtensionManifestPlugin = () => {
    return [
        new WebpackExtensionManifestPlugin({
            config: { base: baseManifest },
        }),
    ];
};

export const eslintOptions = {
    fix: true,
};

/**
 * Get Eslint Plugins
 *
 * @returns
 */
export const getEslintPlugin = () => {
    return [new ESLintPlugin(eslintOptions)];
};

/**
 * Get Progress Plugins
 *
 * @returns
 */
export const getProgressPlugins = () => {
    return [new webpack.ProgressPlugin()];
};

/**
 * Environment Configuration Variables
 *
 */
export const config = envConfig;
