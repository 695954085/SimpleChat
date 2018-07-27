import bodyParser from 'body-parser'
import express from 'express'
import socketdb from '../controller/socketdb'
import passport from 'passport'

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router()

/**
 * 提供某个房间的dialogs
 */
router.get('/room/:roomId', socketdb.getRoomDialog)

/**
 * 提供某个房间的在线人数
 */
router.get('/online/:roomId', socketdb.getRoomOnlineClients)

export default router