const path = require("path");

module.exports = {
  context: __dirname,
  entry: "./js/ClientApp.jsx",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
    publicPath: "/public/"
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    modules: [path.resolve(__dirname, "node_modules")]
  },
  resolveLoader: {
    modules: [path.resolve(__dirname, "node_modules")]
  },
  devServer: {
    publicPath: "/public/",
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loaders: ["pug-loader?self"]
      },
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"]
      },
      {
        enforce: "pre",
        test: /\.jsx?$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        query: {
          presets: ["es2015"]
        },
        exclude: /node_modules/
      }
    ]
  }
};
