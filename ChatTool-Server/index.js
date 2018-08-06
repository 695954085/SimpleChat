import './model/db'
import express from 'express'
import router from './router/index'
import morgan from 'morgan'
import errorhandler from 'errorhandler'
import passport from 'passport'
import http from 'http'
import SocketIO from 'socket.io'
import ioController from './controller/io'
import compression from 'compression'
import Passport from './passport'

const app = express();
const server = http.createServer(app);
const io = SocketIO(server)
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
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next();
})
Passport(passport)
router(app);
// error handler
app.use(function (err, req, res, next) {
  if (err) {
    res.setHeader('ContentType','application/json;chatset=utf-8')
    res.status(err.status || 500);
    res.send({message: err.message});
  }
});
ioController(io);

module.exports = server