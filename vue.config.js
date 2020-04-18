module.exports = {
  transpileDependencies: ["vuetify"],
  publicPath: "/line/ot",
  devServer: {
    contentBase: "/Users/nuke/CH/ot_admin_liff/dist",
    disableHostCheck: true,
    compress: true,
    port: 9000,
    proxy: {
      "^/api": {
        // target: 'https://www.iotplus.cloud/',
        target: "https://ot.iotplus.cloud/",
        // pathRewrite: { '^/api': '' },
        changeOrigin: true,
      },
    },
  },
};
