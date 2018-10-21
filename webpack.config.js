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
  optimization: {
    minimize: false
  }
}
