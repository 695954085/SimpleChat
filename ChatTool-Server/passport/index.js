import passportHttpBearer from 'passport-http-bearer'
import User from '../model/user'
import jwt from 'jsonwebtoken'
import config from 'config'

const Strategy = passportHttpBearer.Strategy

export default function (passport) {
	return passport.use(new Strategy(async function (token, done) {
		let decoded
		try {
			decoded = await jwt.verifyAsync(token, config.get('Customer.jwtSecret'))
		} catch (err) {
			if (err.name === 'TokenExpiredError') {
				decoded = jwt.decode(token)
				return done(err, decoded.username)
			}
			return done(err)
		}
		try {
			let { username } = decoded
			let query = User.findOne({ username, token })
			let user = await query.exec()
			done(null, user, { scope: 'all' })
		} catch (err) {
			done(null, false)
		}
	}))
}
