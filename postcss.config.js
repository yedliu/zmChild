module.exports = {
  modules: true,
  plugins: {
    autoprefixer: { browsers: ['chrome >= 50', '> 5%'] },
    'postcss-modules': {
      generateScopedName: '[name]_[local]',
      globalModulePaths: [/.+\.scss/],
    },
    'postcss-pxtorem': {
      rootValue: '100',
      replace: true,
      propList: ['*'],
    },
  },
};
// "postcss-modules": {
//     // globalModulePaths: [/src[\\\/]styles/, /src[\\\/]styles/]
//     globalModulePaths: [/.+\.css/]
// }
// "plugins": [
//     require('postcss-modules')({
//         globalModulePaths: [/.+\.css/]
//     }),
//     {
//         "autoprefixer": { "browsers": ["last 1 version"] }
//     }
// ]
