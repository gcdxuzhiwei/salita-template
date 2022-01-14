const webpack = require("webpack");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = ["development", "production"].map((mode, index) => ({
  entry: {
    react: ["react", "react-dom"],
    utils: ["antd"],
  },
  mode,
  devtool: index === 0 ? "eval-cheap-module-source-map" : "source-map",
  output: {
    filename: "[name].[contenthash:8].dll.js",
    path: path.resolve(__dirname, `../dll/${mode}`),
    library: "_dll_[name]", //暴露给外部使用
    //libraryTarget 指定如何暴露内容，缺省时就是 var
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      context: __dirname,
      //name和library一致
      name: "_dll_[name]",
      path: path.resolve(__dirname, `../dll/${mode}/[name].manifest.json`), //manifest.json的生成路径
    }),
  ],
}));
