var v1 = require('./v1');
// var v2 = require('./v2');

module.exports = function (app) {
  app.use('/v1',v1);
}

