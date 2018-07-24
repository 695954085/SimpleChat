
import './model/db'
const express = require('express');
const router = require('./router/index')
const morgan = require('morgan');
const errorhandler = require('errorhandler');
const passport = require('passport');
const util = require("util");
const app = module.exports = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
// const ioController = require('./controller/io');
import ioController from './controller/io';
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
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin','*')
  next();
})
require('./passport')(passport);
router(app);
// error handler
app.use(function (err, req, res, next) {
  if (err) {
    res.status(err.status || 500);
    res.send(util.inspect(err));
  }
});
ioController(io);
export default app

