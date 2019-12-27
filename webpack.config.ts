import * as webpack from "webpack";

const config: webpack.Configuration = {
  mode: "production",
  devtool: "source-map",

  entry: "./src/bundle.ts",
  
  resolve: {
    extensions: [ ".ts", ".tsx", ".js", ".jsx" ]
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          { loader: "ts-loader" }
        ]
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  },

  externals: {
    "bluebird": "Promise",
    "jquery": "$"
  },

  output: {
    filename: "bundle.js"
  }
};

export default config;
