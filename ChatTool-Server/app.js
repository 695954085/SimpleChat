require("babel-core/register");
require("babel-polyfill");
const server = require('./index')
if (!module.parent) {
  server.listen(3000, () => {
    console.log('listening on *:3000');
  })
}
module.exports = server
