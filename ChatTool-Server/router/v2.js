// import bodyParser from 'body-parser'
import express from 'express'
import socketdb from '../controller/socketdb'
import passportMiddle from '../middle/passportMiddle'

// create application/x-www-form-urlencoded parser
// let urlencodedParser = bodyParser.urlencoded({ extended: false })
let router = express.Router()

/**
 * 提供某个房间的dialogs
 */
router.get('/:roomId/conversation', passportMiddle, socketdb.getRoomDialog)

/**
 * 提供某个房间的在线人数
 */
router.get('/:roomId/online', passportMiddle, socketdb.getRoomOnlineClients)

/**
 * 提供某个用户所拥有的房间数量
 */
router.get('/:username/rooms', passportMiddle, socketdb.getUserRooms)

/**
 * 提供某个房间的详情
 * 用戶、群主、别名aliases
 */
router.get('/:roomId/details', passportMiddle, socketdb.getRoomDetails)


export default router
