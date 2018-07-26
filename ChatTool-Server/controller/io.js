import socketDb from './socketdb'
import chalk from '../node_modules/chalk';

function IoContoller(io) {
  // 使用默认的namespace, 默认进入大厅
  io.on('connection', function (socket) {
    console.log(chalk.green('a user connected --------> ' + new Date() + ' -------> ' + socket.id))
    // let client = new Client(socket, socketDb, io);
    socketDb.createClient(socket)
  });
}

export default function (io) {
  return IoContoller(io);
}