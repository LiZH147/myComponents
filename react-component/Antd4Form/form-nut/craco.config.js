// /* craco.config.js */
// const CracoLessPlugin = require("craco-less");
// module.exports = {
//     babel: {
//         plugins: [["@babel/plugin-proposal-decorators", { leyacy: true }]],
//     },
//     plugins: [
//         {
//             plugin: CracoLessPlugin,
//             options: {
//                 lessLoaderOptions: {
//                     lessOptions: { javascriptEnabled: true }
//                 },
//                 modifyLessRule: function(){
//                     return{
//                         test: /\.less$/,
//                         exclude: /node_modules/,
//                         use: [
//                             {loader: "style-loader"},
//                             {
//                                 loader: "css-loader",
//                                 options: {
//                                     modules:{
//                                         localIdentName:"[local]_[hash:base63:6]",
//                                     },
//                                 },
//                             },
//                             {loader: "less-loader"}
//                         ]
//                     }
//                 }
//             }
//         }
//     ]
// }


// * 配置完成后记得重启下
const CracoLessPlugin = require("craco-less");

module.exports = {
  babel: {
    //用来支持装饰器
    plugins: [["@babel/plugin-proposal-decorators", {legacy: true}]]
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "red",
              "@border-color-base": "green",
              "@link-color": "orange"
            },
            javascriptEnabled: true
          }
        }
      }
    }
  ]
};