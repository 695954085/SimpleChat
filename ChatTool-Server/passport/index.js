const Strategy = require('passport-http-bearer').Strategy;


module.exports = function (passport) {
  return passport.use(new Strategy(function (token, done) {

  }))
}