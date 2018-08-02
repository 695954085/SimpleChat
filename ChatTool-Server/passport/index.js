import passportHttpBearer from 'passport-http-bearer'
import User from '../model/user'
import jwt from 'jsonwebtoken'
import config from 'config'

const Strategy = passportHttpBearer.Strategy

export default function (passport) {
  return passport.use(new Strategy(function (token, done) {
    jwt.verify(token, config.get('Customer.jwtSecret'), function (err, decoded) {
      if (err) {
        return done(err)
      }
      let { username } = decoded
      User.findOne({ username, token }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user, { scope: 'all' });
      });
    })
  }))
}