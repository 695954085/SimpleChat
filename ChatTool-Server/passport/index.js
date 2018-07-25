import passportHttpBearer from 'passport-http-bearer'
import User from '../model/user'

const Strategy = passportHttpBearer.Strategy


export default function (passport) {
  return passport.use(new Strategy(function (token, done) {
    User.findOne({ token: token }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'all' });
    });
  }))
}
// module.exports = function (passport) {
//   return passport.use(new Strategy(function (token, done) {
//     User.findOne({ token: token }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       return done(null, user, { scope: 'all' });
//     });
//   }))
// }