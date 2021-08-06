const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()

// app.get('/', (req, res) => {
//   res.send('hello world')
// })

// 托管静态资源，默认会查找静态资源目录中的 index.html
app.use(express.static('./dist'))

app.use('/boss', createProxyMiddleware({
  target: 'http://eduboss.lagou.com',
  changeOrigin: true
}))
app.use('/front', createProxyMiddleware({
  target: 'http://edufront.lagou.com',
  changeOrigin: true
}))

app.listen(3000, () => {
  console.log('runing at http://localhost:3000/')
})
