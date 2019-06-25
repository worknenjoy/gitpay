require('babel-register')({
  'ignore': [
    'node_modules/**/*'
  ],
  presets: ['es2015', 'react'],
  plugins: [
    'transform-object-rest-spread',
    'transform-class-properties'
  ]
})

const router = require('./src/main/routes-sitemap').default
const Sitemap = require('react-router-sitemap').default

console.log(router);

(
  new Sitemap(router)
    .build('http://gitpay.me')
    .save('./public/sitemap.xml')
)
