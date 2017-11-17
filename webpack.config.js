const path = require("path");
const webpack = require("webpack");

const config = {
  context: __dirname,
  entry: ["./src/components/ClientApp.jsx"],
  devtool: process.env.NODE_ENV !== "production" ? "cheap-eval-source-map" : false,
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
    publicPath: "/public/"
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"]
  },
  devServer: {
    hot: true,
    publicPath: "/public/",
    historyApiFallback: true
  },
  stats: {
    colors: true,
    reasons: true
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NamedModulesPlugin()],
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

if (process.env.NODE_ENV !== "production") {
  config.entry.unshift(
    "react-hot-loader/patch",
    "webpack-dev-server/client?http://localhost:8080",
    "webpack/hot/only-dev-server"
  );
  config.module.rules.unshift({
    test: /\.jsx?$/,
    enforce: "pre",
    loader: "eslint-loader",
    exclude: /node_modules/
  });
}

module.exports = config;
