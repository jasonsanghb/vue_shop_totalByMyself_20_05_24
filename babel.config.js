
// 这是项目发布阶段需要用到的特定的插件
const prodPlugin = []
if(process.env.Node_ENV==='production'){
    prodPlugin.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
      ...prodPlugin,
      '@babel/plugin-syntax-dynamic-import'
  ]
}
