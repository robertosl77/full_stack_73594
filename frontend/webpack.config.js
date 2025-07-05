module: {
  rules: [
    {
      test: /\.js$/,
      enforce: 'pre',
      use: ['source-map-loader'],
      exclude: [/node_modules\/firebase/]  // ⬅️ aquí lo agregás
    }
  ]
}