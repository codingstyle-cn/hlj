module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
  ],
  plugins: [
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-async-to-generator",
  ],
};
