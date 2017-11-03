const path = require("path");

module.exports = {
  context: __dirname,
  entry: "./js/ClientApp.jsx",
  devtool: process.env.NODE_ENV === "development" ? "cheap-eval-source-map" : false,
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
    publicPath: "/public/"
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"]
  },
  devServer: {
    publicPath: "/public/",
    historyApiFallback: true
  },
  stats: {
    colors: true,
    reasons: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"]
      },
      {
        test: /\.jsx?$/,
        loader: "babel-loader"
      }
    ]
  }
};
