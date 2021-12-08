module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['import', { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: 'css' }] // `style: true` 会加载 less 文件
  ]
}
