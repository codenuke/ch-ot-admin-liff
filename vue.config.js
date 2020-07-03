module.exports = {
  transpileDependencies: ["vuetify", "vuex-persist"],
  publicPath: "/ot",
  devServer: {
    contentBase: "/Users/nuke/CH/ot_admin_liff/dist",
    disableHostCheck: true,
    compress: true,
    port: 9000,
    proxy: {
      "^/api": {
        // target: 'https://www.iotplus.cloud/',
        target: "https://tmr.choheng.com/",
        // pathRewrite: { '^/api': '' },
        changeOrigin: true,
      },
    },
  },
};
