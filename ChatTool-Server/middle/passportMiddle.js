import passport from 'passport'
import socketDb from '../controller/socketdb'
import createError from 'http-errors'

let passportMiddle = function (req, res, next) {
	passport.authenticate('bearer', { session: false }, function (err, user, info) {
		if (err) {
			if (typeof user === 'string') {
				let client = socketDb.getClientByUserName(user)
				if (client) {
					client.user = null
				}
			}
			return next(createError(401, err))
		}
		if (user === false)
			return next(createError(401, '没有token或者toke异常'))
		return next()
	})(req, res, next)
}
export default passportMiddle
