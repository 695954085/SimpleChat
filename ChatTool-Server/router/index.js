var v1 = require('./v1');

module.exports = function (app) {
  app.use('/v1',v1);
}

// exports = v1; 如果exports指向一个对象，那么最终有限require其实是module.exports 那么会导致module.exports还是指向空对象的，断链

