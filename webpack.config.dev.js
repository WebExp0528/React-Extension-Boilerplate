const ESLintPlugin = require("eslint-webpack-plugin");
const {
    getHTMLPlugins,
    getOutput,
    getCopyPlugins,
    getFirefoxCopyPlugins,
    getEntry,
    getResolves,
} = require("./webpack.utils");

const config = require("./config.json");

const generalConfig = {
    mode: "development",
    devtool: "source-map",
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
};

const eslintOptions = {
    fix: true,
};

module.exports = [
    {
        ...generalConfig,
        entry: getEntry(config.chromePath),
        output: getOutput("chrome", config.devDirectory),
        plugins: [
            new ESLintPlugin(eslintOptions),
            ...getHTMLPlugins("chrome", config.devDirectory, config.chromePath),
            ...getCopyPlugins("chrome", config.devDirectory, config.chromePath),
        ],
    },
    {
        ...generalConfig,
        entry: getEntry(config.operaPath),
        output: getOutput("opera", config.devDirectory),
        plugins: [
            new ESLintPlugin(eslintOptions),
            ...getHTMLPlugins("opera", config.devDirectory, config.operaPath),
            ...getCopyPlugins("opera", config.devDirectory, config.operaPath),
        ],
    },
    {
        ...generalConfig,
        entry: getEntry(config.firefoxPath),
        output: getOutput("firefox", config.devDirectory),
        plugins: [
            new ESLintPlugin(eslintOptions),
            ...getFirefoxCopyPlugins(
                "firefox",
                config.devDirectory,
                config.firefoxPath
            ),
            ...getHTMLPlugins(
                "firefox",
                config.devDirectory,
                config.firefoxPath
            ),
        ],
    },
];
