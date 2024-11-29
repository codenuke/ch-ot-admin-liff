module.exports = {
  transpileDependencies: ["vuetify", "vuex-persist"],
  publicPath: "/",
  devServer: {
    contentBase: "/Users/nuke/CH/ot_admin_liff/dist",
    disableHostCheck: true,
    compress: true,
    port: 9000,
    proxy: {
      "^/api": {
        target: "https://line.choheng.com/",
        // pathRewrite: { '^/api': '' },
        changeOrigin: true,
      },
    },
  },
};
