const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    index: "./src/index.js", // Entry point for your main application
    background: "./src/background.js", // Entry point for your background script
  },
  output: {
    filename: "[name].bundle.js", // Use [name] to dynamically generate output filenames
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.html$/,
        use: "html-loader",
      },
    ],
  },
  devtool: "source-map",
  target: "web",
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new webpack.DefinePlugin({
      "process.env": "{}",
    }),
  ],
};
