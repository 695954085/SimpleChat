const Strategy = require('passport-http-bearer').Strategy;
const User = require('../model/user');

module.exports = function (passport) {
  return passport.use(new Strategy(function (token, done) {
    User.findOne({ token: token }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'all' });
    });
  }))
}