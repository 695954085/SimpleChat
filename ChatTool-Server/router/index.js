var v1 = require('./v1');

module.exports = function (app) {
  app.use('/v1',v1);
}

