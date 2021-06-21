const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");


const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";


const optimization = () => {
    const config = {
    };

    if(isProd) {
        config.minimizer = [
            new TerserWebpackPlugin()
        ]
    }
    return config;
};

const cssLoaders = (extra) => {
    const loaders = [{
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: ''
        }
    }, "css-loader"];

    if(extra) {
        loaders.push(extra);
    }
    return loaders;
}







const getPlugins = () => {
    const plugins = [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({template: "./index.html", minify: {
                collapseWhitespace: isProd
            }}),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/assets/favicon.ico"),
                    to: path.resolve(__dirname, "dist")
                }]
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        })
    ];

    if (isProd) {
       
    }

    return plugins;
}

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: process.env.NODE_ENV,
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 8080,
        hot: isDev,
    },
    entry: {
        main: ["./index.tsx"],
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),

    },
    resolve: {
        extensions: [".js",".jsx",".css", ".ts", ".tsx"],
        alias: {
            "@models": path.resolve(__dirname, "src/models"),
            "@": path.resolve(__dirname, "src")
        }
    },
    optimization: optimization(),
    plugins: getPlugins(),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ["file-loader"]
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ["file-loader"]
            },
            {
                test: /\.xml$/,
                use: ["xml-loader"]
            },
            {
                test: /\.csv$/,
                use: ["csv-loader"]
            },
            {
                test: /\.scss$/,
                use: cssLoaders("sass-loader")
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader'
                }
            }
        ]
    }
};