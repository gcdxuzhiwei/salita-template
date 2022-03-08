const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const chalk = require("chalk");
const fs = require("fs");
const dotenv = require("dotenv");

const { DefinePlugin } = webpack;

if (!fs.existsSync(path.resolve(__dirname, "..", ".env"))) {
  console.log(chalk.red(".env文件不存在"));
  process.exit(1);
}

dotenv.config();

module.exports = (isDev) => {
  const dllRoot = `../dll/${isDev ? "development" : "production"}`;
  const dllPlugins = [];
  fs.readdirSync(path.resolve(__dirname, dllRoot)).forEach((file) => {
    if (/.*\.dll.js$/.test(file)) {
      dllPlugins.push(
        new AddAssetHtmlPlugin({
          filepath: path.resolve(__dirname, `${dllRoot}/${file}`),
          files: "index.html",
        })
      );
    } else if (/.*\.manifest.json$/.test(file)) {
      dllPlugins.push(
        new webpack.DllReferencePlugin({
          context: __dirname,
          manifest: path.resolve(__dirname, `${dllRoot}/${file}`),
        })
      );
    }
  });

  return {
    entry: {
      index: path.resolve(__dirname, "../src/index.tsx"),
    },
    output: {
      path: path.resolve(__dirname, "../dist"), //必须是绝对路径
      filename: "[name].[chunkhash:8].bundle.js",
      chunkFilename: "[name].[chunkhash:8].chuck.js",
      publicPath: "/", //通常是CDN地址
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".less", ".css"],
    },
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          use: [
            "thread-loader",
            {
              loader: "babel-loader",
              options: {
                cacheDirectory: true,
              },
            },
          ],
          include: [path.resolve(__dirname, "../src")],
        },
        {
          test: /\.css$/,
          use: [
            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
          ],
          include: [
            path.resolve(__dirname, "../src"),
            path.resolve(__dirname, "../node_modules/antd/dist"),
          ],
        },
        {
          test: /\.less$/,
          use: [
            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "less-loader",
          ],
          include: [path.resolve(__dirname, "../src")],
          exclude: [/\.module(s?)\.less$/],
        },
        {
          test: /\.module(s?)\.less$/,
          include: [path.resolve(__dirname, "../src")],
          use: [
            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: isDev
                    ? "[path][name]__[local]"
                    : "[name]--[hash:base64:5]",
                },
              },
            },
            "postcss-loader",
            "less-loader",
          ],
        },
        {
          test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 10240, //10K
                esModule: false,
                name: "[name].[hash:8].[ext]",
                outputPath: "assets",
              },
            },
          ],
          include: [path.resolve(__dirname, "../src")],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        filename: "index.html",
        minify: {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
        },
        hash: true,
        chunks: ["index"],
      }),
      new HtmlWebpackPlugin({
        template: "./public/login.html",
        filename: "login.html",
        minify: {
          removeAttributeQuotes: true,
          collapseWhitespace: true,
        },
        hash: true,
        chunks: [],
      }),
      new MiniCssExtractPlugin({
        filename: "[name].[chunkhash:8].css",
      }),
      new DefinePlugin({
        "process.env": JSON.stringify(process.env),
      }),
      ...dllPlugins,
    ],
  };
};
