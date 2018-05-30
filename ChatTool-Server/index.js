const db = require('./model/db');
const express = require('express');
const router = require('./router/index')
const morgan = require('morgan');
const app = express();
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}))
router(app);
app.listen(3000, function () {
  console.log('程序正在监听3000端口')
});

