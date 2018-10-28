module.exports = {
  entry: "./src/main.js",
  output: {
    path: __dirname,
    filename: "main.js",
    libraryTarget: "commonjs2"
  },
  devtool: "none",
  externals: {
    uxp: "uxp",
    scenegraph: "scenegraph",
    commands: "commands"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          plugins: ["transform-react-jsx"]
        }
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  }
}
