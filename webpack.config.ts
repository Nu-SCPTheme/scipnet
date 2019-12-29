import * as webpack from "webpack";

const config: webpack.Configuration = {
  mode: "production",
  devtool: "source-map",
  
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
    "chai", "chai",
    "jquery": "$",
    "preact": "preact"
  }
};

const bundleConfig = Object.assign({}, config, {
  entry: "./src/bundle.ts",
  output: { filename: "bundle.js" } 
});

const testConfig = Object.assign({}, config, {
  entry: "./test/unit/index.ts",
  output: { filename: "test.js" }
});

const configs = [bundleConfig, testConfig];

export default configs;
