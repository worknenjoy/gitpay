require('@babel/register')({
  ignore: [
    'node_modules/**/*'
  ],
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-proposal-class-properties']
})

const router = require('./src/main/routes-sitemap').default
const Sitemap = require('react-router-sitemap').default

console.log(router);

(
  new Sitemap(router)
    .build('http://gitpay.me')
    .save('./public/sitemap.xml')
)
