const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const PRODUCTION = false;

module.exports = {
  entry: {
    students: path.resolve(__dirname, "./javascript/students.js"),
    groups: path.resolve(__dirname, "./javascript/groups.js"),
  },
  output: {
    path: path.resolve(__dirname, "../server/public"),
    filename: "javascript/[name].js",
  },
  mode: PRODUCTION ? "production" : "development",
  devtool: PRODUCTION ? undefined : "eval-source-map",

  devServer: {
    static: {
      directory: path.resolve(__dirname, "../server/public"), // Changed to match output path
      watch: true,
    },
    host: "localhost",
    port: 8888,
    open: true,
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./html/students.html"),
      filename: "students.html",
      chunks: ["students"],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./html/groups.html"),
      filename: "groups.html",
      chunks: ["groups"],
    }),
    new CopyPlugin({
      patterns: [
        { from: "./html/index.html", to: "index.html", noErrorOnMissing: true },
        {
          from: "./images/*",
          to: "images/[name][ext]",
          noErrorOnMissing: true,
        },
        { from: "./style/*", to: "style/[name][ext]", noErrorOnMissing: true },
        { from: "./javascript/*", to: "javascript/[name][ext]" },
      ],
    }),
  ],
  mode: "development",
};
