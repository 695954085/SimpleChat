const db = require('./model/db');
const express = require('express');
const router = require('./router/index')
const morgan = require('morgan');
const errorhandler = require('errorhandler');
const passport = require('passport');
const util = require("util");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const ioController = require('./controller/io');
const compression = require('compression');

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
app.use(compression());
app.use(express.static('public'));
require('./passport')(passport);
router(app);
// error handler
app.use(function (err, req, res, next) {
  if (err) {
    res.status(err.status || 500);
    res.send(util.inspect(err));
  }
});
// app.listen(3000, function () {
//   console.log('程序正在监听3000端口')
// });
// 使用默认的namespace
// io.on('connection', function (socket) {
// console.log('a user connected');
// socket.on('disconnect', function () {
//   console.log('user disconnected');
// });
// });
ioController(io);

http.listen(3000, function () {
  console.log('listening on *:3000');
});

