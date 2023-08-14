import { ProgressPlugin, DefinePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ZipPlugin from 'zip-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import WebpackExtensionManifestPlugin from 'webpack-extension-manifest-plugin';
import deepMerge from 'deepmerge';
import * as fs from 'fs';

const ExtReloader = require('webpack-ext-reloader-mv3');

const baseManifest = require('./src/manifest.json');

const platformManifests = {
    chrome: require('./src/manifest_chrome.json'),
    firefox: require('./src/manifest_firefox.json'),
    opera: require('./src/manifest_opera.json'),
    edge: require('./src/manifest_edge.json'),
};

const dotenv = require('dotenv').config({ path: __dirname + '/.env' });

type AvailableTargets = 'chrome' | 'firefox' | 'opera' | 'edge';

interface EnvironmentConfig {
    NODE_ENV: string;
    OUTPUT_DIR: string;
    TARGET: string;
}

export const Directories = {
    DEV_DIR: 'dev',
    DIST_DIR: 'dist',
    TEMP_DIR: 'temp',
    SRC_DIR: 'src',
};

/**
 * Environment Config
 *
 */
const EnvConfig: EnvironmentConfig = {
    OUTPUT_DIR:
        process.env.NODE_ENV === 'production'
            ? Directories.TEMP_DIR
            : process.env.NODE_ENV === 'upload'
            ? Directories.DIST_DIR
            : Directories.DEV_DIR,
    ...(process.env.NODE_ENV ? { NODE_ENV: process.env.NODE_ENV } : { NODE_ENV: 'development' }),
    ...(process.env.TARGET ? { TARGET: process.env.TARGET } : { TARGET: 'chrome' }),
};

/**
 * Get HTML Plugins
 *
 * @param browserDir
 * @param outputDir
 * @param sourceDir
 * @returns
 */
export const getHTMLPlugins = (
    browserDir: string,
    outputDir = Directories.DEV_DIR,
    sourceDir = Directories.SRC_DIR
): HtmlWebpackPlugin[] => {
    const plugins: HtmlWebpackPlugin[] = [];
    if (fs.existsSync(path.resolve(__dirname, `${sourceDir}/popup/index.html`))) {
        plugins.push(
            new HtmlWebpackPlugin({
                title: 'Popup',
                filename: path.resolve(__dirname, `${outputDir}/${browserDir}/popup/index.html`),
                template: path.resolve(__dirname, `${sourceDir}/popup/index.html`),
                chunks: ['popup'],
            })
        );
    }
    if (fs.existsSync(path.resolve(__dirname, `${sourceDir}/options/index.html`))) {
        plugins.push(
            new HtmlWebpackPlugin({
                title: 'Options',
                filename: path.resolve(__dirname, `${outputDir}/${browserDir}/options/index.html`),
                template: path.resolve(__dirname, `${sourceDir}/options/index.html`),
                chunks: ['options'],
            })
        );
    }
    return plugins;
};

const overwriteMerge = (destinationArray: unknown[], sourceArray: unknown[]) => sourceArray;

const getPlatformManifest = (target: AvailableTargets): Record<string, unknown> => {
    const platformManifest = platformManifests[target] || {};

    const resources = ['assets/*'];
    // const manifest = cloneDeep(baseManifest);

    if (fs.existsSync(path.resolve(__dirname, 'src/content/index.tsx'))) {
        resources.push('content/*');
        Object.assign(baseManifest, {
            content_scripts: [
                {
                    matches: ['http://*/*', 'https://*/*'],
                    js: ['content/content.js'],
                },
            ],
        });
    }

    if (fs.existsSync(path.resolve(__dirname, 'src/options/index.html'))) {
        resources.push('options/*');
        Object.assign(baseManifest, {
            options_ui: {
                page: 'options/index.html',
            },
        });
    }

    if (fs.existsSync(path.resolve(__dirname, 'src/popup/index.html'))) {
        resources.push('popup/*');
        Object.assign(baseManifest, {
            action: {
                ...baseManifest.action,
                default_popup: 'popup/index.html',
            },
        });
    }

    if (fs.existsSync(path.resolve(__dirname, 'src/background/index.ts'))) {
        resources.push('background/*');
        Object.assign(baseManifest, {
            background: {
                service_worker: 'background/background.js',
            },
        });
    }
    Object.assign(baseManifest, {
        web_accessible_resources: [{ ...baseManifest.web_accessible_resources[0], resources }],
    });
    return deepMerge(baseManifest, platformManifest, {
        arrayMerge: overwriteMerge,
    });
};

/**
 * Get DefinePlugins
 *
 * @param config
 * @returns
 */
export const getDefinePlugins = (config = {}) => [
    new DefinePlugin({
        'process.env': JSON.stringify({ ...config, ...(dotenv.parsed ?? {}) }),
    }),
];

/**
 * Get Output Configurations
 *
 * @param browserDir
 * @param outputDir
 * @returns
 */
export const getOutput = (browserDir: string, outputDir = Directories.DEV_DIR) => {
    return {
        path: path.resolve(process.cwd(), `${outputDir}/${browserDir}`),
        filename: '[name]/[name].js',
    };
};

/**
 * Get Entry Points
 *
 * @param sourceDir
 * @returns
 */
export const getEntry = (sourceDir = Directories.SRC_DIR) => {
    const entries = {};
    if (fs.existsSync(path.resolve(__dirname, `${sourceDir}/popup/index.html`))) {
        Object.assign(entries, { popup: [path.resolve(__dirname, `${sourceDir}/popup/index.tsx`)] });
    }
    if (fs.existsSync(path.resolve(__dirname, `${sourceDir}/content/index.tsx`))) {
        Object.assign(entries, { content: [path.resolve(__dirname, `${sourceDir}/content/index.tsx`)] });
    }
    if (fs.existsSync(path.resolve(__dirname, `${sourceDir}/background/index.ts`))) {
        Object.assign(entries, { background: [path.resolve(__dirname, `${sourceDir}/background/index.ts`)] });
    }
    if (fs.existsSync(path.resolve(__dirname, `${sourceDir}/options/index.html`))) {
        Object.assign(entries, { options: [path.resolve(__dirname, `${sourceDir}/options/options.tsx`)] });
    }
    return entries;
};

/**
 * Get CopyPlugins
 *
 * @param browserDir
 * @param outputDir
 * @param sourceDir
 * @returns
 */
export const getCopyPlugins = (
    browserDir: string,
    outputDir = Directories.DEV_DIR,
    sourceDir = Directories.SRC_DIR
) => {
    return [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, `${sourceDir}/assets`),
                    to: path.resolve(__dirname, `${outputDir}/${browserDir}/assets`),
                },
                {
                    from: path.resolve(__dirname, `${sourceDir}/_locales`),
                    to: path.resolve(__dirname, `${outputDir}/${browserDir}/_locales`),
                },
            ],
        }),
    ];
};

/**
 * Get ZipPlugins
 *
 * @param browserDir
 * @param outputDir
 * @returns
 */
export const getZipPlugins = (browserDir: string, outputDir = Directories.DIST_DIR) => {
    return [
        new ZipPlugin({
            path: path.resolve(process.cwd(), `${outputDir}/${browserDir}`),
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
export const getAnalyzerPlugins = () => {
    return [
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
        }),
    ];
};

/**
 * Get CleanWebpackPlugins
 *
 * @param dirs
 * @returns
 */
export const getCleanWebpackPlugins = (...dirs: string[]) => {
    return [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [...dirs?.map((dir) => path.join(process.cwd(), `${dir}`) ?? [])],
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
    const aliases = {
        utils: path.resolve(__dirname, './src/utils/'),
        assets: path.resolve(__dirname, './src/assets/'),
        components: path.resolve(__dirname, './src/components/'),
        types: path.resolve(__dirname, './src/types/'),
        hooks: path.resolve(__dirname, './src/hooks/'),
        '@redux': path.resolve(__dirname, './src/@redux/'),
    };
    if (fs.existsSync(path.resolve(__dirname, 'src/popup/index.html'))) {
        Object.assign(aliases, { options: path.resolve(__dirname, './src/popup/') });
    }
    if (fs.existsSync(path.resolve(__dirname, 'src/background/index.ts'))) {
        Object.assign(aliases, { background: path.resolve(__dirname, './src/background/') });
    }
    if (fs.existsSync(path.resolve(__dirname, 'src/options/index.html'))) {
        Object.assign(aliases, { options: path.resolve(__dirname, './src/options/') });
    }
    if (fs.existsSync(path.resolve(__dirname, 'src/content/index.tsx'))) {
        Object.assign(aliases, { content: path.resolve(__dirname, './src/content/') });
    }
    return {
        alias: aliases,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    };
};

/**
 * Get Extension Manifest Plugins
 *
 * @returns
 */
export const getExtensionManifestPlugins = () => {
    return [
        new WebpackExtensionManifestPlugin({
            config: { base: getPlatformManifest(EnvConfig.TARGET as AvailableTargets) },
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
export const getEslintPlugins = (options = eslintOptions) => {
    return [new ESLintPlugin(options)];
};

/**
 * Get Progress Plugins
 *
 * @returns
 */
export const getProgressPlugins = () => {
    return [new ProgressPlugin()];
};

/**
 * Environment Configuration Variables
 *
 */
export const config = EnvConfig;

/**
 * Get Extension Reloader Plugin
 *
 * @returns
 */
export const getExtensionReloaderPlugins = () => {
    const entries = {};
    const extension_pages = [];
    if (fs.existsSync(path.resolve(__dirname, 'src/content/index.tsx'))) {
        Object.assign(entries, { contentScript: ['content'] });
    }
    if (fs.existsSync(path.resolve(__dirname, 'src/background/index.ts'))) {
        Object.assign(entries, { background: 'background' });
    }
    if (fs.existsSync(path.resolve(__dirname, 'src/popup/index.html'))) {
        extension_pages.push('popup');
    }
    if (fs.existsSync(path.resolve(__dirname, 'src/options/index.html'))) {
        extension_pages.push('options');
    }

    Object.assign(entries, { extension_pages: extension_pages });

    return [
        new ExtReloader({
            port: 9090,
            reloadPage: true,
            entries,
        }),
    ];
};
