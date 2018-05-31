const db = require('./model/db');
const express = require('express');
const router = require('./router/index')
const morgan = require('morgan');
const errorhandler = require('errorhandler');
const app = express();
if (process.env.NODE_ENV == 'development') {
  app.use(errorhandler())
}
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
// error handler
app.use(function (err, req, res, next) {
  if (err) {
    res.status(err.status || 500);
    res.send(err);
  }
});
app.listen(3000, function () {
  console.log('程序正在监听3000端口')
});

