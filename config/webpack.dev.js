const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = merge(common(true), {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  devServer: {
    port: "2222",
    open: true,
    hot: true,
  },
  plugins: [
    new ReactRefreshWebpackPlugin({
      overlay: false,
    }),
  ],
});
